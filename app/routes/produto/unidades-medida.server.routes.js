'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var unidadesMedida = require('../../../app/controllers/produto/unidades-medida.server.controller');

	// Routes
	app.route('/api/unidades-medida')
		.get(users.requiresLogin, unidadesMedida.list)
		.post(users.requiresLogin, unidadesMedida.hasAuthorization, unidadesMedida.create);

	app.route('/api/unidades-medida/:unidadeMedidaId')
		.get(users.requiresLogin, unidadesMedida.read)
		.put(users.requiresLogin, unidadesMedida.hasAuthorization, unidadesMedida.update)
		.delete(users.requiresLogin, unidadesMedida.hasAuthorization, unidadesMedida.delete);

	// pesquisa com filtro - ui select
	app.route('/api/pesquisa/unidades-medida').post(users.requiresLogin, unidadesMedida.pesquisa);
	
	// Finish by binding
	app.param('unidadeMedidaId', unidadesMedida.unidadeMedidaByID);
};
