jTextMinerApp.component('chooseTextDialog', {
    bindings: {
        onConfirm: '&',
        onCancel: '&',
        className: '<',
        startingText: '<',
        saveMessage: '<',
        alternative: '<',
        alternativeAction: '&',
        namingMessage: '<',
        startingMode: '<',
        hideCancel: '<',
        embedded: '<',
        explanationComponent: '<'
    },
    templateUrl: 'Components/Shared/TextSelection/chooseTextDialog.component.html',
    controller: function ($scope, SelectClassService, UserService) {
        const ctrl = this;
        ctrl.selectionText = ctrl.startingText;
        ctrl.editingDescription = false;
        ctrl.description = '';

        ctrl.description = (ctrl.startingText && ctrl.startingText.subtitle) ? ctrl.startingText.title : null;
        ctrl.addDescription = function () {
            ctrl.editingDescription = true;
        };
        ctrl.blurDescription = function () {
            ctrl.editingDescription = false;
        };
        ctrl.hasDescription = function () {
            return !_.isEmpty(ctrl.description);
        };
        
        //ctrl.selectedKeys = [];

        ctrl.actionMode = ctrl.startingMode || 'SelectOnlineCorpus';
        ctrl.changeActionMode = function (mode) {
            ctrl.actionMode = mode;
        };

        ctrl.calculateName = true;

        ctrl.getProposedName = function () {
            return SelectClassService.summarizeText(ctrl.selectionText);
        };

        if (ctrl.className != null) {
            $scope.$watch('$ctrl.selectionText.keys', function (keys) {
                if (keys == null || keys.length == 0 || !ctrl.calculateName) return;
                var keyCopy = keys.slice();             // copy the list of keys
                var oneKey = keyCopy.shift() || "";         // take the first key or if there isn't any, use ""
                var commonKeySegments = oneKey.split('/');  // split on '/' into an array, and use this as an initial guess
                for (var keyIndex = 0; keyIndex < keyCopy.length; keyIndex++) { // loop over all keys, and shrink the prefix if needed
                    var keySegments = keyCopy[keyIndex].split('/');      // split the key we're looking at
                    for (var i = 0; i < commonKeySegments.length; i++) { // for each common key segment
                        if (i == keySegments.length                      // if this key doesn't have a segment at this position
                            || commonKeySegments[i] != keySegments[i]) { // or if the segment at this position doesn't match,
                            // we've gone too far.
                            commonKeySegments.splice(i);                 // so trim the list of common segments here
                            break;                                       // and check the next key
                        }
                    }
                }
                ctrl.className = commonKeySegments[commonKeySegments.length - 1] + (keys.length > 1 ? " (partial)" : "");
            })

            ctrl.userChangedName = function() {
                ctrl.calculateName = false;
            }
        }

        function dispatch(data, alternative) {
            if (alternative)
                ctrl.alternativeAction(data);
            else
                ctrl.onConfirm(data);
        }

        ctrl.confirm = function(alternative) {
            let result;
            switch(ctrl.actionMode) {
                case 'SelectOnlineCorpus': result = ctrl.selectionText; break;
                case 'BrowseThisComputer': result = ctrl.browseData; break;
            }
            if (ctrl.description && ctrl.description !== '') {
                result.title = ctrl.description;
                result.subtitle = SelectClassService.summarizeText(result);
            }
            else {
                result.title = SelectClassService.summarizeText(result);
                result.subtitle = null;
            }
            if (ctrl.className)
                result.className = ctrl.className;
            if (result.hasOwnProperty("runChunking"))
                result.runChunking().then(function() {
                    dispatch({confirmData: result}, alternative);
                });
            else
                dispatch({confirmData: result}, alternative);
            UserService.addRecentSelection({
                title: result.title,
                subtitle: result.subtitle,
                type: 'Class',
                time: Date.now(),
                text: result
            });
        };

        ctrl.loadSaved = function (saved) {
            ctrl.description = (saved && saved.subtitle) ? saved.title : null;
        }
    }
});