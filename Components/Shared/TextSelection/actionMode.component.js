jTextMinerApp.component('actionMode', {
    bindings: {
        onActionModeChanged: '&'
    },
    templateUrl: 'Components/Shared/TextSelection/actionMode.component.html',
    controller: [function () {
        var ctrl = this;
        ctrl.ExperimentActionMode = 'SelectOnlineCorpus';

        ctrl.changeActionMode = function (mode) {
            ctrl.ExperimentActionMode = mode;
            ctrl.onActionModeChanged({mode: mode});
        };
    }]
});