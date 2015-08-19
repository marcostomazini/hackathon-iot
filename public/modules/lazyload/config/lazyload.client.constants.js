(function() {
    'use strict';

    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
          // jQuery based and standalone scripts
          scripts: {
            'modernizr':          ['/lib/modernizr/modernizr.js'],
            // 'icons':              ['/lib/fontawesome/css/font-awesome.min.css',
            //                        '/lib/simple-line-icons/css/simple-line-icons.css']
            'classyloader':       ['/vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
            'icons':              ['/vendor/skycons/skycons.js',
                                    '/lib/fontawesome/css/font-awesome.min.css',
                                    '/lib/simple-line-icons/css/simple-line-icons.css',
                                    '/vendor/weather-icons/css/weather-icons.min.css'],    
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

          },
          // Angular based script (use the right module name)
          modules: [
              {name: 'oitozero.ngSweetAlert',     files: ['vendor/sweetalert/dist/sweetalert.css',
                                                'vendor/sweetalert/dist/sweetalert.min.js',
                                                'vendor/angular-sweetalert/SweetAlert.js']},
            // {name: 'toaster', files: ['/lib/angularjs-toaster/toaster.js', '/lib/angularjs-toaster/toaster.css']}
          ]
        })
        ;

})();
