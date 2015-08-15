'use strict';

// Empresas controller
angular.module('entregadores', [])
	.controller('EntregadoresController', EntregadoresController);

function EntregadoresController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Entregadores,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

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

	$scope.urlBase = '/#!/cadastros/entregadores';

	$scope.$on('enterpriseChange', function() {
        $scope.entregadores = Entregadores.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.entregadores = Entregadores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var entregadores = $scope.entregadores[index];

						if (entregadores) {							
							entregadores.$remove( function (response) {
								if (response) {
									$scope.entregadores = _.without($scope.entregadores, entregador);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}