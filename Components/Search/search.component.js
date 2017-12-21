jTextMinerApp.component('search',
{
    bindings: {
        $transition$: '<'
    },
    templateUrl: 'Components/Search/search.component.html',
    controller: function (APIService, search, $scope, bibleContextMenu, $timeout, StateService, $state) {
        const ctrl = this;

        // initial setup
        // show a back button only if not invoked as a standalone search engine
        ctrl.showBack = StateService.frontPageState === 'bibleFrontpage';
        ctrl.search = search;
        ctrl.currentPage = 1;
        ctrl.previousQuery = '';

        ctrl.reentranceFlag = false;
        function setControlFromState (newParams) {
            // the control will render if there's no search term, but then there's no existing data
            if (!newParams.hasOwnProperty('terms')) return;

            ctrl.lastState = newParams;
            if (ctrl.reentranceFlag) return;

            // new search needed for new terms or new order, but not for a new page or showing chapter results
            const newSearchNeeded =
                search.sortByCorpusOrder !== newParams.tanachOrder
                || ctrl.previousQuery !== newParams.terms;

            search.sortByCorpusOrder = newParams.tanachOrder;
            search.query = newParams.terms;
            ctrl.previousQuery = search.query;

            function updateResultsFromParams() {
                search.smallUnitsOnly = !(search.smallUnitResults.length === 0 || newParams.allResults);
                ctrl.currentPage = +newParams.page;
                const pages = Math.ceil(ctrl.numResults() / ctrl.search.RESULTS_AT_A_TIME);
                if (ctrl.currentPage > pages && pages !== 0) {
                    ctrl.currentPage = pages;
                    ctrl.reentranceFlag = true;
                    $state.go('.', {page: ctrl.currentPage});
                    ctrl.reentranceFlag = false;
                }
                search.loadResults(ctrl.currentPage);
            }
            if (newSearchNeeded) {
                updateUIforSearchTerm();
                ctrl.variations = [];
                ctrl.synonyms = [];
                ctrl.lastHighlights = {};
                search.search()
                    .then(function() {
                        search.getLexemeVariations().then(
                            results => {
                                ctrl.variations = results;
                                ctrl.variationsSelected = ctrl.variations.map(v => "all");
                                loadVariationsFromQuery(search.query);
                            }
                        );
                        updateResultsFromParams();
                    });
            }
            else
                updateResultsFromParams();
        }

        // get search terms and page number from the ui-router state
        setControlFromState(ctrl.$transition$.params());

        // callback from ui-router when the params change but the state is otherwise the same
        // apparently, it just needs to be set; there's no need to register the callback anywhere
        ctrl.uiOnParamsChanged = function(newParams) {
            setControlFromState(Object.assign({}, ctrl.lastState, newParams));
        };

        // callback from the autocomplete input box when the user presses enter
        ctrl.setSearchTerm = function (selected) {
            if (selected == null) return;
            search.query = selected.title;
            ctrl.runSearch();
        };

        // should be removed; the service shouldn't be the source of state; ui-router should be
        $scope.$watch('$ctrl.search.query', updateUIforSearchTerm);

        function updateUIforSearchTerm() {
            $timeout(() =>
                $scope.$broadcast('angucomplete-alt:changeInput', 'search', search.query));
        }

        ctrl.runSearch = function () {
            $state.go('search.terms', {terms: search.query, page: '1', allResults: false});
        };

        ctrl.inputChanged = function (searchTerm) {
            search.query = searchTerm;
        };

        function splitWords(text) {
            return text.split(' ');
        }

        ctrl.onSearch = function (params) {
            search.query = params.query.replace(/<\/?mark>/g, '');
            if (params.item) {
                let lemmas = params.item.result._source.lemmas;
                // in chapters, get the right pasuk
                if (Array.isArray(lemmas[0]))
                    lemmas = lemmas[params.item.$parent.$index];
                lemmas = _.flatMap(lemmas, lemma => lemma.split(' '));
                search.query += " lexeme:" + lemmas[params.item.$index];
            }
            ctrl.runSearch();
        };

        ctrl.menuOptions = bibleContextMenu.menu(ctrl.onSearch);

        ctrl.numToHebrew = function(num) {
            const ones = num % 10;
            const tens = (num - ones)/10 % 10;
            const hundreds = (num - tens*10 - ones) / 100;
            let result = '';
            if (hundreds) result = "dקרשת"[hundreds];
            if (tens === 1 && ones === 5)
                result += 'טו';
            else if (tens === 1 && ones === 6)
                result += 'טז';
            else
                result += (tens ? "dיכלמנסעפצ"[tens] : '') + (ones ? "dאבגדהוזחט"[ones] : '');
            return result;
        };

        function baseHighlight(text) {
            function highlightsToBool(text) {
                return text.split(/\s/).map(word => word.includes('<mark'));
            }
            let highlights;
            if (text.highlight) {
                if (text.highlight['parsed_text_rep'])
                    highlights = highlightsToBool(text.highlight['parsed_text_rep'][0]);
                if (text.highlight['parsed_text.spelling_expansion']) {
                    const expansionBools = highlightsToBool(text.highlight['parsed_text.spelling_expansion'][0]);
                    highlights = highlights ? _.zipWith(highlights, expansionBools, (a,b) => a || b) : expansionBools;
                }
                else if (text.highlight['parsed_text.y']) {
                    const highlight = text.highlight['parsed_text.y'].join('...');
                    const highlightArray = [splitWords(highlight.replace(/mark>/g,'b>'))];
                    // TODO: doesn't handle multiline matches
                    return highlightArray;
                }
            }
            if (highlights) {
                let highlightedSentences = [];
                let counter = 0;
                const sentences = text._source.parsed_text.split(/\n/);
                let lastMatch = -1;
                sentences.forEach((sentence, index) => {
                    let highlightedWords = [];
                    let highlightInSentence = false;
                    words = sentence.split(' ');
                    words.forEach(word => {
                        const mark = highlights[counter++];
                        if (mark) highlightInSentence = true;
                        highlightedWords.push(mark                            
                                ? '<b>' + word + '</b>'
                                : word)
                    });
                    highlightedSentences.push(highlightedWords);
                    if (highlightInSentence) {
                        highlightedWords.containsMatch = true;
                        lastMatch = index;
                    }
                    else if (lastMatch === index - 1)
                        highlightedWords.showEllipsis = true;
                });
                return highlightedSentences;
            }
            const re = new RegExp("(" + search.query.replace(/ /g, '|') + ")", "g");
            return [splitWords(text._source.parsed_text.replace(re, "<b>$1</b>"))];
        }

        function highlight(text) {
            const base = baseHighlight(text);
            // if we don't know where the matches are, show all
            if (!base.some(sentence => sentence.containsMatch)) base.forEach(sentence => sentence.containsMatch = true);
            return base;
        }

        ctrl.lastHighlights = {};
        ctrl.highlight = function (text) {
            const source = text._source.parsed_text
            if (!ctrl.lastHighlights.hasOwnProperty(source))
                ctrl.lastHighlights[source] = highlight(text);
            return ctrl.lastHighlights[source];
        };

        ctrl.updateResults = function () {
            $state.go('.', {page: ctrl.currentPage});
            search.loadResults(ctrl.currentPage);
        };

        ctrl.showLargeUnits = function () {
            search.smallUnitsOnly = false;
            $state.go('.', { allResults: true });
            ctrl.currentPage = 1;
            search.loadResults(1);
        };

        ctrl.numResults = function () {
            if (!_.isArray(search.completeResults))
                return 0;
            return search.smallUnitsOnly ? search.smallUnitResults.length : search.completeResults.length;
        };

        ctrl.runSuggest = function (userInputString, timeoutPromise) {
            return APIService.search(
                {
                    "suggest": {
                        "my-suggestion": {
                            "prefix": userInputString,
                            "term": {
                                "field": "parsed_text.y"
                            }
                        }
                    }
                },
                {timeout: timeoutPromise})
                .then(response =>
                    response.data.suggest["my-suggestion"]["0"].options
                );
        };

        ctrl.toggleSortOrder = function() {
            search.toggleSortOrder();
            $state.go('.', { tanachOrder: search.sortByCorpusOrder });
        };

        ctrl.moreResultsAvailable = function () {
            if (!search.completeResults) return false;
            return search.smallUnitsOnly && search.completeResults.length > search.smallUnitResults.length
        };

        function loadVariationsFromQuery(query) {
            const parsedQuery = search.parseQueryString(search.query);
            // after the search service loaded possible variations and synonyms, convert them for the UI
            // for each term
            ctrl.variations.forEach((variation, index) => {
                // so far, no specific lexeme has been picked for this term
                let selected = false;
                let possibleSynonyms = [];
                // possible lexemes for this term in the search query
                const lexemesInVariation = variation.variations.map(one => one.lemma);
                // for each lexeme related to this term in the query
                variation.variations.forEach(oneVariation => {
                    // if this lexeme is in the list of lexemes in the query, then the UI should show this lexeme is selected
                    if (parsedQuery.lexemes.includes(oneVariation.lemma)) {
                        ctrl.variationsSelected[index] = oneVariation.lemma;
                        selected = true;
                        // and the user is only interested in synonyms of this specific meaning of this term in their query
                        variation.synonyms = oneVariation.synonyms;
                    }
                    else if (oneVariation.synonyms)
                        possibleSynonyms = _.union(possibleSynonyms, oneVariation.synonyms);
                });
                if (!selected)
                    variation.synonyms = possibleSynonyms;
                // sometimes, a few of the lexemes are synonyms of each other, but don't display them
                _.pull(variation.synonyms, ...lexemesInVariation);
            })
        }

        ctrl.setVariations = function () {
            const lemmas = ctrl.variationsSelected.filter(selection => selection !== 'all');
            const parsedQuery = search.parseQueryString(search.query);
            search.query = search.stringifyQuery(parsedQuery.terms, lemmas);
            ctrl.runSearch();
        }

        ctrl.hasEllipsis = function (result) {
            const highlighted = ctrl.highlight(result);
            return !highlighted.every(sentence => sentence.containsMatch);
        }

        // TODO: cut-and-pasted here, should have a central place for utility functions
        function bookChapterAndVerse(key) {
            let matches = /\/[^/]*\/([^/]*)\/Chapter ([^/]*)(?:\/Pasuk (.*))?/.exec(key);
            matches.shift();
            return _.compact(matches);
        }

        ctrl.getLink = function(key) {
            let bookChapterAndVerseNums = bookChapterAndVerse(key);
            bookChapterAndVerseNums[0] = bookChapterAndVerseNums[0].replace(' ', '_');
            return "http://www.sefaria.org/" + bookChapterAndVerseNums.join('.') + "?lang=he"
        };

        ctrl.lexemeToDescription = function (lexeme) {
            return lexeme.replace(/[=/_[]*/g,'').replace('aramaic', '\u00a0(Aramaic)');
        };

        ctrl.lexemeToWord = function (lexeme) {
            return lexeme.replace(/[=/_a-z[]*/g,'');
        };

        ctrl.makeLexemeQuery = function (synonym) {
            return search.stringifyQuery([ctrl.lexemeToWord(synonym)], [synonym]);
        };

        ctrl.multipleOptions = function(wordData) { return wordData.variations.length > 1 };

        ctrl.relatedSearchTerms = function () {
            return ctrl.variations && ctrl.variations.length > 0 && ctrl.variations.some(variation => variation.synonyms && variation.synonyms.length > 0);
        }

        ctrl.resultCountMessage = function () {
            if (!search.smallUnitResults) return '';
            if (search.smallUnitResults.length === 0)
                return 'No verses found, ' + search.completeResults.length + ' results found';
            if (search.smallUnitResults.length !== search.completeResults.length)
                return search.smallUnitResults.length  + ' verses found, ' + search.completeResults.length + ' total results found';
            else
                return search.smallUnitResults.length  + ' verses found';
        }

        ctrl.showingLargeUnits = function () {
            return !search.smallUnitsOnly && search.smallUnitResults.length > 0;
        }

        ctrl.showSmallUnits = function () {
            search.smallUnitsOnly = true;
            $state.go('.', { allResults: false });
            ctrl.currentPage = 1;
            search.loadResults(1);

        }
    }
});