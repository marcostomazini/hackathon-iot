'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Setor Schema
 */
var SetorSchema = new Schema({
	nome: {
		type: String,
		required: 'Campo Nome é obrigatório',
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

module.exports = mongoose.model('Setor', SetorSchema);