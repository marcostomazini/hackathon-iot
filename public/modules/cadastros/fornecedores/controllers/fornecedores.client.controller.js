'use strict';

// Fornecedores controller
angular.module('fornecedores', [])
	.controller('FornecedoresController', FornecedoresController);

function FornecedoresController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Fornecedores,
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

	$scope.urlBase = '/#!/cadastros/fornecedores';

	$scope.$on('enterpriseChange', function() {
        $scope.fornecedores = Fornecedores.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.fornecedores = Fornecedores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var fornecedor = $scope.fornecedores[index];

						if (fornecedor) {							
							fornecedor.$remove( function (response) {
								if (response) {
									$scope.fornecedores = _.without($scope.fornecedores, fornecedor);

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