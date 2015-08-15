'use strict';

//Empresas service used to communicate Empresas REST endpoints
angular.module('empresas').factory('Empresas', ['$resource',
	function($resource) {

		var Empresas = $resource('api/empresas/:empresaId', { empresaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			ativos: {
				method: 'GET', 
				url: 'api/empresas/actives', 
				isArray: true
			}
		});
    	
    	return Empresas;
	}
]);