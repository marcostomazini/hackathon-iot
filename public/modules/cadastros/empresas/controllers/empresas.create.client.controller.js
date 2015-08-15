'use strict';

// Empresas controller
angular.module('empresas.create', [])
	.controller('EmpresasCreateController', EmpresasCreateController);

'use strict';
function EmpresasCreateController($scope, 
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

  	$scope.empresa = {};

	$scope.urlBase = '/#!/cadastros/empresas';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var empresa = new Empresas ($scope.empresa);

		// Redirect after save
		empresa.$save(function(response) {
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