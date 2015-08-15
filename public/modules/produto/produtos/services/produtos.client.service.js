'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('produtos').factory('Produtos', ['$resource',
	function($resource) {

		var Produtos = $resource('api/produtos/:produtoId', 
			{ produtoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Produtos;
	}
]);