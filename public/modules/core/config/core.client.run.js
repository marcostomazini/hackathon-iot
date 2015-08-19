(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', '$stateParams',  '$window', '$templateCache', 'Colors', 'Sensores','$interval'];
    
    function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors,Sensores,$interval) {
      
      // H2okay
      $rootScope.caixa = [];
      var stopTime;
      $rootScope.fightTime = function() {
        // Don't start a new fight if we are already fighting
        if ( angular.isDefined(stopTime) ) return;

        stopTime = $interval(function () {
          $rootScope.stopFightTime();
          $rootScope.retornaDados();
        }, 10000); 
      };

      $rootScope.stopFightTime = function() {
        if (angular.isDefined(stopTime)) {
          $interval.cancel(stopTime);
          stopTime = undefined;
        }
      };

      $rootScope.retornaDados = function() {
        $.getJSON("/api/sensor/caixa", function (data) {        
          try {
            $rootScope.caixa = data;
             $.getJSON("/api/sensor/caixa-historico", function (data2) {                
                try {
                  $rootScope.historico = data2 

                  $.getJSON("/api/sensor/solo", function (data3) {
                      try {
                          //$scope.fightTime();

                          $rootScope.solo = data3
                      }
                      catch (ex) { }
                  });

                }
                catch (ex) { }
            });
          }
          catch (ex) { }
        });
      };
      $rootScope.retornaDados();

      // handles the callback from the received event
      var handleCallback = function (msg) {
          $rootScope.$apply(function () {
            //$scope.msg = JSON.parse(msg.data)
            $('#messages').append("<li>" + msg.data + "</li>") 
          // Create new cliente object
          var sensor = undefined;
            sensor = new Sensores({tipo: 'todos', valor: msg.data});
            // Redirect after save
             sensor.$save(function(response) {
                $rootScope.fightTime();
             }, function(errorResponse) {

             });
            // C:0|U:1020|A:1021|G:0
          });
      }

      var source = new EventSource('/api/stream');
      source.addEventListener('message', handleCallback, false);

      // end H2okay
      
      // Set reference to access them from any scope
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      $rootScope.$storage = $window.localStorage;

      // Uncomment this to disable template cache
      /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (typeof(toState) !== 'undefined'){
            $templateCache.remove(toState.templateUrl);
          }
      });*/

      // Allows to use branding color with interpolation
      // {{ colorByName('primary') }}
      $rootScope.colorByName = Colors.byName;

      // cancel click event easily
      $rootScope.cancel = function($event) {
        $event.stopPropagation();
      };

      // Hooks Example
      // ----------------------------------- 

      // Hook not found
      $rootScope.$on('$stateNotFound',
        function(event, unfoundState/*, fromState, fromParams*/) {
            console.log(unfoundState.to); // "lazy.state"
            console.log(unfoundState.toParams); // {a:1, b:2}
            console.log(unfoundState.options); // {inherit:false} + default options
        });
      // Hook error
      $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
          console.log(error);
        });
      // Hook success
      $rootScope.$on('$stateChangeSuccess',
        function(/*event, toState, toParams, fromState, fromParams*/) {
          // display new view from top
          $window.scrollTo(0, 0);
          // Save the route title
          $rootScope.currTitle = $state.current.title;
        });

      // Load a title dynamically
      $rootScope.currTitle = $state.current.title;
      $rootScope.pageTitle = function() {
        var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        document.title = title;
        return title;
      };      

    }

})();

