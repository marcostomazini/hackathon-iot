'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	UnidadeMedida = mongoose.model('UnidadeMedida'),
	_ = require('lodash'),
	core = require('../core.server.controller'),
	self = this;

/**
 * Create
 */
exports.create = function(req, res) {
	var unidadeMedida = new UnidadeMedida(req.body);
	unidadeMedida.empresa = req.body.empresa;

	unidadeMedida.save(function(err) {
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
 * Show the current 
 */
exports.read = function(req, res) {
	res.json(req.unidadeMedida);
};

/**
 * Update 
 */
exports.update = function(req, res) {
	var unidadeMedida = req.unidadeMedida;

	unidadeMedida = _.extend(unidadeMedida, req.body);
	unidadeMedida.updated = Date.now();	
	
	unidadeMedida.save(function(err) {
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
 * Delete
 */
exports.delete = function(req, res) {
	var unidadeMedida = req.unidadeMedida ;

	unidadeMedida.remove(function(err) {
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
	UnidadeMedida.find(req.pesquisa)
		.where('empresa').equals(req.user.empresa)
		.sort('-created')
		.limit(req.pesquisa ? core.limitePesquisa : 0)
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
 * Pesquisa
 */
exports.pesquisa = function(req, res) {  
	req.pesquisa = core.tratarPesquisa(req.body);
	self.list(req, res);
};

/**
 * middleware
 */
exports.unidadeMedidaByID = function(req, res, next, id) { 
	UnidadeMedida.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, unidadeMedida) {
		if (err) return next(err);
		if (! unidadeMedida) return next(new Error('Failed to load Unidade Medida ' + id));
		req.unidadeMedida = unidadeMedida;		
		next();
	});
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.unidadeMedida != undefined && 
		req.unidadeMedida.empresa != undefined && 
		req.unidadeMedida.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};