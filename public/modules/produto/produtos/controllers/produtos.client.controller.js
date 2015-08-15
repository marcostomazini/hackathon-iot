'use strict';

// controller
angular.module('produtos', [])
	.controller('ProdutosController', ProdutosController);

function ProdutosController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Produtos) {

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

	$scope.urlBase = '/#!/produto/produtos';

	$scope.$on('enterpriseChange', function() {
        $scope.produtos = Produtos.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.produtos = Produtos.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var produto = $scope.produtos[index];

						if (produto) {							
							produto.$remove( function (response) {
								if (response) {
									$scope.produtos = _.without($scope.produtos, produto);

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