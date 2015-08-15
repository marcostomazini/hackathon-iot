'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('clientes').factory('Clientes', ['$resource',
	function($resource) {

		var Clientes = $resource('api/clientes/:clienteId', 
			{ clienteId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Clientes;
	}
]);