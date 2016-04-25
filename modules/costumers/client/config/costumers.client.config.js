(function () {
  'use strict';

  angular
    .module('costumers')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Costumers',
      state: 'costumers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'costumers', {
      title: 'List Costumers',
      state: 'costumers.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'costumers', {
      title: 'Create Costumer',
      state: 'costumers.create',
      roles: ['user']
    });
  }
})();
