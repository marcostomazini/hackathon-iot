'use strict';

// Controller
angular.module('cartoes.create', [])
		.controller('CartoesCreateController', CartoesCreateController);

'use strict';
function CartoesCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Cartoes,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var cartao = new Cartoes($scope.cartao);

		if ($scope.authentication.user.empresa) {
			cartao.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		cartao.$save(function(response) {
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