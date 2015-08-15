'use strict';

// Empresas controller
angular.module('entregadores.edit', [])
	.controller('EntregadoresEditController', EntregadoresEditController);


function EntregadoresEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Entregadores,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/entregadores';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var entregador = $scope.entregador;
		entregador.$update(function(response) {
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
		$scope.entregador = Entregadores.get({ 
			entregadorId: $stateParams.entregadorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}