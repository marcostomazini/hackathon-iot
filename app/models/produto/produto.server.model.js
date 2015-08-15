'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Setor Schema
 */
var ProdutoSchema = new Schema({
	codigo: {
		type: String,
		required: 'Campo Código é obrigatório',
		unique: 'Já existe o mesmo código cadastrado',
		trim: true
	},
	codigoBarra: {
		type: String,
		trim: true
	},
	descricao: {
		type: String,
		required: 'Campo Descrição é obrigatório',
		trim: true
	},	
	detalhes: {
		type: String,
		trim: true
	},
	imagem: {
		type: String,
		trim: true
	},
	categoria: {
		type: Schema.ObjectId,
		required: 'Campo Categoria é obrigatório',
		ref: 'Categoria'
	},
	unidade: {
		type: Schema.ObjectId,
		required: 'Campo Unidade de Medida é obrigatório',
		ref: 'UnidadeMedida'
	},
	tipoProduto: {
		type: String,
		enum: ['composicao', 'complemento', 'produto'],
		required: 'Campo Tipo do Produto é obrigatório'
	},
	setor: {
		type: Schema.ObjectId,
		required: 'Campo Setor é obrigatório',
		ref: 'Setor'
	},
	preco: {
		type: Number,
		required: 'Campo Preço é obrigatório'
	},
	divisivel: { 
  		type: Boolean, 
  		default: false
  	}, 
  	complemento: {
		type: [{
			type: Schema.ObjectId,
			ref: 'Produto'
		}]
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

module.exports = mongoose.model('Produto', ProdutoSchema);