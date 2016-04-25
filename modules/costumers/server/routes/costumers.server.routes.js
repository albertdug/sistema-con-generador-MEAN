'use strict';

/**
 * Module dependencies
 */
var costumersPolicy = require('../policies/costumers.server.policy'),
  costumers = require('../controllers/costumers.server.controller');

module.exports = function(app) {
  // Costumers Routes
  app.route('/api/costumers').all(costumersPolicy.isAllowed)
    .get(costumers.list)
    .post(costumers.create);

  app.route('/api/costumers/:costumerId').all(costumersPolicy.isAllowed)
    .get(costumers.read)
    .put(costumers.update)
    .delete(costumers.delete);

  // Finish by binding the Costumer middleware
  app.param('costumerId', costumers.costumerByID);
};
