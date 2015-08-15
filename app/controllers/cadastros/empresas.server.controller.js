'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Empresa = mongoose.model('Empresa'),
	_ = require('lodash');

/**
 * Create a Empresa
 */
exports.create = function(req, res) {
	var empresa = new Empresa(req.body);
	empresa.user = req.user;

	empresa.save(function(err) {
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
	res.json(req.empresa);
};

/**
 * Update a Empresa
 */
exports.update = function(req, res) {
	var empresa = req.empresa ;

	empresa = _.extend(empresa , req.body);
	empresa.updated = Date.now();	
	
	empresa.save(function(err) {
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
 * Delete an Empresa
 */
exports.delete = function(req, res) {
	var empresa = req.empresa ;

	empresa.remove(function(err) {
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
 * List of Empresas
 */
exports.list = function(req, res) { 
	if (_.contains(req.user.roles, 'admin')) {
		Empresa.find()
			.where('user').equals(req.user).sort('-created')
			.populate('user', 'name').exec(function(err, empresas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					type: 'error'
				});
			} else {
				res.json(empresas);
			}
		});
	} else if (_.contains(req.user.roles, 'user')) {
		Empresa.find()
			.where('_id').equals(req.user.empresa._id).sort('-created')
			.populate('user', 'name').exec(function(err, empresas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					type: 'error'
				});
			} else {
				res.json(empresas);
			}
		});
	}
};

/**
 * List of Empresas
 */
exports.listActive = function(req, res) { 
	if (_.contains(req.user.roles, 'admin')) {
		Empresa.find({ ativo: true })
			.where('user').equals(req.user).sort('-created')
			.populate('user', 'name').exec(function(err, empresas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					type: 'error'
				});
			} else {
				res.json(empresas);
			}
		});
	} else if (_.contains(req.user.roles, 'user')) {
		Empresa.find({ ativo: true })
			.where('_id').equals(req.user.empresa._id).sort('-created')
			.populate('user', 'name').exec(function(err, empresas) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err),
					type: 'error'
				});
			} else {
				res.json(empresas);
			}
		});
	}
};

/**
 * Empresa middleware
 */
exports.empresaByID = function(req, res, next, id) { 
	Empresa.findById(id).populate('user', 'name').exec(function(err, empresa) {
		if (err) return next(err);
		if (! empresa) return next(new Error('Failed to load Empresa ' + id));
		req.empresa = empresa;
		next();
	});
};

/**
 * Empresa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.empresa != undefined && req.empresa.user.id !== req.user.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};
