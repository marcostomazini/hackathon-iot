'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var empresas = require('../../../app/controllers/cadastros/empresas.server.controller');

	// Empresas Routes
	app.route('/api/empresas/actives')
		.get(users.requiresLogin, empresas.listActive);

	app.route('/api/empresas')
		.get(users.requiresLogin, empresas.list)
		.post(users.requiresLogin, empresas.hasAuthorization, empresas.create);

	app.route('/api/empresas/:empresaId')
		.get(users.requiresLogin, empresas.read)
		.put(users.requiresLogin, empresas.hasAuthorization, empresas.update)
		.delete(users.requiresLogin, empresas.hasAuthorization, empresas.delete);

	// Finish by binding the Empresa middleware
	app.param('empresaId', empresas.empresaByID);
};
