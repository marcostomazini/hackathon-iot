'use strict';

// Empresas controller
angular.module('garcoms', [])
	.controller('GarcomsController', GarcomsController);

function GarcomsController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Garcoms,
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

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.$on('enterpriseChange', function() {
        $scope.garcoms = Garcoms.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.garcoms = Garcoms.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var garcom = $scope.garcoms[index];

						if (garcom) {							
							garcom.$remove( function (response) {
								if (response) {
									$scope.garcoms = _.without($scope.garcoms, garcom);

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