jTextMinerApp.service('fileUpload', ['APIService', 'UserService', function (APIService, UserService) {
    this.upload = function(file) {
        var fd = new FormData();
        fd.append('uploadFile', file);
        fd.append('userToken', UserService.userToken);
        return APIService.call("UserService/UploadFile", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
            .then (response => response.data.data);
    };
    
    this.uploadFileToUrl = function (file, argument_name, userLoginName) {
        var fd = new FormData();
        fd.append(argument_name, file);
        fd.append('userLogin', userLoginName);
        var uploadUrl;
        switch(argument_name) {
            case 'zipFile':
                uploadUrl = "UserService/UploadZipFile"; break;
            case 'txtFile':
                uploadUrl = "UserService/UploadTxtFile"; break;
            default:
                throw "Unknown upload type.";
        }
        return APIService.call(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        })
        .then(function (response) {
            // this is an array of word counts
            return response.data.data;
        })
        .catch(function () {
            console.log("Upload error.")
        });
    }
}]);