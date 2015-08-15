'use strict';

// controller
angular.module('unidades-medida', [])
	.controller('UnidadesMedidaController', UnidadesMedidaController);

function UnidadesMedidaController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	UnidadesMedida) {

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

	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.$on('enterpriseChange', function() {
        $scope.unidadesMedida = UnidadesMedida.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.unidadesMedida = UnidadesMedida.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var unidadeMedida = $scope.unidadesMedida[index];

						if (unidadeMedida) {							
							unidadeMedida.$remove( function (response) {
								if (response) {
									$scope.unidadesMedida = _.without($scope.unidadesMedida, unidadeMedida);

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