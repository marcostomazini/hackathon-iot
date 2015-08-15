'use strict';

// Controller
angular.module('formas-pagamento.create', [])
		.controller('FormasPagamentoCreateController', FormasPagamentoCreateController);

'use strict';
function FormasPagamentoCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	FormasPagamento,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var formaPagamento = new FormasPagamento($scope.formaPagamento);

		if ($scope.authentication.user.empresa) {
			formaPagamento.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		formaPagamento.$save(function(response) {
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