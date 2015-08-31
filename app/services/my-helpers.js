angular.module(PKG.name + '.services')
  .factory('myHelpers', function() {
    function objectQuery(obj) {
      if (!angular.isObject(obj)) {
        return null;
      }
      for (var i = 1; i < arguments.length; i++) {
        obj = obj[arguments[i]];
        if (!angular.isObject(obj)) {
          return obj;
        }
      }
      return obj;
    }

    return {
      objectQuery: objectQuery
    };
  });
