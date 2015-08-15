'use strict';

// FormasPagamento controller
angular.module('formas-pagamento', [])
	.controller('FormasPagamentoController', FormasPagamentoController);

function FormasPagamentoController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	FormasPagamento) {

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

	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.$on('enterpriseChange', function() {
        $scope.formasPagamento = FormasPagamento.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.formasPagamento = FormasPagamento.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var formaPagamento = $scope.formasPagamento[index];

						if (formaPagamento) {							
							formaPagamento.$remove( function (response) {
								if (response) {
									$scope.formasPagamento = _.without($scope.formasPagamento, formaPagamento);

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