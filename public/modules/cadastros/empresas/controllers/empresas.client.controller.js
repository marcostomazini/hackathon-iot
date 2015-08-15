'use strict';

// Empresas controller
angular.module('empresas', [])
	.controller('EmpresasController', EmpresasController);

function EmpresasController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Users,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	var model = this;
	model.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	model.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/empresas';

	// Context
	$scope.authentication = Authentication;
	$scope.authentication.empresas = $scope.app.empresas = Empresas.query();

	// Find a list
	$scope.init = function() {
		var user = new Users($scope.authentication.user);
		user.salt = undefined;
		user.password= undefined;
		if (user.empresa) user.empresa = user.empresa._id;
		user.$update(function(response) {
			$scope.authentication.user = Authentication.user = response;
		}, function(response) {
			$scope.error = response.data.message;
		});
	};

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var empresa = $scope.app.empresas[index];

						if (empresa) {							
							empresa.$remove( function (response) {
								if (response) {
									$scope.init();
									$scope.authentication.empresas = $scope.app.empresas = _.without($scope.app.empresas, empresa);

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