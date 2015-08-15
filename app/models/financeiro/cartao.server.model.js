'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Cartao Schema
 */
var CartaoSchema = new Schema({
	descricao: {
		type: String,
		default: '',
		required: 'Campo Descrição é obrigatório',
		trim: true
	},
	taxaOperadora: {
		type: String,
		get: getPrice, 
		set: setPrice,
		max: 99.99,
		required: 'Campo Taxa Operadora é obrigatório'
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
	toObject: { getters: true, setters: true },
	toJSON : {getters: true, setters: true }
});

function getPrice(num){
    return parseFloat(num/100).toFixed(2);
}

function setPrice(num){
    return (num*100).toFixed(2);
}

module.exports = mongoose.model('Cartao', CartaoSchema);