'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * UnidadeMedida Schema
 */
var UnidadeMedidaSchema = new Schema({
	nome: {
		type: String,
		default: '',
		required: 'Campo Nome é obrigatório',
		trim: true
	},
	descricao: {
		type: String,
		default: '',
		trim: true
	},
	sigla: {
		type: String,
		default: '',
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

module.exports = mongoose.model('UnidadeMedida', UnidadeMedidaSchema);