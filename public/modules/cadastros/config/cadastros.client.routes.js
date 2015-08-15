'use strict';

//Setting up route
angular.module('cadastros').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.cadastros', {
			url: '/cadastros',
			templateUrl: 'modules/cadastros/views/cadastros.client.view.html'
		}).

		state('app.createCaixa', {
			url: '/cadastros/caixas/create',
			templateUrl: 'modules/cadastros/caixas/views/create-caixa.client.view.html'
		}).
		state('app.editCaixa', {
			url: '/cadastros/caixas/:caixaId/edit',
			templateUrl: 'modules/cadastros/caixas/views/edit-caixa.client.view.html'
		}).

		state('app.createGarcom', {
			url: '/cadastros/garcoms/create',
			templateUrl: 'modules/cadastros/garcoms/views/create-garcom.client.view.html'
		}).
		state('app.editGarcom', {
			url: '/cadastros/garcoms/:garcomId/edit',
			templateUrl: 'modules/cadastros/garcoms/views/edit-garcom.client.view.html'
		}).

		state('app.createEntregador', {
			url: '/cadastros/entregadores/create',
			templateUrl: 'modules/cadastros/entregadores/views/create-entregador.client.view.html'
		}).
		state('app.editEntregador', {
			url: '/cadastros/entregadores/:entregadorId/edit',
			templateUrl: 'modules/cadastros/entregadores/views/edit-entregador.client.view.html'
		}).

		state('app.createEmpresa', {
			url: '/cadastros/empresas/create',
			templateUrl: 'modules/cadastros/empresas/views/create-empresa.client.view.html'
		}).
		state('app.editEmpresa', {
			url: '/cadastros/empresas/:empresaId/edit',
			templateUrl: 'modules/cadastros/empresas/views/edit-empresa.client.view.html'
		}).

		state('app.createFornecedor', {
			url: '/cadastros/fornecedores/create',
			templateUrl: 'modules/cadastros/fornecedores/views/create-fornecedor.client.view.html'
		}).
		state('app.editFornecedor', {
			url: '/cadastros/fornecedores/:fornecedorId/edit',
			templateUrl: 'modules/cadastros/fornecedores/views/edit-fornecedor.client.view.html'
		}).		

		state('app.createCliente', {
			url: '/cadastros/clientes/create',
			templateUrl: 'modules/cadastros/clientes/views/cliente.client.view.html'
		}).
		state('app.editCliente', {
			url: '/cadastros/clientes/:clienteId/edit',
			templateUrl: 'modules/cadastros/clientes/views/cliente.client.view.html'
		})

		;
	}
]);