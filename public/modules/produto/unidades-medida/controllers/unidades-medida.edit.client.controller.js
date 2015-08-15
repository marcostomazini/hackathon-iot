'use strict';

// controller
angular.module('unidades-medida.edit', [])
	.controller('UnidadesMedidaEditController', UnidadesMedidaEditController);


function UnidadesMedidaEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	UnidadesMedida,
	AComanda) {

	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.authentication = Authentication;

	$scope.save = function() {
		
		var unidadeMedida = $scope.unidadeMedida;

		unidadeMedida.$update(function(response) {
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

	// Find existing item
	$scope.findOne = function() {
		$scope.unidadeMedida = UnidadesMedida.get({ 
			unidadeMedidaId: $stateParams.unidadeMedidaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}