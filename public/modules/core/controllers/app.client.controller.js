/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

angular.module('core').controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', 
  '$timeout', '$location','toggleStateService', 'colors', 'browser', 'cfpLoadingBar', 
  'Authentication', 'Empresas', 'Sensores', 
  function($rootScope, $scope, $state, $translate, $window, $localStorage, 
    $timeout, $location, toggle, colors, browser, cfpLoadingBar, Authentication, Empresas, Sensores) {
    "use strict";

    // handles the callback from the received event
    var handleCallback = function (msg) {
        $scope.$apply(function () {
          //$scope.msg = JSON.parse(msg.data)
          $('#messages').append("<li>" + msg.data + "</li>") 


        // Create new cliente object
debugger
        var sensor = undefined;
          sensor = new Sensores({tipo: 'todos', valor: msg.data});
          // Redirect after save
           sensor.$save(function(response) {

           }, function(errorResponse) {

           });
          // C:0|U:1020|A:1021|G:0
        });
    }

    var source = new EventSource('/api/stream');
    source.addEventListener('message', handleCallback, false);

    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.authentication.empresas = Empresas.query();    

    // Loading bar transition
    // ----------------------------------- 
    var thBar;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(thBar);
          cfpLoadingBar.complete();
        });
    });


    // Hook not found
    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams) {
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
      function(event, toState, toParams, fromState, fromParams) {
        // display new view from top
        $window.scrollTo(0, 0);
        // Save the route title
        $rootScope.currTitle = $state.current.title;

        //         
        if (/create/.test($location.path())) {
          $rootScope.edit = false;
        }
        if (/edit/.test($location.path())) {
          $rootScope.edit = true;
        }
      });

    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function() {
      return $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
    };

    // empresas
    $rootScope.$watch('app.empresas', function(empresas) {
      $scope.authentication.empresas = $scope.empresas = empresas;
    });

    $rootScope.$on('changeEnterpriseDefault', function() {
      $timeout(function(){
        $rootScope.$broadcast('enterpriseChange');
      });
    });

    // iPad may presents ghost click issues
    // if( ! browser.ipad )
      // FastClick.attach(document.body);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
      if( newValue === false )
        $rootScope.$broadcast('closeSidebarMenu');
    });

    // Restore layout settings
    if( angular.isDefined($localStorage.layout) )
      $scope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $scope.app.layout;

    $rootScope.$watch("app.layout", function () {
      $localStorage.layout = $scope.app.layout;
    }, true);

    
    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}
    $scope.colorByName = colors.byName;

    // Internationalization
    // ----------------------

    $scope.language = {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'pt_br':    'Brazil',
        'en':       'English'        
      },
      // display always the current ui language
      init: function () {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
        $scope.language.selected = $scope.language.available[ (proposedLanguage || preferredLanguage) ];
      },
      set: function (localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        $scope.language.selected = $scope.language.available[localeId];
        // finally toggle dropdown
        $scope.language.listIsOpen = ! $scope.language.listIsOpen;
      }
    };

    $scope.language.init();

    // Restore application classes state
    toggle.restoreState( $(document.body) );

    // Applies animation to main view for the next pages to load
    $timeout(function(){
      $rootScope.mainViewAnimation = $rootScope.app.viewAnimation;
    });

    // cancel click event easily
    $rootScope.cancel = function($event) {
      $event.stopPropagation();
    };

    // Hides/show user avatar on sidebar
    $scope.toggleUserBlock = function(){
      $scope.$broadcast('toggleUserBlock');
    };

    // this configure noty and other js to start configuration
    angular.element(document).ready(function() {
        $.noty.defaults.theme = 'relax';
        $.noty.defaults.layout = 'topCenter';
        $.noty.defaults.timeout = 5000;
        $.noty.defaults.animation = {
            open: 'animated bounceInLeft', // Animate.css class names
            close: 'animated bounceOutRight', // Animate.css class names
            easing: 'swing', // unavailable - no need
            speed: 500 // unavailable - no need
        };
    });

}]);