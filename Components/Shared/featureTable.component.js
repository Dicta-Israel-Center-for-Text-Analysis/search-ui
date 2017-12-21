var morphologyIdDict = {
    "PREFIX_FUNCTION_CONJUNCTION": "conj",
    "PREFIX_FUNCTION_DEFINITEARTICLE": "def",
    "PREFIX_FUNCTION_INTERROGATIVE": "interrogative",
    "PREFIX_FUNCTION_PREPOSITION": "prep",
    "PREFIX_FUNCTION_RELATIVIZER_SUBORDINATINGCONJUNCTION": "subconj",
    "PREFIX_FUNCTION_TEMPORALSUBCONJ": "temp",
    "PREFIX_FUNCTION_ADVERB": "adverb",
    "BASEFORM_POS_ADJECTIVE": "adj",
    "BASEFORM_POS_ADVERB": "adv",
    "BASEFORM_POS_CONJUNCTION": "conj",
    "BASEFORM_POS_AT_PREP": "prep",
    "BASEFORM_POS_NEGATION": "neg",
    "BASEFORM_POS_NOUN": "noun",
    "BASEFORM_POS_NUMERAL": "num",
    "BASEFORM_POS_PREPOSITION": "prep",
    "BASEFORM_POS_PRONOUN": "pro",
    "BASEFORM_POS_PROPERNAME": "name",
    "BASEFORM_POS_VERB": "verb",
    "BASEFORM_POS_PUNCUATION": "punc",
    "BASEFORM_POS_PARTICLE": "part",
    "BASEFORM_POS_INTERROGATIVE": "interrogative",
    "BASEFORM_POS_INTERJECTION": "interjection",
    "BASEFORM_POS_UNKNOWN": "unknown",
    "BASEFORM_POS_QUANTIFIER": "quantifier",
    "BASEFORM_POS_EXISTENTIAL": "exist",
    "BASEFORM_POS_MODAL": "modal",
    "BASEFORM_POS_PREFIX": "prefix",
    "BASEFORM_POS_URL": "url",
    "BASEFORM_POS_JUNK": "junk",
    "BASEFORM_POS_PARTICIPLE": "participle",
    "BASEFORM_POS_COPULA": "copula",
    "BASEFORM_POS_NUMEXP": "num-exp",
    "BASEFORM_POS_TITULAR": "titular",
    "BASEFORM_POS_SHEL_PREP": "prep",
    "BASEFORM_GENDER_MASCULINE": "mas",
    "BASEFORM_GENDER_FEMININE": "fem",
    "BASEFORM_GENDER_MASCULINEFEMININE": "masc/fem",
    "BASEFORM_NUMBER_SINGULAR": "sing",
    "BASEFORM_NUMBER_PLURAL": "plural",
    "BASEFORM_NUMBER_DUAL": "dual",
    "BASEFORM_NUMBER_DUALPLURAL": "dual/plural",
    "BASEFORM_NUMBER_SINGULARPLURAL": "sing/plural",
    "BASEFORM_PERSON_1": "per1",
    "BASEFORM_PERSON_2": "per2",
    "BASEFORM_PERSON_3": "per3",
    "BASEFORM_PERSON_ANY": "per-any",
    "BASEFORM_STATUS_ABSOLUTE": "abs",
    "BASEFORM_STATUS_CONSTRUCT": "const",
    "BASEFORM_STATUS_ABSOLUTECONSTRUCT": "abs-const",
    "BASEFORM_TENSE_PAST": "past",
    "BASEFORM_TENSE_ALLTIME": "all",
    "BASEFORM_TENSE_PRESENT": "pres",
    "BASEFORM_TENSE_FUTURE": "fut",
    "BASEFORM_TENSE_IMPERATIVE": "impr",
    "BASEFORM_TENSE_TOINFINITIVE": "inf",
    "BASEFORM_TENSE_BAREINFINITIVE": "orig",
    "BASEFORM_POLARITY_POSITIVE": "pos",
    "BASEFORM_POLARITY_NEGATIVE": "neg",
    "BASEFORM_BINYAN_PAAL": "paal",
    "BASEFORM_BINYAN_NIFAL": "nifal",
    "BASEFORM_BINYAN_HIFIL": "hifil",
    "BASEFORM_BINYAN_HUFAL": "hufal",
    "BASEFORM_BINYAN_PIEL": "piel",
    "BASEFORM_BINYAN_PUAL": "pual",
    "BASEFORM_BINYAN_HITPAEL": "hitpael",
    "SUFFIX_FUNCTION_POSSESIVEPRONOUN": "poss",
    "SUFFIX_FUNCTION_ACCUSATIVENOMINATIVE": "acc/nom",
    "SUFFIX_FUNCTION_PRONOMIAL": "pro",
    "SUFFIX_GENDER_MASCULINE": "mas",
    "SUFFIX_GENDER_FEMININE": "fem",
    "SUFFIX_GENDER_MASCULINEFEMININE": "masc/fem",
    "SUFFIX_NUMBER_SINGULAR": "sing",
    "SUFFIX_NUMBER_PLURAL": "plural",
    "SUFFIX_NUMBER_DUAL": "dual",
    "SUFFIX_NUMBER_DUALPLURAL": "dual/plural",
    "SUFFIX_NUMBER_SINGULARPLURAL": "sing/plural",
    "SUFFIX_PERSON_1": "per1",
    "SUFFIX_PERSON_2": "per2",
    "SUFFIX_PERSON_3": "per3",
    "SUFFIX_PERSON_ANY": "per-any",
    "BASEFORM_CONJUNCTIONTYPE_COORDINATING": "coord",
    "BASEFORM_CONJUNCTIONTYPE_SUBORDINATING": "subord",
    "BASEFORM_CONJUNCTIONTYPE_RELATIVIZING": "rel",
    "BASEFORM_PRONOUNTYPE_PERSONAL": "per",
    "BASEFORM_PRONOUNTYPE_DEMONSTRATIVE": "dem",
    "BASEFORM_PRONOUNTYPE_IMPERSONAL": "imper",
    "BASEFORM_PRONOUNTYPE_REFLEXIVE": "ref",
    "BASEFORM_NUMBERTYPE_ORDINAL": "ord",
    "BASEFORM_NUMBERTYPE_CARDINAL": "card",
    "BASEFORM_NUMBERTYPE_FRACTIONAL": "frac",
    "BASEFORM_NUMBERTYPE_LITERAL": "lit",
    "BASEFORM_NUMBERTYPE_GEMATRIA": "gem",
    "BASEFORM_NERTYPE_PERSON": "per",
    "BASEFORM_NERTYPE_LOCATION": "loc",
    "BASEFORM_NERTYPE_ORGANIZATION": "org",
    "BASEFORM_NERTYPE_PRODUCT": "prod",
    "BASEFORM_NERTYPE_DATETIME": "time",
    "BASEFORM_NERTYPE_COUNTRY": "country",
    "BASEFORM_NERTYPE_LANGUAGE": "lang",
    "BASEFORM_NERTYPE_COIN": "coin",
    "BASEFORM_NERTYPE_SYMBOL": "sym",
    "BASEFORM_NERTYPE_OTHER": "other",
    "BASEFORM_NERTYPE_TOWN": "town",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETSTART": "brac-start",
    "BASEFORM_PUNCTUATIONTYPE_BRACKETEND": "brac-end",
    "BASEFORM_PUNCTUATIONTYPE_COMMA": "com",
    "BASEFORM_PUNCTUATIONTYPE_DOT": "dot",
    "BASEFORM_PUNCTUATIONTYPE_ARITHMETICOPERATION": "opr",
    "BASEFORM_PUNCTUATIONTYPE_QUOTE": "quote",
    "BASEFORM_PUNCTUATIONTYPE_QUESTION": "que",
    "BASEFORM_PUNCTUATIONTYPE_EXCLAMQATION": "exclamqation",
    "BASEFORM_PUNCTUATIONTYPE_COLON": "col",
    "BASEFORM_PUNCTUATIONTYPE_SEMICOLON": "sem-col",
    "BASEFORM_PUNCTUATIONTYPE_HYPHEN": "hyph",
    "BASEFORM_PUNCTUATIONTYPE_SLASH": "slash",
    "BASEFORM_PUNCTUATIONTYPE_AND": "and",
    "BASEFORM_PUNCTUATIONTYPE_OR": "or",
    "BASEFORM_PUNCTUATIONTYPE_OTHER": "other",
    "BASEFORM_INTERROGATIVETYPE_PRONOUN": "pronoun",
    "BASEFORM_INTERROGATIVETYPE_PROADVERB ": "proadverb",
    "BASEFORM_INTERROGATIVETYPE_PRODET": "prodet",
    "BASEFORM_INTERROGATIVETYPE_YESNO": "yesno",
    "BASEFORM_QUANTIFIERTYPE_AMOUNT": "amount",
    "BASEFORM_QUANTIFIERTYPE_PARTITIVE": "part",
    "BASEFORM_QUANTIFIERTYPE_DETERMINER": "det",
    "BASEFORM_PARTICIPLE_VERB": "verb",
    "BASEFORM_PARTICIPLE_NOUN_ADJ": "noun/adj",
    "BASEFORM_POS_INITIALISM": "init.",
    "BASEFORM_POS_FOREIGN": "foreign",

    "@AjCl": "Adjective clause",
    "@CPen": "Casus pendens",
    "@Defc": "Defective clause atom",
    "@Ellp": "Ellipsis",
    "@InfA": "Infinitive absolute clause",
    "@InfC": "Infinitive construct clause",
    "@MSyn": "Macrosyntactic sign",
    "@NmCl": "Nominal clause",
    "@Ptcp": "Participle clause",
    "@Reop": "Reopening",
    "@Unkn": "Unknown",
    "@Voct": "Vocative clause",
    "@Way0": "Wayyiqtol-null clause",
    "@WayX": "Wayyiqtol-X clause",
    "@WIm0": "We-imperative-null clause",
    "@WImX": "We-imperative-X clause",
    "@WQt0": "We-qatal-null clause",
    "@WQtX": "We-qatal-X clause",
    "@WxI0": "We-x-imperative-null clause",
    "@WXIm": "We-X-imperative clause",
    "@WxIX": "We-x-imperative-X clause",
    "@WxQ0": "We-x-qatal-null clause",
    "@WXQt": "We-X-qatal clause",
    "@WxQX": "We-x-qatal-X clause",
    "@WxY0": "We-x-yiqtol-null clause",
    "@WXYq": "We-X-yiqtol clause",
    "@WxYX": "We-x-yiqtol-X clause",
    "@WYq0": "We-yiqtol-null clause",
    "@WYqX": "We-yiqtol-X clause",
    "@xIm0": "x-imperative-null clause",
    "@XImp": "X-imperative clause",
    "@xImX": "x-imperative-X clause",
    "@XPos": "Extraposition",
    "@xQt0": "x-qatal-null clause",
    "@XQtl": "X-qatal clause",
    "@xQtX": "x-qatal-X clause",
    "@xYq0": "x-yiqtol-null clause",
    "@XYqt": "X-yiqtol clause",
    "@xYqX": "x-yiqtol-X clause",
    "@ZIm0": "Zero-imperative-null clause",
    "@ZImX": "Zero-imperative-X clause",
    "@ZQt0": "Zero-qatal-null clause",
    "@ZQtX": "Zero-qatal-X clause",
    "@ZYq0": "Zero-yiqtol-null clause",
    "@ZYqX": "Zero-yiqtol-X clause",

    "Adju": "Adjunct",
    "Cmpl": "Complement",
    "Conj": "Conjunction",
    "EPPr": "Enclitic personal pronoun!",
    "ExsS": "Existence with subject suffix",
    "Exst": "Existence",
    "Frnt": "Fronted element",
    "Intj": "Interjection",
    "IntS": "Interjection with subject suffix",
    "Loca": "Locative",
    "Modi": "Modifier",
    "ModS": "Modifier with subject suffix",
    "NCop": "Negative copula",
    "NCoS": "Negative copula with subject suffix",
    "Nega": "Negation",
    "Objc": "Object",
    "PrAd": "Predicative adjunct",
    "PrcS": "Predicate complement with subject suffix",
    "PreC": "Predicate complement",
    "Pred": "Predicate",
    "PreO": "Predicate with object suffix",
    "PreS": "Predicate with subject suffix",
    "PtcO": "Participle with object suffix",
    "Ques": "Question",
    "Rela": "Relative",
    "Subj": "Subject",
    "Supp": "Supplementary constituent",
    "Time": "Time reference",
    "Unkn": "Unknown",
    "Voct": "Vocative"
};

