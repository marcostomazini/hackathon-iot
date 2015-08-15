'use strict';

// controller
angular.module('pontos-venda.edit', [])
	.controller('PontosVendaEditController', PontosVendaEditController);


function PontosVendaEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	PontosVenda,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var pontoVenda = $scope.pontoVenda;

		pontoVenda.$update(function(response) {
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
		$scope.pontoVenda = PontosVenda.get({ 
			pontoVendaId: $stateParams.pontoVendaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}