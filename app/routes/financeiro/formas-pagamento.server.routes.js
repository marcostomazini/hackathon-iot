'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var formasPagamento = require('../../../app/controllers/financeiro/formas-pagamento.server.controller');

	// Routes
	app.route('/api/formas-pagamento')
		.get(users.requiresLogin, formasPagamento.list)
		.post(users.requiresLogin, formasPagamento.hasAuthorization, formasPagamento.create);

	app.route('/api/formas-pagamento/:formaPagamentoId')
		.get(users.requiresLogin, formasPagamento.read)
		.put(users.requiresLogin, formasPagamento.hasAuthorization, formasPagamento.update)
		.delete(users.requiresLogin, formasPagamento.hasAuthorization, formasPagamento.delete);

	// Finish by binding
	app.param('formaPagamentoId', formasPagamento.formaPagamentoByID);
};
