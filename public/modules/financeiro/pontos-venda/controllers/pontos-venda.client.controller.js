'use strict';

// PontosVenda controller
angular.module('pontos-venda', [])
	.controller('PontosVendaController', PontosVendaController);

function PontosVendaController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	PontosVenda) {

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

	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.$on('enterpriseChange', function() {
        $scope.pontosVenda = PontosVenda.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.pontosVenda = PontosVenda.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var pontoVenda = $scope.pontosVenda[index];

						if (pontoVenda) {							
							pontoVenda.$remove( function (response) {
								if (response) {
									$scope.pontosVenda = _.without($scope.pontosVenda, pontoVenda);

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