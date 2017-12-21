angular.module('JTextMinerApp')
    .factory('search', function (APIService, $q, $http) {
        function getMatches(queryString, regex) {
            const remainingQuery = queryString.replace(regex, '');
            let matches = [];
            let match;
            let stop = false;
            while (!stop && null !== (match = regex.exec(queryString))) {
                matches.push(match[1]);
                if (!regex.global) stop = true;
            }
            return { remainingQuery, matches }
        }

        function parseQueryString(queryString) {
            const quoted = getMatches(queryString, /"([^"]*)"/g);
            const lexemeParam = getMatches(quoted.remainingQuery, /lexeme:(\S+)/);
            const terms = getMatches(lexemeParam.remainingQuery, /(\S+)+/g);
            const lexemes = lexemeParam.matches.length === 0 ? [] : lexemeParam.matches[0].replace(/-/g,' ').split('+');
            return { terms: quoted.matches.concat(terms.matches), lexemes };
        }

        function stringifyQuery(terms, lexemes) {
            // we don't yet support queries with quotes, and this yields suprising results for Merodach-baladan, so it's temporarily disabled
            //const termQuery = terms.map(term => term.includes(' ') ? `"${term}"` : term ).join(' ');
            const termQuery = terms.join(' ');
            const lexemeQuery = lexemes.length === 0 ? null : 'lexeme:' + lexemes.join('+').replace(/ /g,'-');
            return _.compact([termQuery, lexemeQuery]).join(' ');
        }

        function makeBaseQuery(queryString, options = {}) {
            const matchType = options.matchType ? options.matchType : "phrase";
            let result = {
                "multi_match": {
                    "type": matchType,
                    "slop": 1000,
                    "fields": ["parsed_text*"],
                    "query": queryString,
                    "tie_breaker": 0.001
                }
            };
            if (options.minimum_should_match)
                result.multi_match["minimum_should_match"] = options.minimum_should_match;
            return result;
        }
        
        const lexemeTypes = {
            adjv: "Adjective",
            advb: "Adverb",
            conj: "Conjunction",
            art: "Article",
            intj: "Interjection",
            inrg: "Interrogative",
            subs: "Noun",
            nega: "Negative",
            prep: "Preposition",
            prde: "Demonstrative pronoun",
            prin: "Interrogative pronoun",
            nmpr: "Proper noun",
            prps: "Personal pronoun",
            verb: "Verb"
        };

        const service = {
            RESULTS_AT_A_TIME: 20,
            query: "",
            offset: 0,
            smallUnitsOnly: true,
            sortByCorpusOrder: true,
            searchResults: [],
            searchResponse: false,
            searching: false,
            parseQueryString,
            stringifyQuery,
            synonyms: {},
            search(offset) {
                service.searchResults = [];
                if (!offset)
                    service.offset = 0;
                else
                    service.offset = offset;
                if (this.lastQuery !== this.query) {
                    this.lastQuery = this.query;
                    return service.submitSearch();
                }
                else
                    return this.updateSearch();
            },
            updateSearch() {
                service.searching = true;
                this.fullQuery.query.bool.filter[this.fullQuery.query.bool.filter.length - 1].ids.values
                    = (service.smallUnitsOnly ? service.smallUnitResults : service.completeResults)
                    .slice(this.offset, this.offset + service.RESULTS_AT_A_TIME);
                return APIService.search(this.fullQuery)
                    .then(function (response) {
                        service.searchResults = response.data.hits.hits;
                        service.searchResponse = true;
                        service.searching = false;
                    })
            },
            submitSearch() {
                service.searching = true;
                service.smallUnitsOnly = true;
                const queryParamRegex = /(\S+:\S+)/g;
                const queryData = parseQueryString(service.query);

                const baseQuery = makeBaseQuery(queryData.terms.join(' '), {"minimum_should_match": "3<80%"});

                this.fullQuery = {
                    "query": {
                        "bool": {
                            "must": [baseQuery],
                            // values will be populated with values from the pre-query
                            filter: [{ids: {"values": null}}]
                        }
                    },
                    "highlight": {
                        "pre_tags": ["<mark>"],
                        "post_tags": ["</mark>"],
                        "fields": {
                            "parsed_text*": {
                                fragment_size: 100000
                            }
                        }
                    },
                    "size": this.RESULTS_AT_A_TIME,
                    "track_scores": true
                };
                
                function makePreQuery(baseQuery) {
                    return {
                        query: {
                            bool: {
                                must: [ baseQuery ]
                            }
                        },
                        "_source": ["corpus_order_path", "children_path"],
                        size: 10000,
                        track_scores: true
                    };
                }
                const preQuery = makePreQuery(baseQuery);
                
                if (this.sortByCorpusOrder) {
                    const sortByCorpusDSL = {"corpus_order_path": {"order": "asc"}};
                    preQuery["sort"] = sortByCorpusDSL;
                    this.fullQuery["sort"] = sortByCorpusDSL;
                }
                if (queryData.lexemes.length) {
                    const lexemeQueryDSL = queryData.lexemes.map(lemma => ({"term": {"lemmas": lemma}}));
                    preQuery.query.bool.must = preQuery.query.bool.must.concat(lexemeQueryDSL);
                    this.fullQuery.query.bool.must = this.fullQuery.query.bool.must.concat(lexemeQueryDSL);
                }
                return APIService.search(preQuery)
                    .then((response) => {
                        let childUnitScores = {};
                        let smallUnitScores = {};
                        const hits = response.data.hits.hits;
                        hits.forEach(hit =>
                        {
                            const path = hit._source.corpus_order_path;
                            smallUnitScores[path] = hit._score;
                            const parentPath = path.substring(0, path.lastIndexOf('/'));
                            childUnitScores[parentPath] = childUnitScores.hasOwnProperty(parentPath)
                                ? _.max([childUnitScores[parentPath], hit._score])
                                : hit._score;
                        });
                        service.completeResults = hits.filter(hit =>
                            {
                                if (hit._type === "cross") {
                                    return hit._source.children_path.every(path => !smallUnitScores.hasOwnProperty(path) || smallUnitScores[path] < hit._score)
                                }
                                return !childUnitScores.hasOwnProperty(hit._source.corpus_order_path)
                                || childUnitScores[hit._source.corpus_order_path] < hit._score
                            })
                            .map(hit => hit._id);
                        service.smallUnitResults = hits.filter(hit => hit._type === 'small').map(hit => hit._id);;
                        if (service.smallUnitResults.length === 0)
                            service.smallUnitsOnly = false;
                        service.offset = 0;
                        return service.updateSearch();
                    })
            },
            getLexemeVariations() {
                function loadLexemeList() {
                    if (!service.lexemeListPromise) {
                        service.lexemeListPromise = $http.get('TanakhLexemes.json')
                            .then(response => {
                                service.lexemeList = response.data;
                                const keys = Object.keys(service.lexemeList);
                                keys.forEach(key => {
                                    const normalized = key.normalize();
                                    if (key !== normalized)
                                        service.lexemeList[normalized] = service.lexemeList[key];
                                    if (!service.lexemeList[normalized].eng.startsWith('<')) {
                                        const keyTranslation = service.lexemeList[normalized].eng;
                                        if (service.synonyms.hasOwnProperty(keyTranslation))
                                            service.synonyms[keyTranslation].push(normalized);
                                        else
                                            service.synonyms[keyTranslation] = [normalized];
                                    }
                                })
                            });
                    }
                }

                // results of searching for each term in the query, mapped to possible meanings
                function resultToVariation(result) {
                    const lemmaGroups = _.groupBy(result, wordData=> wordData.lemma);
                    const lemmaObject = _.mapValues(lemmaGroups, lemmaData=> _.maxBy(lemmaData, wordData => wordData.count));
                    const variations = Object.values(lemmaObject);
                    // add data from our lexeme list to each possible meaning for each term
                    variations.forEach(variation => {
                        service.lexemeListPromise.then(() => {
                            if (service.lexemeList.hasOwnProperty(variation.lemma)) {
                                // first, add a better description
                                const lexemeData = service.lexemeList[variation.lemma];
                                variation.parsed_text = variation.lemma.replace(/[_=/[]/g,'').replace('aramaic', ' (Aramaic)') + ' (' + lexemeTypes[lexemeData.type] + ') ' + lexemeData.eng;
                                // then, add possible synonyms
                                const synonyms = service.synonyms[lexemeData.eng];
                                if (synonyms && synonyms.length > 1)
                                    variation.synonyms = synonyms.filter(lexeme => lexeme !== variation.lemmas);
                            }
                        })
                    });
                    return variations;
                }

                loadLexemeList();

                return $q.all([service.lexemeListPromise].concat(parseQueryString(service.query).terms
                    .map(term => APIService.wordSearch({
                        query: {
                            multi_match: {
                                fields: ["parsed_text*"],
                                query: term
                            }
                        },
                        size: 10000,
                        "_source": ["parsed_text", "lemma", "count"]
                    })
                        .then(result => ({
                            term,
                            variations: resultToVariation(result.data.hits.hits.map(hit => hit._source))
                        }))
                    )))
                    .then(results => {
                        return results.slice(1)
                    });
            },
            toggleSortOrder(){
                this.sortByCorpusOrder = !this.sortByCorpusOrder;
                this.offset = 0;
                this.submitSearch();
            },
            loadResults(pageNum) {
                return service.search((pageNum - 1) * service.RESULTS_AT_A_TIME);
            }
        };
        return service;
    });

