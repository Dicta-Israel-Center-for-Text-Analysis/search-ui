jTextMinerApp.component('searchFrontPage',
{
    templateUrl: 'Components/Search/searchFrontPage.component.html',
    controller: function($state) {
        const ctrl = this;

        ctrl.runSearch = function () {
            $state.go('search.terms', {terms: ctrl.searchQuery, page: '1'});
        };
    }
}); 