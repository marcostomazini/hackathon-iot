'use strict';

// Cartoes controller
angular.module('cartoes', [])
	.controller('CartoesController', CartoesController);

function CartoesController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Cartoes) {

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

	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.$on('enterpriseChange', function() {
        $scope.cartoes = Cartoes.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.cartoes = Cartoes.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var cartao = $scope.cartoes[index];

						if (cartao) {							
							cartao.$remove( function (response) {
								if (response) {
									$scope.cartoes = _.without($scope.cartoes, cartao);

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