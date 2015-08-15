'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Fornecedor = mongoose.model('Fornecedor'),
	_ = require('lodash');

/**
 * Create a Fornecedor
 */
exports.create = function(req, res) {
	var fornecedor = new Fornecedor(req.body);
	fornecedor.empresa = req.body.empresa;

	fornecedor.save(function(err) {
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
	res.json(req.fornecedor);
};

/**
 * Update a Fornecedor
 */
exports.update = function(req, res) {
	var fornecedor = req.fornecedor ;

	fornecedor = _.extend(fornecedor, req.body);
	fornecedor.updated = Date.now();
	
	fornecedor.save(function(err) {
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
 * Delete an Fornecedor
 */
exports.delete = function(req, res) {
	var fornecedor = req.fornecedor ;

	fornecedor.remove(function(err) {
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
 * List of Fornecedores
 */
exports.list = function(req, res) { 
	Fornecedor.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, fornecedores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(fornecedores);
		}
	});
};

/**
 * Fornecedor middleware
 */
exports.fornecedorByID = function(req, res, next, id) { 
	Fornecedor.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, fornecedor) {
		if (err) return next(err);
		if (! fornecedor) return next(new Error('Failed to load fornecedor ' + id));
		req.fornecedor = fornecedor;
		next();
	});
};

/**
 * Fornecedor authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.fornecedor != undefined && 
		req.fornecedor.empresa != undefined && 
		req.fornecedor.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};
