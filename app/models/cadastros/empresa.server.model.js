'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

/**
 * Empresa Schema
 */
var EmpresaSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Campo Nome da Empresa é obrigatório',
		trim: true
	},
	cnpj: {
		type: String,
		unique: true,
		required: 'Campo CNPJ é obrigatório',
		trim: true
	},
	telefone: {
		type: String,
		trim: true
	},
	logo: {
		type: String,
		trim: true,
		default: ''
	},
  	ativo: { 
  		type: Boolean, 
  		default: true
  	},
	endereco: {},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

var cascadeGarcom = function(self) {	
	var garcom = mongoose.model('Garcom');
	console.log('removendo garcons');
	
	garcom.find()
		.where('empresa').equals(self._id)
		.sort('-created')
		.populate('user', '-salt -password')
		.exec(function(err, garcoms) {
		if (!err) {			
			_(garcoms).forEach(function(garcom) {
				var user = mongoose.model('User');
				console.log('removendo user garcom');
				user.remove({_id: garcom.user._id}).exec(); // cascade delete
			}).value();
			garcom.remove({empresa: self._id}).exec(); // cascade delete
		}
	});  
};

var cascadeCaixa = function(self) {

	var caixa = mongoose.model('Caixa');
	console.log('removendo caixa');
	
	caixa.find()
		.where('empresa').equals(self._id)
		.sort('-created')
		.populate('user', '-salt -password')
		.exec(function(err, caixas) {
		if (!err) {			
			_(caixas).forEach(function(caixa) {
				var user = mongoose.model('User');
				console.log('removendo user caixa');
				user.remove({_id: caixa.user._id}).exec(); // cascade delete
			}).value();
			caixa.remove({empresa: self._id}).exec(); // cascade delete
		}
	});  
};

var cascadeEntregador = function(self) {

	var entregador = mongoose.model('Entregador');
	console.log('removendo entregador');
	
	entregador.find()
		.where('empresa').equals(self._id)
		.sort('-created')
		.populate('user', '-salt -password')
		.exec(function(err, entregadores) {
		if (!err) {			
			_(entregadores).forEach(function(entregador) {
				var user = mongoose.model('User');
				console.log('removendo user entregador');
				user.remove({_id: entregador.user._id}).exec(); // cascade delete
			}).value();
			entregador.remove({empresa: self._id}).exec(); // cascade delete
		}
	});  
};

// EmpresaSchema.pre('save', function(next) {
// 	// console.log(this.telefone)
// 	// if (this.telefone) { 
// 	// 	this.telefone = this.telefone.toString().replace(/\D/g, '');
// 	// }
// 	// if (this.cnpj) { 
// 	// 	this.cnpj = this.cnpj.toString().replace(/\D/g, '');
// 	// }
// });

EmpresaSchema.pre('remove', function(next) {  
	console.log('cascade delete empresa');	

	cascadeGarcom(this);
	cascadeCaixa(this);
	cascadeEntregador(this);

    next();
});

mongoose.model('Empresa', EmpresaSchema);