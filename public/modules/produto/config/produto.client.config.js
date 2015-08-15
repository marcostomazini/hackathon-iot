'use strict';

// Configuring module
angular.module('produto').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Produto', 'produto', 'dropdown', '/produto(/.*)?', false, null, 20, 'icon-handbag');
		Menus.addSubMenuItem('sidebar', 'produto', 'Categoria', 'produto/categorias');
		Menus.addSubMenuItem('sidebar', 'produto', 'Setor', 'produto/setores');
		Menus.addSubMenuItem('sidebar', 'produto', 'Unidade de Medida', 'produto/unidades-medida');
		Menus.addSubMenuItem('sidebar', 'produto', 'Produto', 'produto/produtos');
	}
]).controller('ProdutoOpcoesController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Setores',
			  	'Categorias',
			  	'UnidadesMedida',
			  	'Produtos',
	function($scope, $stateParams, $location, Authentication, Setores, Categorias, UnidadesMedida, Produtos) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			var i = 0;

			$scope.cadastros = [];		

			Setores.query().$promise.then(function(data) {
				addPanel('Setores', 'fa-sitemap', 'bg-green', '#!/produto/setores', data.length, i++);
			});

			Categorias.query().$promise.then(function(data) {
				addPanel('Categorias', 'fa-list', 'bg-info-light', '#!/produto/categorias', data.length, i++);
			});	

			UnidadesMedida.query().$promise.then(function(data) {
				addPanel('Unidades de Medida', 'fa-eyedropper', 'bg-danger-light', '#!/produto/unidades-medida', data.length, i++);
			});

			Produtos.query().$promise.then(function(data) {
				addPanel('Produtos', 'fa-eyedropper', 'bg-warning', '#!/produto/produtos', data.length, i++);
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