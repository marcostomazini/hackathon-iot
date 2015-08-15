'use strict';

// controller
angular.module('setores.edit', [])
	.controller('SetoresEditController', SetoresEditController);


function SetoresEditController($scope, 
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

	$scope.save = function() {
		var setor = $scope.setor;

		setor.$update(function(response) {
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
		$scope.setor = Setores.get({ 
			setorId: $stateParams.setorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}