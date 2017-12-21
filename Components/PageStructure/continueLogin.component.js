jTextMinerApp.component('continueLogin',
{
    bindings: {
        $transition$: '<'
    },
    templateUrl: 'Components/PageStructure/continueLogin.component.html',
    controller: function (UserService, StateService, $state) {
        const ctrl = this;
        ctrl.userLogin = '';
        ctrl.onError = false;
        ctrl.nextState = ctrl.$transition$.params().nextState;
        // FirebaseUI config.
        const uiConfig = {
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                signInSuccess: ()=> {
                    $state.go(ctrl.nextState); return false;
                },
            },
            // Terms of service url.
            tosUrl: '<your-tos-url>'
        };

        // Initialize the FirebaseUI Widget using Firebase.
        var ui = StateService.getOrCreate('firebaseUI', () => new firebaseui.auth.AuthUI(firebase.auth()));
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}); 