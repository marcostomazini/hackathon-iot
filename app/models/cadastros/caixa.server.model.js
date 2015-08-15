'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Garcom Schema
 */
var CaixaSchema = new Schema({
	user: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Os dados para login não foram preenchidos'
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

CaixaSchema.pre('remove', function(next) {	
    var user = mongoose.model('User');
	console.log('removendo user');
    user.remove({_id: this.user}).exec(); // cascade delete

    next();
});

module.exports = mongoose.model('Caixa', CaixaSchema);