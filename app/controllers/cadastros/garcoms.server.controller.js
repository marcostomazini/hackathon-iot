'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Garcom = mongoose.model('Garcom'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Garcom
 */
exports.create = function(req, res) {

	var user = new User(req.body.user);
	user.provider = 'local';
	user.username = user.email;
	user.roles = ['garcom'];
	user.empresa = req.body.empresa;

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {			

			var garcom = new Garcom();
			garcom.user = user._id;
			garcom.empresa = req.body.empresa;
			
			garcom.save(function(err) {
				if (err) {
					user.remove(function(error) {
						if (error) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(error),
								type: 'error'
							});
						} 
					});

					return res.status(400).send({
						message: errorHandler.getErrorMessage(err),
						type: 'error'
					});
				} else {
					res.json({ 
						'message': 'Registro salvo com sucesso!',
						'type': 'success'
					});
				}
			});
		}
	});
};

/**
 * Show the current Garcom
 */
exports.read = function(req, res) {
	res.json(req.garcom);
};

/**
 * Update a Garcom
 */
exports.update = function(req, res) {
	var garcom = req.garcom;

	User.findById(garcom.user._id,'-salt -password')
		.exec(function(err, user) {
			user = _.extend(user , req.body.user);
			user.updated = Date.now();
			user.save(function(err) {		
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					type: 'error'
				});
			} else {			
				res.json({ 
					'message': 'Registro salvo com sucesso!',
					'type': 'success'
				});
			}
		});
	});
};

/**
 * Delete an Garcom
 */
exports.delete = function(req, res) {
	var garcom = req.garcom ;

	garcom.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json({ 
				'message': 'Registro removido com sucesso!',
				'type': 'success'
			});
		}
	});
};

/**
 * List of Garcoms
 */
exports.list = function(req, res) {
	Garcom.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, garcoms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(garcoms);
		}
	});
};

/**
 * Garcom middleware
 */
exports.garcomByID = function(req, res, next, id) { 
	Garcom.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, garcom) {
		if (err) return next(err);
		if (! garcom) return next(new Error('Failed to load Garcom ' + id));
		req.garcom = garcom;
		next();
	});
};

/**
 * Garcom authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.garcom != undefined && 
		req.garcom.empresa != undefined && 
		req.garcom.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};