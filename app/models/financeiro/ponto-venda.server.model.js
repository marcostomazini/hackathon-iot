'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Garcom Schema
 */
var PontoVendaSchema = new Schema({
	descricao: {
		type: String,
		default: '',
		required: 'Campo Descrição é obrigatório',
		trim: true
	},
	ativo: { 
  		type: Boolean, 
  		default: true
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

module.exports = mongoose.model('PontoVenda', PontoVendaSchema);