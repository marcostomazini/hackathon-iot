'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('pontos-venda').factory('PontosVenda', ['$resource',
	function($resource) {

		var PontosVenda = $resource('api/pontos-venda/:pontoVendaId', 
			{ pontoVendaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return PontosVenda;
	}
]);