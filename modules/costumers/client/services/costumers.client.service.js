//Costumers service used to communicate Costumers REST endpoints
(function () {
  'use strict';

  angular
    .module('costumers')
    .factory('CostumersService', CostumersService);

  CostumersService.$inject = ['$resource'];

  function CostumersService($resource) {
    return $resource('api/costumers/:costumerId', {
      costumerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
