'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var clientes = require('../../../app/controllers/cadastros/clientes.server.controller');

	// Clientes Routes
	app.route('/api/clientes')
		.get(users.requiresLogin, clientes.list)
		.post(users.requiresLogin, clientes.hasAuthorization, clientes.create);

	app.route('/api/clientes/:clienteId')
		.get(users.requiresLogin, clientes.read)
		.put(users.requiresLogin, clientes.hasAuthorization, clientes.update)
		.delete(users.requiresLogin, clientes.hasAuthorization, clientes.delete);

	// Finish by binding the Cliente middleware
	app.param('clienteId', clientes.clienteByID);
};
