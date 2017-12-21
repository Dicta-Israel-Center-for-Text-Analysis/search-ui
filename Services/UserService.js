/**
 * @ngdoc service
 * @name JTextMinerApp:UserService
 *
 * @description
 *
 *
 * */
angular.module('JTextMinerApp')
    .factory('UserService', ['APIService', '$q', '$timeout', function(APIService, $q, $timeout)
{
    const service = {
        $fixmeUser: 'testuser',
        $user: firebase.auth().currentUser,
        $loginDeferral: $q.defer(),
        tryLogin,
        logout() {
            firebase.auth().signOut().then (() => {service.storage = {}});
            $.removeCookie('userLogin');
        },
        isLoggedIn() {
            return !_.isNil(this.$user);
        },
        get user() {
            return this.$user;
        },
        get userToken() {
            return this.$userToken;
        },
        get loginPromise() {
            return this.$loginDeferral.promise;
        },
        get savedSelections() {
            return getSelectionList(SAVED_SELECTIONS);
        },
        get recentSelections() {
            return getSelectionList(RECENT_SELECTIONS);
        },
        saveSelection,
        saveTextSelection,
        addRecentSelection,
    };
    firebase.auth().onAuthStateChanged(function(user) {
        $timeout(
            () => {
                service.$user = user;
            }
        )
    });
    const SAVED_SELECTIONS = '_savedSelections';
    const RECENT_SELECTIONS = '_recentSelections';

    function saveTextSelection(text, type) {
        saveSelection({
            title: text.title,
            subtitle: text.subtitle || null,
            type: type,
            time: Date.now(),
            text: text
        });
    }

    function saveSelection(selection) {
        addToSelectionList(selection, SAVED_SELECTIONS);
    }

    function addRecentSelection(selection) {
        addToSelectionList(selection, RECENT_SELECTIONS, 10);
    }

    function addToSelectionList(selection, listName, limit) {
        if (!service.hasOwnProperty(listName))
            service[listName] = get(listName, []);
        // only one item for a given title allowed
        service[listName] = service[listName].filter(item => item.title !== selection.title);
        service[listName].unshift(selection);
        if (limit && service[listName].length > limit)
            service[listName].pop();
        store(listName, service[listName]);
    }

    function getSelectionList(listName) {
        //if (!service.hasOwnProperty(listName))
            service[listName] = get(listName, []);
        return service[listName];
    }

    function firebaseUserRef(key) {
        return firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/" + key);
    }

    function store(name, object) {
        if (service.$user) {
            const ref = firebaseUserRef(name);
            ref.set(object);
        }
        else
            window.sessionStorage.setItem(name, JSON.stringify(object));
    }

    function get(name, defaultVal) {
        if (!service.storage)
            service.storage = {};
        if (service.storage[name])
            return service.storage[name];
        if (service.$user) {
            service.storage[name] = defaultVal;
            var ref = firebaseUserRef(name);
            ref.off();
            ref.on('value', function (data) {
                $timeout(
                    () => {
                        if (data.val() && !_.isEqual(service.storage[name], data.val()))
                            service.storage[name] = data.val()
                    }
                );
            });
            return service.storage[name];
        }
        else {
            const stored = window.sessionStorage.getItem(name);
            if (stored === null)
                service.storage[name] = defaultVal;
            else
                service.storage[name] = JSON.parse(stored);
            return service.storage[name];
        }
    }

    function tryLogin (username) {
        APIService.call('UserService/Login', {
            username
        })
            .then(response => {
                if (response.data.success) {
                    service.$loginDeferral.resolve();
                    service.$userToken = response.data.data;
                }
            });
        const triedLogin = APIService.call('JTextMinerAPI/CheckUserLogin', { userLogin: username })
            .then(handleLoginAPIResponse);
        triedLogin.catch(handleLoginAPIError);
        return triedLogin;
    }

    function handleLoginAPIResponse(response){
        const login = response.data.userLogin;
        if (login !== "") {
            // service.$user = login;
            if (login !== 'testuser')
                $.cookie('userLogin', login);
            window.sessionStorage.setItem('userLoginData', JSON.stringify({
                $user: 'testuser',
                $userToken: service.$userToken
            }));
        }
        else
            throw "Login error.";
    }

    function handleLoginAPIError(response) {
        service.$user = null;
    }

    const storedLoginData = window.sessionStorage.getItem('userLoginData');
    if (storedLoginData) {
        const parsedData = JSON.parse(storedLoginData);
//      service.$user = parsedData.$user;
        service.$userToken = parsedData.$userToken;
        service.$loginDeferral.resolve();
    }

    return service;
}]);