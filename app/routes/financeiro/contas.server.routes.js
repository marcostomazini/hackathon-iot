'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var contas = require('../../../app/controllers/financeiro/contas.server.controller');

	// Routes
	app.route('/api/contas')
		.get(users.requiresLogin, contas.list)
		.post(users.requiresLogin, contas.hasAuthorization, contas.create);

	app.route('/api/contas/:contaId')
		.get(users.requiresLogin, contas.read)
		.put(users.requiresLogin, contas.hasAuthorization, contas.update)
		.delete(users.requiresLogin, contas.hasAuthorization, contas.delete);

	// Finish by binding
	app.param('contaId', contas.contaByID);
};
