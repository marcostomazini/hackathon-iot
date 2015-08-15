'use strict';

// Controller
angular.module('setores.create', [])
		.controller('SetoresCreateController', SetoresCreateController);

'use strict';
function SetoresCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Setores,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/setores';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};
	
	// Create new
	$scope.save = function() {
		// Create new object
		var setor = new Setores($scope.setor);

		if ($scope.authentication.user.empresa) {
			setor.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		setor.$save(function(response) {
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