'use strict';

// Controller
angular.module('pontos-venda.create', [])
		.controller('PontosVendaCreateController', PontosVendaCreateController);

'use strict';
function PontosVendaCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	PontosVenda,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var pontoVenda = new PontosVenda($scope.pontoVenda);

		if ($scope.authentication.user.empresa) {
			pontoVenda.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		pontoVenda.$save(function(response) {
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