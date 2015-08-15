'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SensorSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	tipo: {
		type: String,
		default: '',
		trim: true
	},
	valor: {
		type: String,
		default: '',
		trim: true
	}
});

mongoose.model('Sensor', SensorSchema);