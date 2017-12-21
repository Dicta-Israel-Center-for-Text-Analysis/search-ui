angular.module('JTextMinerApp')
    .directive('replace', function($compile){
        return {
            restrict: 'E',
            bindToController: true,
            controllerAs: '$ctrl',
            scope: {
                with: '='
            },
            controller: function () {},
            link: function(scope, element, attrs, ctrl) {
                scope.$watch('$ctrl.with', function() {
                    // in HTML, Angular uses train case
                    function convertToTrainCase(str) {
                        return str.replace(/([A-Z])/g, (match, dummy, offset) => (offset === 0 ? '' : '-') + match.toLowerCase());
                    }
                    const htmlComponentName = convertToTrainCase(ctrl.with.component);
                    // build a template that Angular can compile
                    const template = '<' + htmlComponentName + ' ' +
                        _.map(ctrl.with.parameters, (value, key) => convertToTrainCase(key) + '="$ctrl.with.parameters.' + key + '" ').join('') +
                       '></' + htmlComponentName + '>';
                    // add it as a child element
                    element.html(template);
                    // compile it, using our scope
                    $compile(element.contents())(scope);
                });
            }
        }
    });