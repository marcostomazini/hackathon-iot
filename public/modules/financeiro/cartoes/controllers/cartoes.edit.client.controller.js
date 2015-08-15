'use strict';

// controller
angular.module('cartoes.edit', [])
	.controller('CartoesEditController', CartoesEditController);


function CartoesEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Cartoes,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.authentication = Authentication;

	$scope.save = function() {
		
		var cartao = $scope.cartao;

		cartao.$update(function(response) {
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
		$scope.cartao = Cartoes.get({ 
			cartaoId: $stateParams.cartaoId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}