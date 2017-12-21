jTextMinerApp.component('browseThisComputer', {
    bindings: { browseData: '=' },
    templateUrl: 'Components/Shared/TextSelection/browseThisComputer.component.html',
    controller: ['$scope', 'fileUpload', 'ngDialog', 'UserService', 'SelectClassService',
        function ($scope, fileUpload, ngDialog, UserService, SelectClassService) {
            var ctrl = this;

            //input
            ctrl.browseData = {
                zipFile: '',
                minimumChunkSize: 250,
                chunkMode: 'DoNotChunk'
            };
            ctrl.Browse_fileUploaded = false;
            ctrl.file_changed = function () {
                ctrl.Browse_fileUploaded = true;
                ctrl.UploadZipFile();
            };

            ctrl.UploadZipFile = function () {
                ctrl.browseData = SelectClassService.newTextFromUpload(ctrl.zipFile.name, 'DoNotChunk', 250);
                fileUpload.upload(ctrl.zipFile)
                    .then (function (fileId){
                        ctrl.browseData.fileId = fileId;
                    });
                fileUpload.uploadFileToUrl(ctrl.zipFile, 'zipFile', UserService.$fixmeUser)
                    .then(function (wordCounts) {
                        ctrl.browseData.textInfo.wordCounts = wordCounts;
                        // reduce is used to sum the array
                        ctrl.browseData.textInfo.totalWordCount = wordCounts.reduce((a, b) => a + b, 0);
                        ctrl.browseData.textInfo.numberOfFiles = wordCounts.length;

                        ctrl.browseData.textInfo.doNotChunk_ChunkSize = ctrl.browseData.textInfo.numberOfFiles;
                        ctrl.calculateChunks();
                    });
            };

            ctrl.calculateChunks = function () {
                ctrl.browseData.textInfo.appendAndChunk_ChunkSize
                    = Math.floor(ctrl.browseData.textInfo.totalWordCount / ctrl.browseData.chunkSize);
                ctrl.browseData.textInfo.chunkBigFiles_ChunkSize = Math.floor(
                    ctrl.browseData.textInfo.wordCounts.reduce(
                        (sum, wordCount) => (wordCount / ctrl.browseData.chunkSize) + sum,
                        ctrl.browseData.textInfo.numberOfFiles
                    )
                );
            }
        }]
});