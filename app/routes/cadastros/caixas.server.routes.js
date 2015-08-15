'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var caixas = require('../../../app/controllers/cadastros/caixas.server.controller');

	// Routes
	app.route('/api/caixas')
		.get(users.requiresLogin, caixas.list)
		.post(users.requiresLogin, caixas.hasAuthorization, caixas.create);

	app.route('/api/caixas/:caixaId')
		.get(users.requiresLogin, caixas.read)
		.put(users.requiresLogin, caixas.hasAuthorization, caixas.update)
		.delete(users.requiresLogin, caixas.hasAuthorization, caixas.delete);

	// Finish by binding
	app.param('caixaId', caixas.caixaByID);
};
