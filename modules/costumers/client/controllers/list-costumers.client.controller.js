(function () {
  'use strict';

  angular
    .module('costumers')
    .controller('CostumersListController', CostumersListController);

  CostumersListController.$inject = ['CostumersService'];

  function CostumersListController(CostumersService) {
    var vm = this;

    vm.costumers = CostumersService.query();
  }
})();
