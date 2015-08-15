'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * FormaPagamento Schema
 */
var FormaPagamentoSchema = new Schema({
	descricao: {
		type: String,
		default: '',
		required: 'Campo Descrição é obrigatório',
		trim: true
	},
	formaPagamento: {
		type: String,
		enum: ['avista', 'cartao', 'cheque', 'conta'],
		required: 'Campo Forma de Pagamento é obrigatório'
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

module.exports = mongoose.model('FormaPagamento', FormaPagamentoSchema);