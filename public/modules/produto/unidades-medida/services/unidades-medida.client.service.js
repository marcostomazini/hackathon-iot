'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('unidades-medida').factory('UnidadesMedida', ['$resource',
	function($resource) {

		var UnidadesMedida = $resource('api/unidades-medida/:unidadeMedidaId', 
			{ unidadeMedidaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return UnidadesMedida;
	}
]);