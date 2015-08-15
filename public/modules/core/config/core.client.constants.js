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
      'icons':              ['/lib/fontawesome/css/font-awesome.min.css',
                             '/lib/simple-line-icons/css/simple-line-icons.css'],
      'screenfull':         ['/lib/screenfull/dist/screenfull.js'],
      'locale':             ['/lib/angular-i18n/angular-locale_pt-br.js']
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