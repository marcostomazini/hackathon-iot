'use strict';

// Empresas controller
angular.module('empresas.edit', [])
	.controller('EmpresasEditController', EmpresasEditController);


function EmpresasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Empresas,
	AComanda) {

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.urlBase = '/#!/cadastros/empresas';

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.authentication = Authentication;

	$scope.save = function() {
		var empresa = $scope.empresa;
		if (empresa.telefone) { 
			empresa.telefone = empresa.telefone.toString().replace(/\D/g, '');
		}
		if (empresa.cnpj) { 
			empresa.cnpj = empresa.cnpj.toString().replace(/\D/g, '');
		}

		empresa.$update(function(response) {
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
		$scope.empresa = Empresas.get({ 
			empresaId: $stateParams.empresaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}