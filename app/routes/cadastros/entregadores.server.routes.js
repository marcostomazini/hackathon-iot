'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var entregadores = require('../../../app/controllers/cadastros/entregadores.server.controller');

	// Routes
	app.route('/api/entregadores')
		.get(users.requiresLogin, entregadores.list)
		.post(users.requiresLogin, entregadores.hasAuthorization, entregadores.create);

	app.route('/api/entregadores/:entregadorId')
		.get(users.requiresLogin, entregadores.read)
		.put(users.requiresLogin, entregadores.hasAuthorization, entregadores.update)
		.delete(users.requiresLogin, entregadores.hasAuthorization, entregadores.delete);

	// Finish by binding
	app.param('entregadorId', entregadores.entregadorByID);
};
