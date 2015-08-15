'use strict';

// Controller
angular.module('categorias.create', [])
		.controller('CategoriasCreateController', CategoriasCreateController);

'use strict';
function CategoriasCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Categorias,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/categorias';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var categoria = new Categorias($scope.categoria);

		if ($scope.authentication.user.empresa) {
			categoria.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		categoria.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}