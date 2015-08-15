'use strict';

// controller
angular.module('contas.edit', [])
	.controller('ContasEditController', ContasEditController);


function ContasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Contas,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/contas';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};

	$scope.save = function() {
		var conta = $scope.conta;

		conta.$update(function(response) {
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
		$scope.conta = Contas.get({ 
			contaId: $stateParams.contaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}