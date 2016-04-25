(function () {
  'use strict';

  // Costumers controller
  angular
    .module('costumers')
    .controller('CostumersController', CostumersController);

  CostumersController.$inject = ['$scope', '$state', 'Authentication', 'costumerResolve'];

  function CostumersController ($scope, $state, Authentication, costumer) {
    var vm = this;

    vm.authentication = Authentication;
    vm.costumer = costumer;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Costumer
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.costumer.$remove($state.go('costumers.list'));
      }
    }

    // Save Costumer
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.costumerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.costumer._id) {
        vm.costumer.$update(successCallback, errorCallback);
      } else {
        vm.costumer.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('costumers.view', {
          costumerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
