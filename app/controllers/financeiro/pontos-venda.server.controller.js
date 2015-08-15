'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	PontoVenda = mongoose.model('PontoVenda'),
	_ = require('lodash');

/**
 * Create a PontoVenda
 */
exports.create = function(req, res) {
	var pontoVenda = new PontoVenda(req.body);
	pontoVenda.empresa = req.body.empresa;

	pontoVenda.save(function(err) {
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
 * Show the current PontoVenda
 */
exports.read = function(req, res) {
	res.json(req.pontoVenda);
};

/**
 * Update a PontoVenda
 */
exports.update = function(req, res) {
	var pontoVenda = req.pontoVenda ;

	pontoVenda = _.extend(pontoVenda, req.body);
	pontoVenda.updated = Date.now();
	
	pontoVenda.save(function(err) {
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
 * Delete an PontoVenda
 */
exports.delete = function(req, res) {
	var pontoVenda = req.pontoVenda ;

	pontoVenda.remove(function(err) {
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
 * List of PontosVenda
 */
exports.list = function(req, res) { 
	PontoVenda.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, pontosVenda) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(pontosVenda);
		}
	});
};

/**
 * PontoVenda middleware
 */
exports.pontoVendaByID = function(req, res, next, id) { 
	PontoVenda.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, pontoVenda) {
		if (err) return next(err);
		if (! pontoVenda) return next(new Error('Failed to load pontoVenda ' + id));
		req.pontoVenda = pontoVenda;
		next();
	});
};

/**
 * PontoVenda authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.pontoVenda != undefined && 
		req.pontoVenda.empresa != undefined && 
		req.pontoVenda.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};