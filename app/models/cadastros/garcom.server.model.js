'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
/**
 * Garcom Schema
 */
var GarcomSchema = new Schema({
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


/**
 * Hook a pre save method to hash the password
 */
GarcomSchema.pre('save', function(next) {
	// if (this.password && this.password.length > 6) {
	// 	this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
	// 	this.password = this.hashPassword(this.password);
	// }

	next();
});

GarcomSchema.pre('remove', function(next) {
	console.log('cascade delete user');
	
    var user = mongoose.model('User');
	console.log('removendo user');
    user.remove({_id: this.user}).exec(); // cascade delete

    next();
});

module.exports = mongoose.model('Garcom', GarcomSchema);