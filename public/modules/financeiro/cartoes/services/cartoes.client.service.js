'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('cartoes').factory('Cartoes', ['$resource',
	function($resource) {

		var Cartoes = $resource('api/cartoes/:cartaoId', 
			{ cartaoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Cartoes;
	}
]);