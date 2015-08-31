angular.module(PKG.name + '.services')
  .factory('myUrlService', function() {

    function constructUrl(resource) {
      // http://api.icndb.com/jokes/random?firstName=John&lastName=Doe
      return 'http://api.icndb.com/jokes/random?firstName=' + resource.firstName + '&lastName=' + resource.lastName;
    }

    return {
      constructUrl: constructUrl
    };
  });
