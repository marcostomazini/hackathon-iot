(function() {
    'use strict';

    angular
        .module('app.core')
        .config(appRoutes)
        ;
    appRoutes.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider'];
    function appRoutes($stateProvider, $locationProvider, $urlRouterProvider, helper){

      // Set the following to true to enable the HTML5 Mode
      // You may have to set <base> tag in index and a routing configuration in your server
      $locationProvider.html5Mode(false);

      // default route
      $urlRouterProvider.otherwise('/cliente');

      // 
      // Application Routes
      // -----------------------------------   
      $stateProvider
        .state('app', {
          // url: '/',
          abstract: true,
          templateUrl: 'modules/core/views/core.client.view.html',
          resolve: helper.resolveFor('modernizr', 'icons')
        })
        .state('app.home', {
          url: '/home',
          templateUrl: 'modules/core/views/home.client.view.html'
        })

        .state('app.cliente', {
          url: '/cliente',
          templateUrl: 'modules/sensores/views/cliente.client.view.html',
          controller: 'ClienteController',
          resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader')
        })

        .state('app.comunidade', {
          url: '/comunidade',
          templateUrl: 'modules/sensores/views/comunidade.client.view.html',
          controller: 'ComunidadeController',
          resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader')
        })

        .state('app.prefeitura', {
          url: '/prefeitura',
          templateUrl: 'modules/sensores/views/prefeitura.client.view.html',
          controller: 'PrefeituraController',
          resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader','oitozero.ngSweetAlert')
        })

        .state('app.simulador', {
          url: '/simulador',
          templateUrl: 'modules/sensores/views/simulador.client.view.html',
          controller: 'SimuladorController'
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

    }
})();