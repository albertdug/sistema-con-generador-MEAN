(function () {
  'use strict';

  angular
    .module('costumers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('costumers', {
        abstract: true,
        url: '/costumers',
        template: '<ui-view/>'
      })
      .state('costumers.list', {
        url: '',
        templateUrl: 'modules/costumers/client/views/list-costumers.client.view.html',
        controller: 'CostumersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Costumers List'
        }
      })
      .state('costumers.create', {
        url: '/create',
        templateUrl: 'modules/costumers/client/views/form-costumer.client.view.html',
        controller: 'CostumersController',
        controllerAs: 'vm',
        resolve: {
          costumerResolve: newCostumer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Costumers Create'
        }
      })
      .state('costumers.edit', {
        url: '/:costumerId/edit',
        templateUrl: 'modules/costumers/client/views/form-costumer.client.view.html',
        controller: 'CostumersController',
        controllerAs: 'vm',
        resolve: {
          costumerResolve: getCostumer
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Costumer {{ costumerResolve.name }}'
        }
      })
      .state('costumers.view', {
        url: '/:costumerId',
        templateUrl: 'modules/costumers/client/views/view-costumer.client.view.html',
        controller: 'CostumersController',
        controllerAs: 'vm',
        resolve: {
          costumerResolve: getCostumer
        },
        data:{
          pageTitle: 'Costumer {{ articleResolve.name }}'
        }
      });
  }

  getCostumer.$inject = ['$stateParams', 'CostumersService'];

  function getCostumer($stateParams, CostumersService) {
    return CostumersService.get({
      costumerId: $stateParams.costumerId
    }).$promise;
  }

  newCostumer.$inject = ['CostumersService'];

  function newCostumer(CostumersService) {
    return new CostumersService();
  }
})();
