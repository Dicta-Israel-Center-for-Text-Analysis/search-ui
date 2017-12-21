angular.module('JTextMinerApp')
    .factory("bibleContextMenu", function () {
        return {
            menu(onSearch) {
                return [
                [(scope, event) => "Search for " + event.target.innerText, function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $event.target.innerText});
                }],
                [(scope, event) => "Search for " + event.target.innerText + " used in the same sense", function ($itemScope, $event, modelValue, text, $li) {
                    onSearch({query: $event.target.innerText, item: $itemScope});
                }],
                // [(scope, event) => "Search for words with the same morphology as " + scope.word, function ($itemScope, $event, modelValue, text, $li) {
                //     onSearch({query: $event.target.innerText});
                // }],
                // null, // Divider
                // [(scope, event) => "Search for " /*+ scope.line.smallUnit.text*/, function ($itemScope, $event, modelValue, text, $li) {
                //     onSearch({query: $event.target.innerText});
                // }],
                // [(scope, event) => "Search for similar clauses", function ($itemScope, $event, modelValue, text, $li) {
                //     onSearch({query: $event.target.innerText});
                // }],
                // [(scope, event) => "Search for similar verses", function ($itemScope, $event, modelValue, text, $li) {
                //     onSearch({query: $event.target.innerText});
                // }]
            ]}
        };
    });
