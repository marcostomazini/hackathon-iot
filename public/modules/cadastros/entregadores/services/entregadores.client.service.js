'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('entregadores').factory('Entregadores', ['$resource',
	function($resource) {
		return $resource('api/entregadores/:entregadorId', { entregadorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);