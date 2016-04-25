(function () {
  'use strict';

  describe('Costumers Route Tests', function () {
    // Initialize global variables
    var $scope,
      CostumersService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CostumersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CostumersService = _CostumersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('costumers');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/costumers');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          CostumersController,
          mockCostumer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('costumers.view');
          $templateCache.put('modules/costumers/client/views/view-costumer.client.view.html', '');

          // create mock Costumer
          mockCostumer = new CostumersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Costumer Name'
          });

          //Initialize Controller
          CostumersController = $controller('CostumersController as vm', {
            $scope: $scope,
            costumerResolve: mockCostumer
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:costumerId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.costumerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            costumerId: 1
          })).toEqual('/costumers/1');
        }));

        it('should attach an Costumer to the controller scope', function () {
          expect($scope.vm.costumer._id).toBe(mockCostumer._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/costumers/client/views/view-costumer.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CostumersController,
          mockCostumer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('costumers.create');
          $templateCache.put('modules/costumers/client/views/form-costumer.client.view.html', '');

          // create mock Costumer
          mockCostumer = new CostumersService();

          //Initialize Controller
          CostumersController = $controller('CostumersController as vm', {
            $scope: $scope,
            costumerResolve: mockCostumer
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.costumerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/costumers/create');
        }));

        it('should attach an Costumer to the controller scope', function () {
          expect($scope.vm.costumer._id).toBe(mockCostumer._id);
          expect($scope.vm.costumer._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/costumers/client/views/form-costumer.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CostumersController,
          mockCostumer;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('costumers.edit');
          $templateCache.put('modules/costumers/client/views/form-costumer.client.view.html', '');

          // create mock Costumer
          mockCostumer = new CostumersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Costumer Name'
          });

          //Initialize Controller
          CostumersController = $controller('CostumersController as vm', {
            $scope: $scope,
            costumerResolve: mockCostumer
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:costumerId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.costumerResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            costumerId: 1
          })).toEqual('/costumers/1/edit');
        }));

        it('should attach an Costumer to the controller scope', function () {
          expect($scope.vm.costumer._id).toBe(mockCostumer._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/costumers/client/views/form-costumer.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
