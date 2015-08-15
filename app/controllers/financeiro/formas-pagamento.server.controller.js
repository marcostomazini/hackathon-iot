'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	FormaPagamento = mongoose.model('FormaPagamento'),
	_ = require('lodash');

/**
 * Create a FormaPagamento
 */
exports.create = function(req, res) {
	var formaPagamento = new FormaPagamento(req.body);
	formaPagamento.empresa = req.body.empresa;

	formaPagamento.save(function(err) {
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
 * Show the current FormaPagamento
 */
exports.read = function(req, res) {
	res.json(req.formaPagamento);
};

/**
 * Update a FormaPagamento
 */
exports.update = function(req, res) {
	var formaPagamento = req.formaPagamento ;

	formaPagamento = _.extend(formaPagamento, req.body);
	formaPagamento.updated = Date.now();
	
	formaPagamento.save(function(err) {
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
 * Delete an FormaPagamento
 */
exports.delete = function(req, res) {
	var formaPagamento = req.formaPagamento;

	formaPagamento.remove(function(err) {
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
 * List of FormasPagamento
 */
exports.list = function(req, res) { 
	FormaPagamento.find().where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, formasPagamento) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(formasPagamento);
		}
	});
};

/**
 * FormaPagamento middleware
 */
exports.formaPagamentoByID = function(req, res, next, id) { 
	FormaPagamento.findById(id)
		.populate('empresa', 'name')
		.populate('user', '-salt -password')
		.exec(function(err, formaPagamento) {
		if (err) return next(err);
		if (! formaPagamento) return next(new Error('Failed to load Forma Pagamento ' + id));
		req.formaPagamento = formaPagamento;
		next();
	});
};

/**
 * FormaPagamento authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.formaPagamento != undefined && 
		req.formaPagamento.empresa != undefined && 
		req.formaPagamento.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};