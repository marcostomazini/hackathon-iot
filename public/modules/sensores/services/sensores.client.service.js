'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('sensores').factory('Sensores', ['$resource',
	function($resource) {

		var Sensores = $resource('api/sensores/:sensorId', 
			{ sensorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Sensores;
	}
]);