'use strict';

// Configuring the Articles module
angular.module('cadastros').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Cadastros', 'cadastros', 'dropdown', '/cadastros(/.*)?', false, null, 20, 'icon-user-follow');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Empresa', 'cadastros/empresas', null, false, ['admin']);
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Caixa', 'cadastros/caixas');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Garçom', 'cadastros/garcoms');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Entregador', 'cadastros/entregadores');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Fornecedor', 'cadastros/fornecedores');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Cliente', 'cadastros/clientes');
	}
]).controller('CadastrosController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Empresas',
			  	'Garcoms',
			  	'Entregadores',
			  	'Caixas',
			  	'Fornecedores',
			  	'Clientes',
	function($scope, $stateParams, $location, Authentication, Empresas, Garcoms, Entregadores, Caixas,
			Fornecedores, Clientes) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			$scope.cadastros = [];

			Empresas.query().$promise.then(function(data) {
				addPanel('Empresas', 'fa-desktop', 'bg-info', '#!/cadastros/empresas', data.length, 0);
			});

			Caixas.query().$promise.then(function(data) {
				addPanel('Caixas', 'fa-dollar', 'bg-danger-light', '#!/cadastros/caixas', data.length, 1);
			});

			Garcoms.query().$promise.then(function(data) {
				addPanel('Garçons', 'fa-user', 'bg-success', '#!/cadastros/garcoms', data.length, 2);
			});

			Entregadores.query().$promise.then(function(data) {
				addPanel('Entregadores', 'fa-send', 'bg-info', '#!/cadastros/entregadores', data.length, 3);
			});

			Fornecedores.query().$promise.then(function(data) {
				addPanel('Fornecedores', 'fa-building', 'bg-danger-light', '#!/cadastros/fornecedores', data.length, 4);
			});

			Clientes.query().$promise.then(function(data) {
				addPanel('Clientes', 'fa-group', 'bg-purple', '#!/cadastros/clientes', data.length, 5);
			});
		};

		function addPanel(name, icon, color, link, count, order) {
			$scope.cadastros.push({
				name: name,
				icon: icon,
				color: color,
				link: link,
				count: count,
				order: order
			});
		};
	}
]);