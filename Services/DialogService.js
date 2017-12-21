// This service makes it simpler to produce a dialog box and makes it possible to switch the dialog box plugin
// Usage: call DialogService.openDialog('myDialogComponent', paramObject)
//                          .then(doSomethingWithConfirmationData)
//                          .catch(doSomethingWithRejectionData);
// The caller should create an object which is a dictionary of binding names to binding values. In the example above,
// this is 'paramObject'.
//
// A dialog component must draw all of the interior of the dialog, including buttons.
// It accepts parameters via bindings. There are two special bindings, not created by the caller,
// onConfirm and onCancel, which when called will close the dialog. They are called within the dialog component
// like this, if the controller is called ctrl:
//                ctrl.onConfirm({confirmData: someObject});
//                ctrl.onCancel({cancelData: someObject});

angular.module('JTextMinerApp')
    .factory('DialogService', function(ngDialog) {
    return {
        openDialog(component, parameters) {
            function convertToTrainCase(str) {
                return str.replace(/([A-Z])/g, (match, dummy, offset) => (offset === 0 ? '' : '-') + match.toLowerCase());
            }
            const htmlComponentName = convertToTrainCase(component);
            return ngDialog.openConfirm({
                template: '<' + htmlComponentName + ' ' +
                    _.map(parameters, (value, key) => convertToTrainCase(key) + '="ngDialogData.' + key + '" ').join('') +
                'on-confirm="confirm(confirmData)" ' +
                'on-cancel="closeThisDialog(cancelData)">' +
                '</' + htmlComponentName + '>',
                plain: true,
                className: 'ngdialog-theme-default',
                data: parameters
            });
        }
    };
});