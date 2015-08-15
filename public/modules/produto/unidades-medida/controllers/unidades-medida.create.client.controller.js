'use strict';

// Controller
angular.module('unidades-medida.create', [])
		.controller('UnidadesMedidaCreateController', UnidadesMedidaCreateController);

'use strict';
function UnidadesMedidaCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	UnidadesMedida,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var unidadeMedida = new UnidadesMedida($scope.unidadeMedida);

		if ($scope.authentication.user.empresa) {
			unidadeMedida.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		unidadeMedida.$save(function(response) {
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