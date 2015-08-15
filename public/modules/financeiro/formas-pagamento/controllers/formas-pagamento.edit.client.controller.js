'use strict';

// controller
angular.module('formas-pagamento.edit', [])
	.controller('FormasPagamentoEditController', FormasPagamentoEditController);


function FormasPagamentoEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	FormasPagamento,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var formaPagamento = $scope.formaPagamento;

		formaPagamento.$update(function(response) {
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
		$scope.formaPagamento = FormasPagamento.get({ 
			formaPagamentoId: $stateParams.formaPagamentoId
		});
	};
	
	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}