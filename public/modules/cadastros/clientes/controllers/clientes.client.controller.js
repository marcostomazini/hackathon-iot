'use strict';

// Clientes controller
angular.module('clientes', [])
	.controller('ClientesController', ClientesController);

function ClientesController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Clientes,
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	AComanda) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/clientes';

	$scope.$on('enterpriseChange', function() {
        $scope.clientes = Clientes.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.clientes = Clientes.query();

	var deletarRegistro = function(index) {
		var cliente = $scope.clientes[index];

		if (cliente) {							
			cliente.$remove( function (response) {
				if (response) {
					$scope.clientes = _.without($scope.clientes, cliente);
					AComanda.showMessage(response);
				}
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}
	};

	$scope.deleteConfirm = function(index) {
		AComanda.deleteConfirm(null, deletarRegistro.bind(null, index));
	};
}