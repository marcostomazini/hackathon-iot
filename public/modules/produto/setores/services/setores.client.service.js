'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('setores').factory('Setores', ['$resource',
	function($resource) {

		var Setores = $resource('api/setores/:setorId', 
			{ setorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Setores;
	}
]);