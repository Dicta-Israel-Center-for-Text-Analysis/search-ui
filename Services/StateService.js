jTextMinerApp.factory('StateService', function($q) {
    const service = {
        registry: {},
        initPromise: $q.resolve(),
        isBibleMode: true,
        getOrCreate(key, func) {
            if (!service.registry.hasOwnProperty(key))
                service.registry[key] = func();
            return service.registry[key]
        }
    };
    return service;
});