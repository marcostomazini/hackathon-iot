'use strict';

// Contas controller
angular.module('contas', [])
	.controller('ContasController', ContasController);

function ContasController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Contas) {

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

	$scope.urlBase = '/#!/financeiro/contas';

	$scope.$on('enterpriseChange', function() {
        $scope.contas = Contas.query();
    });

    $scope.verificaVencimento = function(item) { 
    	var dataAtual = $filter('date')(new Date(), 'yyyy-MM-dd');
    	var data = $filter('date')(item.vencimento, 'yyyy-MM-dd');

    	if (data == dataAtual && item.ativo) {
    		if (item.tipo == 'apagar') return 'danger';
    		if (item.tipo == 'areceber') return 'success';
    	}
    };

	// Context
	$scope.authentication = Authentication;
	$scope.contas = Contas.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var conta = $scope.contas[index];

						if (conta) {							
							conta.$remove( function (response) {
								if (response) {
									$scope.contas = _.without($scope.contas, conta);

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