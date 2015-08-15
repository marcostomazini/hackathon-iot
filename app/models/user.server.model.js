'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Nome completo não preenchido']
	},
	email: {
		type: String,
		trim: true,
		default: '',
		unique: 'Já existe um email cadastrado',
		validate: [validateLocalStrategyProperty, 'Email não preenchido'],
		match: [/.+\@.+\..+/, 'Digite um email válido']
	},
	picture: {
		type: String,
		trim: true,
		default: ''
	},
  	ativo: { 
  		type: Boolean, 
  		default: true
  	}, 
	username: {
		type: String,
		//unique: 'Já existe um usuário cadastrado',
		required: 'Username é obrigatório',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Digite uma senha mais forte']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider é obrigatório'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['admin', 'user', 'entregador', 'garcom', 'caixa', 'device', 'pdv']
		}],
		default: ['admin']
	},
	updated: {
		type: Date,
		default: Date.now
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	empresa: {
		type: Schema.ObjectId,
		ref: 'Empresa'
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

var user = mongoose.model('User', UserSchema);

// user.schema.path('email').validate(function (value, respond) {
// 	console.log(value);
// 	console.log(respond);
//     user.findOne({ email: value }, function (err, user) {
//         if(user) respond(false);
//         respond(true);
//     });                                                                                                                                                  
// }, 'Esse email já está registrado em nosso sistema');