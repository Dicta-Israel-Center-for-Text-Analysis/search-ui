describe('Service: JTextMinerApp.UserService', function () {

    // load the service's module
    beforeEach(module('JTextMinerApp'));

    // instantiate service
    var UserService;
    var httpBackend;

    //update the injection
    beforeEach(inject(function (_UserService_, $httpBackend) {
        UserService = _UserService_;
        $httpBackend.whenPOST(/.*CheckUserLogin.*/).respond({userLogin: 'eden'});
        httpBackend = $httpBackend;
    }));

    it('should default to logged out.', function () {
        expect(UserService.isLoggedIn()).toBe(false);
    });

    it('should succeed in logging in eden.', function () {
        httpBackend.expectPOST(/.*CheckUserLogin/);
        var loginPromise = UserService.tryLogin('eden');
        httpBackend.flush();
        expect(UserService.isLoggedIn()).toBe(true);
        expect(UserService.user).toBe("eden");
    });

    it('should succeed in logging out eden.', function () {
        httpBackend.expectPOST(/.*CheckUserLogin/);
        var loginPromise = UserService.tryLogin('eden');
        httpBackend.flush();
        UserService.logout();
        expect(UserService.isLoggedIn()).toBe(false);
        expect(UserService.user).toBe(null);
    });
});
