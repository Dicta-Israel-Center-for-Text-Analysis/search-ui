jTextMinerApp.component('selectOnlineCorpus', {
        bindings: {
            selectionText: '=',
            onLoadSaved: '&',
            explanationComponent: '<'
        },
        templateUrl: 'Components/Shared/TextSelection/selectOnlineCorpus.component.html',
        controller: function (TreeService, SelectClassService, APIService, UserService) {
            var ctrl = this;
            ctrl.running = false;
            ctrl.UserService = UserService;
            ctrl.mode = 'select';

            function initBreadCrumbs() {
                ctrl.breadCrumbs = [{
                    title: 'Collection',
                    children: TreeService.corpusTree
                }];
            }

            TreeService.readyPromise.then(function() {
                ctrl.corpusTree = TreeService.corpusTree;
                ctrl.treeNode = ctrl.corpusTree;
                initBreadCrumbs();

                // list selected nodes by key
                if (ctrl.selectionText && ctrl.selectionText.keys)
                    ctrl.selectedNodes = ctrl.selectionText.keys.map(function(key){return key.substring("/Dicta Corpus/".length)});
                else
                    ctrl.selectedNodes = [];
                recalculatePartials();
                updatePreview(ctrl.selectionText);
            });

            // end of tree setup; helper functions come next

            ctrl.expandNode = function (itemTitle) {
                var currentNode = ctrl.treeNode;
                for (var i=0; i < currentNode.length; i++) {
                    if (currentNode[i]['title'] == itemTitle) {
                        var node = currentNode[i];
                        return TreeService.loadNode(node)
                            .then(function(loadedNode) {
                                ctrl.treeNode = loadedNode.children;
                                ctrl.breadCrumbs.push({
                                    title: itemTitle,
                                    children: loadedNode.children
                                });
                            });
                    }
                }
            };

            // remove current item from array if 'ancestor' is an ancestor
            function removeIfAncestor(arr, idx, ancestor) {
                var current = TreeService.keyToNode(arr[idx]);
                while(current['parent'] != null) {
                    if (current['parent'] === ancestor) {
                        arr.splice(idx, 1);
                        break;
                    }
                    current = current['parent'];
                }
            }

            function recalculatePartials() {
                ctrl.partialNodes = [];
                for (var i=0;i< ctrl.selectedNodes.length; i++) {
                    var parent = TreeService.keyToNode(ctrl.selectedNodes[i])['parent'];
                    while (parent != null) {
                        if (ctrl.partialNodes.indexOf(parent['key']) == -1)
                            ctrl.partialNodes.push(parent['key']);
                        parent = parent['parent'];
                    }
                }
            }

            ctrl.isNodeSelected = function isNodeSelected(node) {
                var parent = TreeService.keyToNode(node)['parent'];
                return ctrl.selectedNodes.indexOf(node) > -1 || (parent != null && isNodeSelected(parent['key']));
            };

            ctrl.isNodePartial = function isNodePartial(node) {
                return ctrl.partialNodes.indexOf(node) > -1;
            };

            // toggle selection for a given node by key
            ctrl.toggleSelection = function toggleSelection(itemKey) {
                // is currently selected, so this deselects
                if (ctrl.isNodeSelected(itemKey)) {
                    // currently selected itself?
                    var idx = ctrl.selectedNodes.indexOf(itemKey);
                    if (idx > -1) {
                        // yes, so remove it.
                        ctrl.selectedNodes.splice(idx, 1);
                    }
                    else {
                        // select siblings and deselect ancestor
                        var currentNode = TreeService.keyToNode(itemKey);
                        while ((idx = ctrl.selectedNodes.indexOf(currentNode['key'])) == -1) {
                            var children = currentNode['parent']['children'];
                            for (var i = 0; i < children.length; i++)
                                if (children[i] != currentNode)
                                    ctrl.selectedNodes.push(children[i]['key']);
                            currentNode = currentNode['parent'];
                        }
                        ctrl.selectedNodes.splice(idx, 1);
                    }
                }
                // is newly selected
                else {
                    // select this
                    ctrl.selectedNodes.push(itemKey);
                    // check if all siblings are selected
                    var parent = TreeService.keyToNode(itemKey)['parent'];
                    if (parent != null) {
                        var sibCount = 0;
                        var siblings = parent['children'];
                        for (var i = 0; i < siblings.length; i++)
                            if (ctrl.selectedNodes.indexOf(siblings[i]['key']) > -1)
                                sibCount++;
                        // if so, select the parent
                        if (sibCount == siblings.length)
                            ctrl.toggleSelection(parent['key']);

                    }
                }

                // remove any descendants already selected
                for (var i = ctrl.selectedNodes.length - 1; i>=0; i--)
                    removeIfAncestor(ctrl.selectedNodes, i, TreeService.keyToNode(itemKey));

                recalculatePartials();

                ctrl.selectedNodes = TreeService.treeSort(ctrl.selectedNodes, key => key);
                ctrl.selectionText = SelectClassService.newTextFromCorpus(
                    ctrl.selectedNodes.map(key => "/Dicta Corpus/" + key),
                    ctrl.selectedNodes.map(key => TreeService.keyToNode(key).id)
                );

                updatePreview(ctrl.selectionText);
            };

            function updatePreview(selectedText) {
                if (!selectedText || selectedText.keys.length === 0) {
                    ctrl.previewText = null;
                    return;
                }
                ctrl.running = true;
                APIService.call('TextFeatures/GetTextLargeAndSmall', selectedText.keys)
                    .then(function (response) {
                        ctrl.running = false;
                        ctrl.previewText = response.data;
                    });
            }

            ctrl.selectCrumb = function (crumbNumber) {
                ctrl.breadCrumbs = ctrl.breadCrumbs.slice(0, crumbNumber+1);
                ctrl.treeNode = ctrl.breadCrumbs[crumbNumber].children;
            };

            ctrl.saveClass = function (saveClass) {
                ctrl.selectedNodes = saveClass.keys.map(function(key){return key.substring("/Dicta Corpus/".length)});
                ctrl.selectionText = saveClass;
                updatePreview(saveClass);
                recalculatePartials();
                ctrl.mode = 'select';
                ctrl.onLoadSaved({saved: saveClass});
            };

            ctrl.goUp = function () {
                if (ctrl.breadCrumbs.length > 1)
                    ctrl.selectCrumb(ctrl.breadCrumbs.length - 2);
            };

            ctrl.toggleAll = function() {
                const allSelected = ctrl.treeNode.every(node => ctrl.isNodeSelected(node.key));
                ctrl.treeNode.forEach(node => {
                    const key = node.key;
                    if (!allSelected) {
                        if (!ctrl.isNodeSelected(key))
                            ctrl.toggleSelection(key);
                    }
                    else
                        ctrl.toggleSelection(key);
                })
            }
        }
});