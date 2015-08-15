'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var cartoes = require('../../../app/controllers/financeiro/cartoes.server.controller');

	// Routes
	app.route('/api/cartoes')
		.get(users.requiresLogin, cartoes.list)
		.post(users.requiresLogin, cartoes.hasAuthorization, cartoes.create);

	app.route('/api/cartoes/:cartaoId')
		.get(users.requiresLogin, cartoes.read)
		.put(users.requiresLogin, cartoes.hasAuthorization, cartoes.update)
		.delete(users.requiresLogin, cartoes.hasAuthorization, cartoes.delete);

	// Finish by binding
	app.param('cartaoId', cartoes.cartaoByID);
};
