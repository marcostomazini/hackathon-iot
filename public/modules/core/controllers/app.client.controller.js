/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

angular.module('core').controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', 
  '$timeout', '$location','toggleStateService', 'colors', 'browser', 'cfpLoadingBar', 
  'Authentication', 'Empresas', 
  function($rootScope, $scope, $state, $translate, $window, $localStorage, 
    $timeout, $location, toggle, colors, browser, cfpLoadingBar, Authentication, Empresas) {
    "use strict";

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

angular.module('core').controller('FlotChartController', ['$scope', 'ChartData', '$timeout', function($scope, ChartData, $timeout) {
  'use strict';
  
  // BAR
  // ----------------------------------- 
  $scope.barData = ChartData.load('server/chart/bar.json');
  $scope.barOptions = {
      series: {
          bars: {
              align: 'center',
              lineWidth: 0,
              show: true,
              barWidth: 0.6,
              fill: 0.9
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickColor: '#eee'
      },
      shadowSize: 0
  };

  // BAR STACKED
  // ----------------------------------- 
  $scope.barStackeData = ChartData.load('server/chart/barstacked.json');
  $scope.barStackedOptions = {
      series: {
          stack: true,
          bars: {
              align: 'center',
              lineWidth: 0,
              show: true,
              barWidth: 0.6,
              fill: 0.9
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          min: 0,
          max: 200, // optional: use it for a clear represetation
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickColor: '#eee'
      },
      shadowSize: 0
  };

  // SPLINE
  // ----------------------------------- 
  $scope.splineData = ChartData.load('server/chart/spline.json');
  $scope.splineOptions = {
      series: {
          lines: {
              show: false
          },
          points: {
              show: true,
              radius: 4
          },
          splines: {
              show: true,
              tension: 0.4,
              lineWidth: 1,
              fill: 0.5
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          min: 0,
          max: 150, // optional: use it for a clear represetation
          tickColor: '#eee',
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickFormatter: function (v) {
              return v/* + ' visitors'*/;
          }
      },
      shadowSize: 0
  };

  // AREA
  // ----------------------------------- 
  $scope.areaData = ChartData.load('server/chart/area.json');
  $scope.areaOptions = {
      series: {
          lines: {
              show: true,
              fill: 0.8
          },
          points: {
              show: true,
              radius: 4
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#fcfcfc',
          mode: 'categories'
      },
      yaxis: {
          min: 0,
          tickColor: '#eee',
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickFormatter: function (v) {
              return v + ' visitors';
          }
      },
      shadowSize: 0
  };

  // LINE
  // ----------------------------------- 
  $scope.lineData = ChartData.load('server/chart/line.json');
  $scope.lineOptions = {
      series: {
          lines: {
              show: true,
              fill: 0.01
          },
          points: {
              show: true,
              radius: 4
          }
      },
      grid: {
          borderColor: '#eee',
          borderWidth: 1,
          hoverable: true,
          backgroundColor: '#fcfcfc'
      },
      tooltip: true,
      tooltipOpts: {
          content: function (label, x, y) { return x + ' : ' + y; }
      },
      xaxis: {
          tickColor: '#eee',
          mode: 'categories'
      },
      yaxis: {
          position: ($scope.app.layout.isRTL ? 'right' : 'left'),
          tickColor: '#eee'
      },
      shadowSize: 0
  };

  // PIE
  // ----------------------------------- 
  $scope.pieData = ChartData.load('server/chart/pie.json');
  $scope.pieOptions = {
      series: {
          pie: {
              show: true,
              innerRadius: 0,
              label: {
                  show: true,
                  radius: 0.8,
                  formatter: function (label, series) {
                      return '<div class="flot-pie-label">' +
                      //label + ' : ' +
                      Math.round(series.percent) +
                      '%</div>';
                  },
                  background: {
                      opacity: 0.8,
                      color: '#222'
                  }
              }
          }
      }
  };

  // DONUT
  // ----------------------------------- 
  $scope.donutData = ChartData.load('server/chart/donut.json');
  $scope.donutOptions = {
      series: {
          pie: {
              show: true,
              innerRadius: 0.5 // This makes the donut shape
          }
      }
  };


  // REALTIME
  // ----------------------------------- 
  $scope.realTimeOptions = {
      series: {
        lines: { show: true, fill: true, fillColor:  { colors: ['#a0e0f3', '#23b7e5'] } },
        shadowSize: 0 // Drawing is faster without shadows
      },
      grid: {
          show:false,
          borderWidth: 0,
          minBorderMargin: 20,
          labelMargin: 10
      },
      xaxis: {
        tickFormatter: function() {
            return "";
        }
      },
      yaxis: {
          min: 0,
          max: 110
      },
      legend: {
          show: true
      },
      colors: ["#23b7e5"]
  };

  // Generate random data for realtime demo
  var data = [], totalPoints = 300;
    
  update();

  function getRandomData() {
    if (data.length > 0)
      data = data.slice(1);
    // Do a random walk
    while (data.length < totalPoints) {
      var prev = data.length > 0 ? data[data.length - 1] : 50,
        y = prev + Math.random() * 10 - 5;
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100;
      }
      data.push(y);
    }
    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]]);
    }
    return [res];
  }
  function update() {
    $scope.realTimeData = getRandomData();
    $timeout(update, 30);
  }
  // end random data generation


  // PANEL REFRESH EVENTS
  // ----------------------------------- 

  $scope.$on('panel-refresh', function(event, id) {
    
    console.log('Simulating chart refresh during 3s on #'+id);

    // Instead of timeout you can request a chart data
    $timeout(function(){
      
      // directive listen for to remove the spinner 
      // after we end up to perform own operations
      $scope.$broadcast('removeSpinner', id);
      
      console.log('Refreshed #' + id);

    }, 3000);

  });


  // PANEL DISMISS EVENTS
  // ----------------------------------- 

  // Before remove panel
  $scope.$on('panel-remove', function(event, id, deferred){
    
    console.log('Panel #' + id + ' removing');
    
    // Here is obligatory to call the resolve() if we pretend to remove the panel finally
    // Not calling resolve() will NOT remove the panel
    // It's up to your app to decide if panel should be removed or not
    deferred.resolve();
  
  });

  // Panel removed ( only if above was resolved() )
  $scope.$on('panel-removed', function(event, id){

    console.log('Panel #' + id + ' removed');

  });
  
}]).service('ChartData', ["$resource", function($resource){
  
  var opts = {
      get: { method: 'GET', isArray: true }
    };
  return {
    load: function(source){
      return $resource(source, {}, opts).get();
    }
  };
}]);