'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user

		user = _.extend(user, req.body);

		user.updated = Date.now();
	
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						User.findById(user._id).populate('empresa', 'name').exec(function(err, userRetorno) {
							if (err) return next(err);
							if (!userRetorno) return next(new Error('Failed to load user '));
							user = _.extend(user, userRetorno);

							res.json(user);
						});
					}
				});
			}
		});
	} else {
		res.status(401).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function(req, res) {	
	res.json(req.user || null);
};