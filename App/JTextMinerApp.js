//https://github.com/cornflourblue/angu-fixed-header-table
//https://www.pointblankdevelopment.com.au/blog/angularjs-fixed-header-scrollable-table-directive
var jTextMinerApp = angular.module('JTextMinerApp', ['ui.router', 'ui.bootstrap', 'ngDialog', 'ui.bootstrap.tabs', 'ui.indeterminate', 'ngSanitize', 'ui.bootstrap.contextMenu']);
// set default values for all dialogs
jTextMinerApp.config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: false,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false
    });
}]);

jTextMinerApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/searchStart');

    $stateProvider
    .state('continueLogin', {
        url: '/ContinueLogin/{nextState}',
        component: 'continueLogin',
        params: {
            nextState: {
                value: 'searchStart'
            }
        }
    })
    .state('search', {
        url: '/search',
        component: 'search'
    })
    .state('search.terms', {
        url: '/{terms}/{page}?tanachOrder&allResults',
        component: 'search',
        params: {
            tanachOrder: {
                dynamic: true,
                type: 'bool',
                value: true,
                squash: true
            },
            allResults: {
                dynamic: true,
                type: 'bool',
                value: false,
                squash: true
            },
            page: {
                dynamic: true,
                value: '1'
            }
        }
    })
    .state('searchStart', {
        url: '/searchStart',
        component: 'searchFrontPage'
    })
})
.run(function($transitions) {
    $transitions.onSuccess({}, function(transition) {
        //console.log('transition', transition.to().name, transition.params());
        if (transition.from().name !== transition.to().name) {
            gtag('config', 'UA-103843509-1', {'page_path': '/' + transition.to().name});
        }
        if (transition.to().name === 'search.terms' && transition.params()['terms'])
            gtag('event', 'search', {
                'search_term': transition.params()['terms']
            });
    });
});