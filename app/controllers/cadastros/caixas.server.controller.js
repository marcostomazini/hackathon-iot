'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Caixa = mongoose.model('Caixa'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Caixa
 */
exports.create = function(req, res) {

	var user = new User(req.body.user);
	user.provider = 'local';
	user.username = user.email;
	user.roles = ['caixa'];
	user.empresa = req.body.empresa;

	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {			

			var caixa = new Caixa();
			caixa.user = user._id;
			caixa.empresa = req.body.empresa;
			
			caixa.save(function(err) {
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
	res.json(req.caixa);
};

/**
 * Update
 */
exports.update = function(req, res) {
	var caixa = req.caixa;

	User.findById(caixa.user._id,'-salt -password')
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
	var caixa = req.caixa ;

	caixa.remove(function(err) {
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
	Caixa.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, caixas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(caixas);
		}
	});
};

/**
 * Middleware
 */
exports.caixaByID = function(req, res, next, id) { 
	Caixa.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, caixa) {
		if (err) return next(err);
		if (! caixa) return next(new Error('Failed to load Caixa ' + id));
		req.caixa = caixa;
		next();
	});
};

/**
 * Authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.caixa != undefined && 
		req.caixa.empresa != undefined && 
		req.caixa.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};