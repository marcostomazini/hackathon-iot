'use strict';

// controller
angular.module('categorias', [])
	.controller('CategoriasController', CategoriasController);

function CategoriasController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Categorias,
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

	$scope.urlBase = '/#!/produto/categorias';

	$scope.$on('enterpriseChange', function() {
        $scope.categorias = Categorias.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.categorias = Categorias.query();

	var deletarRegistro = function(index) {
		var categoria = $scope.categorias[index];

		if (categoria) {							
			categoria.$remove( function (response) {
				if (response) {
					$scope.categorias = _.without($scope.categorias, categoria);
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