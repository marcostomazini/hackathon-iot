'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
function getPrice(num){
    return parseFloat(num.toString()).toFixed(2);
}

/**
 * Conta Schema
 */
var ContaSchema = new Schema({
	descricao: {
		type: String,
		required: 'Campo Descrição é obrigatório',
		trim: true
	},
	valor: {
		type: String,
		required: 'Campo Valor é obrigatório',
		get: getPrice
	},
	vencimento: {
		type: Date,
		required: 'Campo Vencimento é obrigatório'
	},
	tipo: {
		type: String,
		enum: ['apagar', 'areceber'],
		required: 'Campo Tipo de Pagamento é obrigatório'
	},
	renovarAutomaticamente: {
		periodicidade: {}
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
},{ 
	toObject: { getters: true },
	toJSON : {getters: true}
});

module.exports = mongoose.model('Conta', ContaSchema);