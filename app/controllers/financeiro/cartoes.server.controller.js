'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Cartao = mongoose.model('Cartao'),
	_ = require('lodash');

/**
 * Create a Cartao
 */
exports.create = function(req, res) {
	var cartao = new Cartao(req.body);
	cartao.empresa = req.body.empresa;

	cartao.save(function(err) {
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
 * Show the current Cartao
 */
exports.read = function(req, res) {
	res.json(req.cartao);
};

/**
 * Update a Cartao
 */
exports.update = function(req, res) {
	var cartao = req.cartao;

	cartao = _.extend(cartao, req.body);
	cartao.updated = Date.now();	
	
	cartao.save(function(err) {
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
 * Delete an Cartao
 */
exports.delete = function(req, res) {
	var cartao = req.cartao ;

	cartao.remove(function(err) {
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
 * List of Cartoes
 */
exports.list = function(req, res) { 
	Cartao.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, cartoes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(cartoes);
		}
	});
};

/**
 * Cartao middleware
 */
exports.cartaoByID = function(req, res, next, id) { 
	Cartao.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, cartao) {
		if (err) return next(err);
		if (! cartao) return next(new Error('Failed to load cartao ' + id));
		req.cartao = cartao;		
		next();
	});
};

/**
 * Cartao authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.cartao != undefined && 
		req.cartao.empresa != undefined && 
		req.cartao.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};