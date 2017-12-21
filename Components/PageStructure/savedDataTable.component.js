jTextMinerApp.component('savedDataTable',
{
    bindings: {
        expanded: '<',
        heading: '<',
        savedSelections: '<',
        onSavedDataSelected: '&'
    },
    templateUrl: 'Components/PageStructure/savedDataTable.component.html',
    controller: [
        function() {
            const ctrl = this;
            ctrl.formatDate = function (date) {
                return new Date(date).toLocaleDateString()
            }
        }]
}); 