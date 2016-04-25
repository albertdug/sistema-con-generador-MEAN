'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Costumer Schema
 */
var CostumerSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Costumer name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Costumer', CostumerSchema);
