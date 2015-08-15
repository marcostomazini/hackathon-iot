'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var fornecedores = require('../../../app/controllers/cadastros/fornecedores.server.controller');

	// Fornecedores Routes
	app.route('/api/fornecedores')
		.get(users.requiresLogin, fornecedores.list)
		.post(users.requiresLogin, fornecedores.hasAuthorization, fornecedores.create);

	app.route('/api/fornecedores/:fornecedorId')
		.get(users.requiresLogin, fornecedores.read)
		.put(users.requiresLogin, fornecedores.hasAuthorization, fornecedores.update)
		.delete(users.requiresLogin, fornecedores.hasAuthorization, fornecedores.delete);

	// Finish by binding the Fornecedor middleware
	app.param('fornecedorId', fornecedores.fornecedorByID);
};
