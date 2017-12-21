describe('Service: JTextMinerApp.APIService', function () {

    // load the service's module
    beforeEach(module('JTextMinerApp'));

    // instantiate service
    var APIService;
    var httpBackend;

    //update the injection
    beforeEach(inject(function (_APIService_, $httpBackend) {
        APIService = _APIService_;
        httpBackend = $httpBackend;
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should provide a resource in response to a legacy call to APIService', function () {
        httpBackend.expectPOST(/JTextMinerAPI\/CheckUserLogin/).respond({userLogin: 'eden'});
        APIService.apiRun({ crud: 'CheckUserLogin' }, { userLogin: 'eden' })
            .$promise.then(function(response) {
                expect(response.toJSON()).toEqual({userLogin: 'eden'});
            });
        httpBackend.flush();
    });

    it('should make an HTTP POST when the call method is used', function () {
        httpBackend.expectPOST(/JTextMinerAPI\/CheckUserLogin/).respond({userLogin: 'eden'});
        APIService.call('JTextMinerAPI/CheckUserLogin', { userLogin: 'eden' })
            .then(function(response) {
            expect(response.data).toEqual({userLogin: 'eden'});
        });
        httpBackend.flush();
    });

    it('should make an HTTP POST to the parallels server when the callParallels method is used', function () {
        httpBackend.expectPOST("http://www.dictaparallelsserver.com/api/Parallels").respond({testData: 'test'});
        APIService.callParallels('Parallels', { text: 'testText' })
            .then(function(response) {
            expect(response.data).toEqual({testData: 'test'});
        });
        httpBackend.flush();
    });

});
