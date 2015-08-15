'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Categoria Schema
 */
var CategoriaSchema = new Schema({
	nome: {
		type: String,
		default: '',
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

module.exports = mongoose.model('Categoria', CategoriaSchema);