'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Entregador = mongoose.model('Entregador'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create
 */
exports.create = function(req, res) {

	var user = new User(req.body.user);
	user.provider = 'local';
	user.username = user.email;
	user.roles = ['entregador'];
	user.empresa = req.body.empresa;

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {			

			var entregador = new Entregador();
			entregador.user = user._id;
			entregador.empresa = req.body.empresa;
			
			entregador.save(function(err) {
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
 * Show the current
 */
exports.read = function(req, res) {
	res.json(req.entregador);
};

/**
 * Update
 */
exports.update = function(req, res) {
	var entregador = req.entregador;

	User.findById(entregador.user._id,'-salt -password')
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
 * Delete
 */
exports.delete = function(req, res) {
	var entregador = req.entregador ;

	entregador.remove(function(err) {
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
 * List
 */
exports.list = function(req, res) {
	Entregador.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, entregadores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(entregadores);
		}
	});
};

/**
 * Middleware
 */
exports.entregadorByID = function(req, res, next, id) { 
	Entregador.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, entregador) {
		if (err) return next(err);
		if (! entregador) return next(new Error('Failed to load Entregador ' + id));
		req.entregador = entregador;
		next();
	});
};

/**
 * Authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.entregador != undefined && 
		req.entregador.empresa != undefined && 
		req.entregador.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};