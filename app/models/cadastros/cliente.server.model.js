'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

/**
 * Cliente Schema
 */
var ClienteSchema = new Schema({
	nome: {
		type: String,
		default: '',
		required: 'Campo Nome é obrigatório',
		trim: true
	},
	sexo: {
		type: String,
		enum: ['feminino', 'masculino', 'naoInformado'],
		default: 'naoInformado'
	},
	cpf: {
		type: String,
		unique: true,
		required: 'Campo CPF é obrigatório',
		trim: true
	},
	rg: {
		type: String,
		trim: true
	},
	nascimento: {
		type: Date
	},
	endereco: {},
	telefone: {
		type: [{
			type: String,
			trim: true
		}],
	},
	email: {
		type: [{
			type: String,
			trim: true
		}],
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	empresa: {
		type: Schema.ObjectId,
		required: 'Selecione uma empresa para gerenciar',
		ref: 'Empresa'
	}
});

mongoose.model('Cliente', ClienteSchema);