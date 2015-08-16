/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
angular.module('core')
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('APP_REQUIRES', {
    // jQuery based and standalone scripts
    scripts: {
      'modernizr':          ['/lib/modernizr/modernizr.js'],
      'classyloader':       ['/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
      'icons':              ['/vendor/skycons/skycons.js',
                             '/vendor/fontawesome/css/font-awesome.min.css',
                             '/vendor/simple-line-icons/css/simple-line-icons.css',
                             '/vendor/weather-icons/css/weather-icons.min.css'],      
      'screenfull':         ['/lib/screenfull/dist/screenfull.js'],
      'locale':             ['/lib/angular-i18n/angular-locale_pt-br.js'],
      'sparklines':         ['/vendor/sparklines/jquery.sparkline.min.js'],
      'flot-chart':         ['/vendor/Flot/jquery.flot.js'],
      'flot-chart-plugins': ['/vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                             '/vendor/Flot/jquery.flot.resize.js',
                             '/vendor/Flot/jquery.flot.pie.js',
                             '/vendor/Flot/jquery.flot.time.js',
                             '/vendor/Flot/jquery.flot.categories.js',
                             '/vendor/flot-spline/js/jquery.flot.spline.min.js'],
      'chartjs':            ['/vendor/Chart.js/Chart.js'],
      'morris':             ['/vendor/raphael/raphael.js',
                             '/vendor/morris.js/morris.js',
                             '/vendor/morris.js/morris.css'],
      'loaders.css':        ['/vendor/loaders.css/loaders.css']
    },
    // Angular based script (use the right module name)
    modules: [
      { name: 'datatables', 
        files: [
          '/lib/datatables/media/js/jquery.dataTables.min.js',      
          '/lib/angular-datatables/dist/angular-datatables.min.js',
          '/lib/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.js',      
          '/vendor/datatable-bootstrap/css/dataTables.bootstrap.css'
        ] 
      },
      { name: 'ui.select',
        files: ['vendor/angular-ui-select/dist/select.js', 'vendor/angular-ui-select/dist/select.css']
      },
      { name: 'localytics.directives', 
        files: ['vendor/chosen_v1.2.0/chosen.jquery.min.js', 
          'vendor/chosen_v1.2.0/chosen.min.css', 
          'vendor/angular-chosen-localytics/chosen.js']
      },
      { name: 'ui.utils.masks',
        files: ['/lib/angular-input-masks/angular-input-masks-standalone.min.js']
      },
      { name: 'angular-momentjs',
        files: ['/lib/angular-momentjs-service/release/angular-momentjs-service.min.js']
      },
      // { name: 'noty', 
      //   files: ['/lib/noty/js/noty/packaged/jquery.noty.packaged.min.js'] 
      // }
      // { name: 'toaster', files: ['/lib/angularjs-toaster/toaster.js','/lib/angularjs-toaster/toaster.css'] }
    ]});