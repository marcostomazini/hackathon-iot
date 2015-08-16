/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

angular.module('core').config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';
  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // default route
  $urlRouterProvider.otherwise('/home');
  //$urlRouterProvider.otherwise('/page/signin');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
      //url: '/',
      abstract: true,
      templateUrl: 'modules/core/views/core.client.view.html',
      resolve: helper.resolveFor('modernizr', 
          'icons', 
          'locale',
          'angular-momentjs', 
          'ui.utils.masks', 
          'screenfull', 
          'ui.select', 
          'localytics.directives')
    })

    .state('app.home', {
      url: '/home',
      templateUrl: 'modules/core/views/cliente.client.view.html',
      controller: 'ClienteController',
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })

    .state('app.comunidade', {
      url: '/comunidade',
      templateUrl: 'modules/core/views/comunidade.client.view.html',
      controller: 'ComunidadeController',
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })

    .state('app.prefeitura', {
      url: '/prefeitura',
      templateUrl: 'modules/core/views/prefeitura.client.view.html',
      controller: 'PrefeituraController',
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })

    .state('app.listEmpresas', {
      url: '/cadastros/empresas',
      templateUrl: 'modules/cadastros/empresas/views/list-empresas.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listGarcoms', {
      url: '/cadastros/garcoms',
      templateUrl: 'modules/cadastros/garcoms/views/list-garcoms.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listCaixas', {
      url: '/cadastros/caixas',
      templateUrl: 'modules/cadastros/caixas/views/list-caixas.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listEntregadores', {
      url: '/cadastros/entregadores',
      templateUrl: 'modules/cadastros/entregadores/views/list-entregadores.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listClientes', {
      url: '/cadastros/clientes',
      templateUrl: 'modules/cadastros/clientes/views/list-clientes.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listFornecedores', {
      url: '/cadastros/fornecedores',
      templateUrl: 'modules/cadastros/fornecedores/views/list-fornecedores.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listPontosVenda', {
      url: '/financeiro/pontos-venda',
      templateUrl: 'modules/financeiro/pontos-venda/views/list-pontos-venda.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listCartoes', {
      url: '/financeiro/cartoes',
      templateUrl: 'modules/financeiro/cartoes/views/list-cartoes.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listFormasPagamento', {
      url: '/financeiro/formas-pagamento',
      templateUrl: 'modules/financeiro/formas-pagamento/views/list-formas-pagamento.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listContas', {
      url: '/financeiro/contas',
      templateUrl: 'modules/financeiro/contas/views/list-contas.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listUnidadesMedida', {
      url: '/produto/unidades-medida',
      templateUrl: 'modules/produto/unidades-medida/views/list-unidades-medida.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listSetores', {
      url: '/produto/setores',
      templateUrl: 'modules/produto/setores/views/list-setores.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listCategorias', {
      url: '/produto/categorias',
      templateUrl: 'modules/produto/categorias/views/list-categorias.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    .state('app.listProdutos', {
      url: '/produto/produtos',
      templateUrl: 'modules/produto/produtos/views/list-produtos.client.view.html',
      resolve: helper.resolveFor('datatables')
    })

    // 
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // ----------------------------------- 
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;

}]);