function prettyPrintMorphology(converted) {
    function dictLookup(term) {
        // get rid of leading @
        var morphArray = term.substring(1).split('#');
        // first element might be the lemma if present
        var lemma = morphArray.shift();

        var lemmaPrint = lemma ? lemma + ' - ' : '';
        return lemmaPrint + morphArray.map(
                function(item) { return morphologyIdDict.hasOwnProperty(item) ? morphologyIdDict[item] : item}
            ).join(', ');
    }
    //remove prefixes that distinguish feature set types if the server is sending them
    converted = converted.replace(/@(ml|ms|so|sc|sp)/g, '@');

    // we match things that look like morphology - @ followed by any text until #, then a series of terms starting with #
    converted = converted.replace(/@([^ #]*)(#[A-Z0-9_]+)+/g, dictLookup).replace(/_$/, '');

    // we match things that look like syntax clause types, @ followed by 4 chars
    converted = converted.replace(/@[A-Za-z0-9]{4}\b/g, x => morphologyIdDict.hasOwnProperty(x) ? morphologyIdDict[x] : x);

    function syntaxPhraseSeqLookup(seq) {
        // get rid of leading @
        var seqArray = seq.substring(1).split('_');
        return seqArray.map(x => morphologyIdDict.hasOwnProperty(x) ? morphologyIdDict[x] : x)
            .join(", ");
    }
    // match things that look like syntax phrase sequences, @ followed by groups of 4 chars joined with _
    converted = converted.replace(/@\w{4}(_\w{4})*/g, syntaxPhraseSeqLookup);
    return converted;
}

jTextMinerApp.component('featureTable', {
        bindings: {
            isSelectDisabled: '=',
            features: '=',
            isMorphology: '=',
            classes: '<',
            experiment: '<'
        },
        templateUrl: 'Components/Shared/featureTable.component.html',
        controller: function ($scope, ClassService, DialogService) {
            var ctrl = this;
            $scope.predicate = '-maxTTest';

            $scope.maxTTestFilter = function (item) {
                return (item.maxTTest >= 2.0);
            };

            $scope.sortKey = ['-maxTTest'];
            $scope.sortReverse = false;
            $scope.sortClick = function (field){
                if ($scope.sortKey[0]==field) {
                    $scope.sortReverse = !$scope.sortReverse;
                }
                else {
                    $scope.sortKey[1] = $scope.sortKey[0];
                    $scope.sortKey[0] = field;
                    $scope.sortReverse = false;
                }
            }
            $scope.arrowClass = function (field) {
                if ($scope.sortKey[0] == field) {
                    if ($scope.sortReverse)
                        return "fa fa-caret-up";
                    else
                        return "fa fa-caret-down";
                }
                return "";
            }

            $scope.classNameToBgStyle = function (name) {
                return { "background-color": ClassService.classNameToColor(name, ctrl.classes) };
            };

            $scope.convertFeatureName = function (featureName) {
                var converted = featureName;
                if (ctrl.isMorphology) {
                    converted = prettyPrintMorphology(converted);
                }
                return converted;
            }
            ctrl.showExamples = function (feature) {
                DialogService.openDialog('samplesOfFeature', {
                    featureName: feature.name,
                    experiment: ctrl.experiment
                })
            };
        }
});
