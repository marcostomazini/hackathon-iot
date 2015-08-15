'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('formas-pagamento').factory('FormasPagamento', ['$resource',
	function($resource) {

		var FormasPagamento = $resource('api/formas-pagamento/:formaPagamentoId', 
			{ formaPagamentoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return FormasPagamento;
	}
]);