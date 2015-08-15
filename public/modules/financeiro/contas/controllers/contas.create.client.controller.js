'use strict';

// Controller
angular.module('contas.create', [])
		.controller('ContasCreateController', ContasCreateController);

'use strict';
function ContasCreateController($scope, 
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
	
	// Create new
	$scope.save = function() {
		// Create new object
		var conta = new Contas($scope.conta);

		if ($scope.authentication.user.empresa) {
			conta.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		conta.$save(function(response) {
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