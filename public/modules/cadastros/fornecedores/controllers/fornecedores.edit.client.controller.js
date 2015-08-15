'use strict';

// Fornecedores controller
angular.module('fornecedores.edit', [])
	.controller('FornecedoresEditController', FornecedoresEditController);


function FornecedoresEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Fornecedores,
	AComanda) {

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.urlBase = '/#!/cadastros/fornecedores';

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.authentication = Authentication;

	$scope.save = function() {
		var fornecedor = $scope.fornecedor;

		fornecedor.$update(function(response) {
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
		$scope.fornecedor = Fornecedores.get({ 
			fornecedorId: $stateParams.fornecedorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}