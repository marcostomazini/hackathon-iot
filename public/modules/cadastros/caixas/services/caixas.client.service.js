'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('caixas').factory('Caixas', ['$resource',
	function($resource) {
		return $resource('api/caixas/:caixaId', { caixaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);