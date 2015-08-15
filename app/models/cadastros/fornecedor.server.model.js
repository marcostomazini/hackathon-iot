'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

/**
 * Fornecedor Schema
 */
var FornecedorSchema = new Schema({
	nome: {
		type: String,
		default: '',
		required: 'Campo Nome é obrigatório',
		trim: true
	},
	razaoSocial: {
		type: String,
		default: '',
		trim: true
	},
	cnpj: {
		type: String,
		unique: true,
		required: 'Campo CNPJ é obrigatório',
		trim: true
	},
	inscricaoEstadual: {
		type: String,
		trim: true
	},
	inscricaoMunicipal: {
		type: String,
		trim: true
	},
	endereco: {},
	telefone: {
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

mongoose.model('Fornecedor', FornecedorSchema);