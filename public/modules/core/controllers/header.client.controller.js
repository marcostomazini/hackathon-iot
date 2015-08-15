'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Users', 'Empresas',
	function($scope, Authentication, Menus, Users, Empresas) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Empresas do usuario
		$scope.app.empresas =  Empresas.query();

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});		

		$scope.changeEnterpriseDefault = function(empresa) {
			if (!$scope.authentication.user.empresa || $scope.authentication.user.empresa.name !== empresa.name) {
				$scope.authentication.user.empresa = empresa._id;		
				var user = new Users($scope.authentication.user);
				user.$update(function(response) {
					Authentication.user = response;
					$scope.$emit('changeEnterpriseDefault');
				}, function(response) {
					$scope.error = response.data.message;
				});
			}
		};

		$scope.logout = function(idEmpresa) {
			noty({
				modal: true,
	        	text: 'Tem certeza que deseja sair do sistema?', 
	        	buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    window.location = '/auth/signout';
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }]
	    	}); 
		};		
	}
]);