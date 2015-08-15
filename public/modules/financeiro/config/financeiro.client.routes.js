'use strict';

//Setting up route
angular.module('financeiro').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.financeiro', {
			url: '/financeiro',
			templateUrl: 'modules/financeiro/views/financeiro.client.view.html'
		})

		.state('app.createPontoVenda', {
			url: '/financeiro/pontos-venda/create',
			templateUrl: 'modules/financeiro/pontos-venda/views/create-ponto-venda.client.view.html'
		})
		.state('app.editPontoVenda', {
			url: '/financeiro/pontos-venda/:pontoVendaId/edit',
			templateUrl: 'modules/financeiro/pontos-venda/views/edit-ponto-venda.client.view.html'
		})

		.state('app.createCartao', {
			url: '/financeiro/cartoes/create',
			templateUrl: 'modules/financeiro/cartoes/views/create-cartao.client.view.html'
		})
		.state('app.editCartao', {
			url: '/financeiro/cartoes/:cartaoId/edit',
			templateUrl: 'modules/financeiro/cartoes/views/edit-cartao.client.view.html'
		})

		.state('app.createFormaPagamento', {
			url: '/financeiro/formas-pagamento/create',
			templateUrl: 'modules/financeiro/formas-pagamento/views/create-forma-pagamento.client.view.html'
		})
		.state('app.editFormaPagamento', {
			url: '/financeiro/formas-pagamento/:formaPagamentoId/edit',
			templateUrl: 'modules/financeiro/formas-pagamento/views/edit-forma-pagamento.client.view.html'
		})

		.state('app.createConta', {
			url: '/financeiro/contas/create',
			templateUrl: 'modules/financeiro/contas/views/create-conta.client.view.html'
		})
		.state('app.editConta', {
			url: '/financeiro/contas/:contaId/edit',
			templateUrl: 'modules/financeiro/contas/views/edit-conta.client.view.html'
		})

		;
	}
]);