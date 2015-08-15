'use strict';

// Empresas controller
angular.module('garcoms.create', [])
	.controller('GarcomsCreateController', GarcomsCreateController);

'use strict';
function GarcomsCreateController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Garcoms,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var model = new Garcoms ({
			user: $scope.garcom.user,
		});

		if ($scope.authentication.user.empresa) {
			model.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		model.$save(function(response) {
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