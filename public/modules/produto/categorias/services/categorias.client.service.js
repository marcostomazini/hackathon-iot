'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('categorias').factory('Categorias', ['$resource',
	function($resource) {

		var Categorias = $resource('api/categorias/:categoriaId', 
			{ categoriaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Categorias;
	}
]);