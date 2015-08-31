angular
  .module(PKG.name, [
    'ngSanitize',
    'ngResource',

    angular.module(PKG.name + '.services', [
      'cask-angular-window-manager'
    ]).name
  ])
  .config(function($provide) {
    $provide.decorator('$http', function($delegate, MyDataSource) {
      function newHttp(config) {
        var promise,
            myDataSrc;
        if (config.options) {
          // Can/Should make use of my<whatever>Api service in another service.
          // So in that case the service will not have a scope. Hence the check
          if (config.params && config.params.scope) {
            myDataSrc = MyDataSource(config.params.scope);
            delete config.params.scope;
          } else {
            myDataSrc = MyDataSource();
          }
          // We can use MyDataSource directly or through $resource'y way.
          // If we use $resource'y way then we need to make some changes to
          // the data we get for $resource.
          config.$isResource = true;
          switch(config.options.type) {
            case 'POLL':
              promise = myDataSrc.poll(config);
              break;
            case 'REQUEST':
              promise = myDataSrc.request(config);
              break;
            case 'POLL-STOP':
              promise = myDataSrc.stopPoll(config);
              break;
          }
          return promise;
        } else {
          return $delegate(config);
        }
      }

      newHttp.get = $delegate.get;
      newHttp.delete = $delegate.delete;
      newHttp.save = $delegate.save;
      newHttp.query = $delegate.query;
      newHttp.remove = $delegate.remove;
      newHttp.post = $delegate.post;
      newHttp.put = $delegate.put;
      return newHttp;
    });
  })
  .controller('MyChuckController', function(myChuckServiceApi, $scope, MyDataSource) {
    $scope.requestType = 'Request';
    $scope.isPolling = false;
    $scope.data = {
      firstName: '',
      lastName: '',
      joke: ''
    };
    $scope.config = {
      pollInterval: 10000
    };
    var manualPollId;
    var myDataSrc = new MyDataSource($scope);
    var params;

    $scope.makeRequest = function() {
      params = {
        firstName: $scope.data.firstName,
        lastName: $scope.data.lastName
      };
      myChuckServiceApi
        .getJokes(params)
        .$promise
        .then( success, error);
    };

    $scope.startPolling = function() {
      params = {
        firstName: $scope.data.firstName,
        lastName: $scope.data.lastName
      };
      $scope.isPolling = true;
      params.scope = $scope;
      myChuckServiceApi
        .pollJokes(params)
        .$promise
        .then( success, error);
    };

    $scope.stopPolling = function() {
      myChuckServiceApi
        .stopPollJokes(params);
      $scope.isPolling = false;
    };

    $scope.manualStartPoll = function() {
      var resourceJson = {};
      var url = 'http://api.icndb.com/jokes/random';
      if ($scope.data.firstName.length && $scope.data.lastName.length) {
        url += '?firstName=' + $scope.data.firstName + '&lastName=' + $scope.data.lastName;
      }
      resourceJson.url = url;
      if ($scope.config.pollInterval) {
        resourceJson.interval = parseInt($scope.config.pollInterval, 10);
      }
      manualPollId = myDataSrc
        .poll(resourceJson, function(res) {
          $scope.data.joke = res.value.joke;
        }).__pollId__;
      $scope.isPolling = true;
    };

    $scope.manualStopPoll = function() {
      $scope.isPolling = false;
      if (manualPollId) {
        myDataSrc.stopPoll(manualPollId);
      }
    };

    function success(res) {
      $scope.data.joke = res.value.joke;
    }
    function error(err) {
      console.info('boink! :', err);
    }

  });
