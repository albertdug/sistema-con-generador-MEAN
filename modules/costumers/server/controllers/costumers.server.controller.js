'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Costumer = mongoose.model('Costumer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Costumer
 */
exports.create = function(req, res) {
  var costumer = new Costumer(req.body);
  costumer.user = req.user;

  costumer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costumer);
    }
  });
};

/**
 * Show the current Costumer
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var costumer = req.costumer ? req.costumer.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  costumer.isCurrentUserOwner = req.user && costumer.user && costumer.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(costumer);
};

/**
 * Update a Costumer
 */
exports.update = function(req, res) {
  var costumer = req.costumer ;

  costumer = _.extend(costumer , req.body);

  costumer.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costumer);
    }
  });
};

/**
 * Delete an Costumer
 */
exports.delete = function(req, res) {
  var costumer = req.costumer ;

  costumer.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costumer);
    }
  });
};

/**
 * List of Costumers
 */
exports.list = function(req, res) { 
  Costumer.find().sort('-created').populate('user', 'displayName').exec(function(err, costumers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(costumers);
    }
  });
};

/**
 * Costumer middleware
 */
exports.costumerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Costumer is invalid'
    });
  }

  Costumer.findById(id).populate('user', 'displayName').exec(function (err, costumer) {
    if (err) {
      return next(err);
    } else if (!costumer) {
      return res.status(404).send({
        message: 'No Costumer with that identifier has been found'
      });
    }
    req.costumer = costumer;
    next();
  });
};
