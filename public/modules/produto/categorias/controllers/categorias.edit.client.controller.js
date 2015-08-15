'use strict';

// controller
angular.module('categorias.edit', [])
	.controller('CategoriasEditController', CategoriasEditController);

function CategoriasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Categorias,
	AComanda) {

	$scope.urlBase = '/#!/produto/categorias';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var categoria = $scope.categoria;

		categoria.$update(function(response) {
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
		$scope.categoria = Categorias.get({ 
			categoriaId: $stateParams.categoriaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}