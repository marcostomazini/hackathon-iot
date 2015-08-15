'use strict';

module.exports = function(app) {
	var users = require('../../../app/controllers/users.server.controller');
	var garcoms = require('../../../app/controllers/cadastros/garcoms.server.controller');

	// Garcoms Routes
	app.route('/api/garcoms')
		.get(users.requiresLogin, garcoms.list)
		.post(users.requiresLogin, garcoms.hasAuthorization, garcoms.create);

	app.route('/api/garcoms/:garcomId')
		.get(users.requiresLogin, garcoms.read)
		.put(users.requiresLogin, garcoms.hasAuthorization, garcoms.update)
		.delete(users.requiresLogin, garcoms.hasAuthorization, garcoms.delete);

	// Finish by binding the Garcom middleware
	app.param('garcomId', garcoms.garcomByID);
};
