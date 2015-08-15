'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var produtos = require('../../../app/controllers/produto/produtos.server.controller');

	// Routes
	app.route('/api/produtos')
		.get(users.requiresLogin, produtos.list)
		.post(users.requiresLogin, produtos.hasAuthorization, produtos.create);

	app.route('/api/produtos/:produtoId')
		.get(users.requiresLogin, produtos.read)
		.put(users.requiresLogin, produtos.hasAuthorization, produtos.update)
		.delete(users.requiresLogin, produtos.hasAuthorization, produtos.delete);

	// pesquisa com filtro - ui select
	app.route('/api/pesquisa/produtos').post(users.requiresLogin, produtos.pesquisa);
	app.route('/api/pesquisa/complementos').post(users.requiresLogin, produtos.pesquisaComplemento);

	// Finish by binding
	app.param('produtoId', produtos.produtoByID);
};
