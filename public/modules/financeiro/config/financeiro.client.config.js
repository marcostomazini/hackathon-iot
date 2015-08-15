'use strict';

// Configuring module
angular.module('financeiro').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Financeiro', 'financeiro', 'dropdown', '/financeiro(/.*)?', false, null, 20, 'icon-wallet');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Caixa (pdv)', 'financeiro/pontos-venda');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Cartão', 'financeiro/cartoes');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Conta', 'financeiro/contas');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Forma de Pagamento', 'financeiro/formas-pagamento');		
	}
]).controller('FinanceiroController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Cartoes',
			  	'Contas',
			  	'FormasPagamento',
			  	'PontosVenda',
	function($scope, $stateParams, $location, Authentication, Cartoes, Contas, FormasPagamento, PontosVenda) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			$scope.cadastros = [];

			Cartoes.query().$promise.then(function(data) {
				addPanel('Cartões', 'fa-credit-card', 'bg-gray', '#!/financeiro/cartoes', data.length, 0);
			});

			Contas.query().$promise.then(function(data) {
				addPanel('Contas', 'fa-money', 'bg-warning-light', '#!/financeiro/contas', data.length, 1);
			});

			FormasPagamento.query().$promise.then(function(data) {
				addPanel('Formas de Pagamento', 'fa-dollar', 'bg-info-light', '#!/financeiro/formas-pagamento', data.length, 2);
			});	

			PontosVenda.query().$promise.then(function(data) {
				addPanel('Pontos de Venda', 'fa-desktop', 'bg-purple-light', '#!/financeiro/pontos-venda', data.length, 3);
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