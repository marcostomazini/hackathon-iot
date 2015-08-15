'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('garcoms').factory('Garcoms', ['$resource',
	function($resource) {
		return $resource('api/garcoms/:garcomId', { garcomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);