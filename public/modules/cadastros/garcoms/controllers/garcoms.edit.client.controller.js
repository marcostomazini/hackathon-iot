'use strict';

// Empresas controller
angular.module('garcoms.edit', [])
	.controller('GarcomsEditController', GarcomsEditController);


function GarcomsEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Garcoms,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var garcom = $scope.garcom;
		garcom.$update(function(response) {
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
		$scope.garcom = Garcoms.get({ 
			garcomId: $stateParams.garcomId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}