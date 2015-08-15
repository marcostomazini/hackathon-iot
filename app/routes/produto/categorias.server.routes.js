'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var categorias = require('../../../app/controllers/produto/categorias.server.controller');

	// Routes
	app.route('/api/categorias')
		.get(users.requiresLogin, categorias.list)
		.post(users.requiresLogin, categorias.hasAuthorization, categorias.create);

	app.route('/api/categorias/:categoriaId')
		.get(users.requiresLogin, categorias.read)
		.put(users.requiresLogin, categorias.hasAuthorization, categorias.update)
		.delete(users.requiresLogin, categorias.hasAuthorization, categorias.delete);

	// pesquisa com filtro - ui select
	app.route('/api/pesquisa/categorias').post(users.requiresLogin, categorias.pesquisa);

	// Finish by binding
	app.param('categoriaId', categorias.categoriaByID);
};
