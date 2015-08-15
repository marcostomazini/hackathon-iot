'use strict';

//Fornecedores service used to communicate fornecedores REST endpoints
angular.module('fornecedores').factory('Fornecedores', ['$resource',
	function($resource) {

		var Fornecedores = $resource('api/fornecedores/:fornecedorId', 
			{ fornecedorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Fornecedores;
	}
]);