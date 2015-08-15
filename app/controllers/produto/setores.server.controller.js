'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),	
	Setor = mongoose.model('Setor'),
	_ = require('lodash'),
	core = require('../core.server.controller'),
	self = this;
/**
 * Create
 */
exports.create = function(req, res) {
	var setor = new Setor(req.body);
	setor.empresa = req.body.empresa;

	setor.save(function(err) {
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
	res.json(req.setor);
};

/**
 * Update
 */
exports.update = function(req, res) {
	var setor = req.setor ;

	setor = _.extend(setor, req.body);
	setor.updated = Date.now();
	
	setor.save(function(err) {
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
	var setor = req.setor;

	setor.remove(function(err) {
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
	Setor.find(req.pesquisa)
		.where('empresa').equals(req.user.empresa)
		.sort('-created')
		.limit(req.pesquisa ? core.limitePesquisa : 0)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, setores) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(setores);
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
exports.setorByID = function(req, res, next, id) { 
	Setor.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, setor) {
		if (err) return next(err);
		if (! setor) return next(new Error('Failed to load setor ' + id));
		req.setor = setor;
		next();
	});
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.setor != undefined && 
		req.setor.empresa != undefined && 
		req.setor.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};