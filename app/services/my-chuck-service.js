angular.module(PKG.name + '.services')
  .service('myChuckServiceApi', function($resource) {
    var jokePath = 'http://api.icndb.com/jokes/random';
    return $resource(
      '',
      {

      },
      {
        'getJokes': {
          method: 'GET',
          url: jokePath,
          options: {
            type: 'REQUEST'
          }
        },
        'pollJokes': {
          method: 'GET',
          url: jokePath,
          options: {
            type: 'POLL'
          },
          interval: 7000
        },
        'stopPollJokes': {
          method: 'GET',
          url: jokePath,
          options: {
            type: 'POLL-STOP'
          }
        }
      }
    );
  });
