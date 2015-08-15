
'use strict';

//Setting up route
angular.module('produto').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.produto', {
			url: '/produto',
			templateUrl: 'modules/produto/views/produto.client.view.html'
		})

		.state('app.createUnidadeMedida', {
			url: '/produto/unidades-medida/create',
			templateUrl: 'modules/produto/unidades-medida/views/create-unidade-medida.client.view.html'
		})
		.state('app.editUnidadeMedida', {
			url: '/produto/unidades-medida/:unidadeMedidaId/edit',
			templateUrl: 'modules/produto/unidades-medida/views/edit-unidade-medida.client.view.html'
		})

		.state('app.createSetor', {
			url: '/produto/setores/create',
			templateUrl: 'modules/produto/setores/views/create-setor.client.view.html'
		})
		.state('app.editSetor', {
			url: '/produto/setores/:setorId/edit',
			templateUrl: 'modules/produto/setores/views/edit-setor.client.view.html'
		})

		.state('app.createCategoria', {
			url: '/produto/categorias/create',
			templateUrl: 'modules/produto/categorias/views/create-categoria.client.view.html'
		})
		.state('app.editCategoria', {
			url: '/produto/categorias/:categoriaId/edit',
			templateUrl: 'modules/produto/categorias/views/edit-categoria.client.view.html'
		})

		.state('app.createProduto', {
			url: '/produto/produtos/create',
			templateUrl: 'modules/produto/produtos/views/produto.client.view.html'
		})
		.state('app.editProduto', {
			url: '/produto/produtos/:produtoId/edit',
			templateUrl: 'modules/produto/produtos/views/produto.client.view.html'
		})

		;
	}
]);