'use strict';

// controller
angular.module('setores', [])
	.controller('SetoresController', SetoresController);

function SetoresController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Setores) {

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

	$scope.urlBase = '/#!/produto/setores';

	$scope.$on('enterpriseChange', function() {
        $scope.setores = Setores.query();
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
	$scope.setores = Setores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var setor = $scope.setores[index];

						if (setor) {							
							setor.$remove( function (response) {
								if (response) {
									$scope.setores = _.without($scope.setores, setor);

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