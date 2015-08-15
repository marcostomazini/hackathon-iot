'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Produto = mongoose.model('Produto'),
	_ = require('lodash'),
	core = require('../core.server.controller'),
	self = this;

/**
 * Create
 */
exports.create = function(req, res) {
	var produto = new Produto(req.body);
	produto.empresa = req.body.empresa;

	if (produto.tipoProduto == 'complemento') produto.complemento = [];

	produto.save(function(err) {
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
	res.json(req.produto);
};

/**
 * Update
 */
exports.update = function(req, res) {
	var produto = req.produto ;

	produto = _.extend(produto, req.body);
	produto.updated = Date.now();

	if (produto.tipoProduto == 'complemento') produto.complemento = [];
	
	produto.save(function(err) {
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
	var produto = req.produto;

	produto.remove(function(err) {
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
	Produto.find(req.pesquisa).where('empresa').equals(req.user.empresa)
		.sort('-created')
		.populate('empresa', 'name')
		.populate('categoria', 'nome')
		.populate('unidade', 'nome')
		.populate('setor', 'nome')
		.populate('user', '-salt -password')
		.exec(function(err, produtos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err),
				type: 'error'
			});
		} else {
			res.json(produtos);
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

exports.pesquisaComplemento = function(req, res) {  
	req.pesquisa = {'tipoProduto': 'complemento'};
	self.list(req, res);
};

/**
 * middleware
 */
exports.produtoByID = function(req, res, next, id) { 
	Produto.findById(id)
		.populate('empresa', 'name')
		.populate('categoria', 'nome')
		.populate('unidade', 'nome')
		.populate('setor', 'nome')
		//.populate('complemento', 'descricao')
		.populate('user', '-salt -password')
		.exec(function(err, produto) {
		if (err) return next(err);
		if (! produto) return next(new Error('Failed to load produto ' + id));
		req.produto = produto;
		next();
	});
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (_.contains(req.user.roles, 'user') || 
		(req.produto != undefined && 
		req.produto.empresa != undefined && 
		req.produto.empresa.id !== req.user.empresa.id)) {
		return res.status(403).send({
			message: 'Você não tem autorização para efetuar essa ação',
			type: 'error'
		});
	}
	next();
};