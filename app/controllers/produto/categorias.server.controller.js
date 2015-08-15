'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Categoria = mongoose.model('Categoria'),
	_ = require('lodash'),
	core = require('../core.server.controller'),
	self = this;

/**
 * Create
 */
exports.create = function(req, res) {
	var categoria = new Categoria(req.body);
	categoria.empresa = req.body.empresa;

	categoria.save(function(err) {
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
	res.json(req.categoria);
};

/**
 * Update
 */
exports.update = function(req, res) {
	var categoria = req.categoria ;

	categoria = _.extend(categoria, req.body);
	categoria.updated = Date.now();
	
	categoria.save(function(err) {
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
	var categoria = req.categoria ;

	categoria.remove(function(err) {
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
	Categoria.find(req.pesquisa)
		.where('empresa').equals(req.user.empresa)
		.sort('-created')
		.limit(req.pesquisa ? core.limitePesquisa : 0)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, categorias) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(categorias);
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
exports.categoriaByID = function(req, res, next, id) { 
	Categoria.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, categoria) {
		if (err) return next(err);
		if (! categoria) return next(new Error('Failed to load categoria ' + id));
		req.categoria = categoria;
		next();
	});
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.categoria != undefined && 
		req.categoria.empresa != undefined && 
		req.categoria.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};