'use strict';

var sensores = require('../../app/controllers/sensores.server.controller');

module.exports = function(app) {
	// Article Routes
	app.route('/api/sensores')
		.get(showClientRequest, sensores.list)        
        .post(showClientRequest, sensores.enviarDados);

    app.route('/api/stream')
        .get(sensores.stream)
        .post(sensores.publish);

    
    app.route('/api/sensor/:sensorId')            
        .get(sensores.read);

    // Finish by binding the article middleware
    app.param('sensorId', sensores.sensorByID);

	function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
        console.log(request)
        return next();
    }		
};