'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var pontosVenda = require('../../../app/controllers/financeiro/pontos-venda.server.controller');

	// Routes
	app.route('/api/pontos-venda')
		.get(users.requiresLogin, pontosVenda.list)
		.post(users.requiresLogin, pontosVenda.hasAuthorization, pontosVenda.create);

	app.route('/api/pontos-venda/:pontoVendaId')
		.get(users.requiresLogin, pontosVenda.read)
		.put(users.requiresLogin, pontosVenda.hasAuthorization, pontosVenda.update)
		.delete(users.requiresLogin, pontosVenda.hasAuthorization, pontosVenda.delete);

	// Finish by binding
	app.param('pontoVendaId', pontosVenda.pontoVendaByID);
};
