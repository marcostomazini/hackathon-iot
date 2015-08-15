'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Conta = mongoose.model('Conta'),
	_ = require('lodash');

/**
 * Create a Conta
 */
exports.create = function(req, res) {
	var conta = new Conta(req.body);
	conta.empresa = req.body.empresa;

	conta.save(function(err) {
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
};

/**
 * Show the current Conta
 */
exports.read = function(req, res) {
	res.json(req.conta);
};

/**
 * Update a Conta
 */
exports.update = function(req, res) {
	var conta = req.conta ;

	conta = _.extend(conta, req.body);
	conta.updated = Date.now();
	
	conta.save(function(err) {
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
};

/**
 * Delete an Conta
 */
exports.delete = function(req, res) {
	var conta = req.conta;

	conta.remove(function(err) {
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
 * List of Contas
 */
exports.list = function(req, res) { 
	Conta.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, contas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(contas);
		}
	});
};

/**
 * Conta middleware
 */
exports.contaByID = function(req, res, next, id) { 
	Conta.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, conta) {
		if (err) return next(err);
		if (! conta) return next(new Error('Failed to load Conta ' + id));
		req.conta = conta;
		next();
	});
};

/**
 * Conta authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.conta != undefined && 
		req.conta.empresa != undefined && 
		req.conta.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};