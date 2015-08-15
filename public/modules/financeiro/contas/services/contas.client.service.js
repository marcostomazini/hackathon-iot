'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('contas').factory('Contas', ['$resource',
	function($resource) {

		var Contas = $resource('api/contas/:contaId', 
			{ contaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Contas;
	}
]);