'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Cliente = mongoose.model('Cliente'),
	_ = require('lodash');

/**
 * Create a Cliente
 */
exports.create = function(req, res) {
	var cliente = new Cliente(req.body);
	cliente.empresa = req.body.empresa;

	cliente.save(function(err) {
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
 * Show the current Empresa
 */
exports.read = function(req, res) {
	res.json(req.cliente);
};

/**
 * Update a Cliente
 */
exports.update = function(req, res) {
	var cliente = req.cliente ;

	cliente = _.extend(cliente, req.body);
	cliente.updated = Date.now();
	
	cliente.save(function(err) {
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
 * Delete an Cliente
 */
exports.delete = function(req, res) {
	var cliente = req.cliente ;

	cliente.remove(function(err) {
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
 * List of Clientes
 */
exports.list = function(req, res) { 
	Cliente.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, clientes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(clientes);
		}
	});
};

/**
 * Cliente middleware
 */
exports.clienteByID = function(req, res, next, id) { 
	Cliente.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, cliente) {
		if (err) return next(err);
		if (! cliente) return next(new Error('Failed to load Cliente ' + id));
		req.cliente = cliente;
		next();
	});
};

/**
 * Cliente authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.cliente != undefined && 
		req.cliente.empresa != undefined && 
		req.cliente.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};
