'use strict';

// Fornecedores controller
angular.module('fornecedores.create', [])
	.controller('FornecedoresCreateController', FornecedoresCreateController);

'use strict';
function FornecedoresCreateController($scope, 
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

	$scope.authentication = Authentication;

	// Create new fornecedor
	$scope.save = function() {
		// Create new fornecedor object
		var fornecedor = new Fornecedores($scope.fornecedor);

		if ($scope.authentication.user.empresa) {
			fornecedor.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		fornecedor.$save(function(response) {
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