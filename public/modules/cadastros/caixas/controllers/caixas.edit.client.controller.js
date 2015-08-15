'use strict';

// Empresas controller
angular.module('caixas.edit', [])
	.controller('CaixasEditController', CaixasEditController);


function CaixasEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Caixas,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/caixas';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var caixa = $scope.caixa;
		caixa.$update(function(response) {
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
		$scope.caixa = Caixas.get({ 
			caixaId: $stateParams.caixaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}