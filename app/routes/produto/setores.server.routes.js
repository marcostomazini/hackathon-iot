'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var setores = require('../../../app/controllers/produto/setores.server.controller');

	// Routes	
	app.route('/api/setores')
		.get(users.requiresLogin, setores.list)
		.post(users.requiresLogin, setores.hasAuthorization, setores.create);

	app.route('/api/setores/:setorId')
		.get(users.requiresLogin, setores.read)
		.put(users.requiresLogin, setores.hasAuthorization, setores.update)
		.delete(users.requiresLogin, setores.hasAuthorization, setores.delete);

	// pesquisa com filtro - ui select
	app.route('/api/pesquisa/setores').post(users.requiresLogin, setores.pesquisa);

	// Finish by binding
	app.param('setorId', setores.setorByID);
};
