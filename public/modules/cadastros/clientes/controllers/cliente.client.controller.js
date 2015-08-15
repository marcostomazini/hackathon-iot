'use strict';

// Clientes controller
angular.module('cliente', [])
		.controller('ClienteController', ClienteController);

'use strict';
function ClienteController($scope, $rootScope,
	$stateParams, 
	$location, 
	$http,	
	Authentication, 
	Clientes,
	AComanda) {
	
	$scope.cliente = AComanda.carregaObjeto($location.path()) || Clientes.get({ clienteId: $stateParams.clienteId });

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.urlBase = '/#!/cadastros/clientes';

	$scope.authentication = Authentication;

	// Create new cliente
	$scope.save = function() {
		// Create new cliente object

		var cliente = undefined;
		if (!$scope.edit) {
			cliente = new Clientes($scope.cliente);
			if ($scope.authentication.user.empresa) {
				cliente.empresa = $scope.authentication.user.empresa._id;
			}

			// Redirect after save
			cliente.$save(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);				
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});

		} else if ($scope.edit) {
			cliente = $scope.cliente;

			cliente.$update(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);	
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}		
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}