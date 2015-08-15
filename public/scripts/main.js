require.config({
    waitSeconds: 0,
    baseUrl: 'scripts/lib',
    paths :{
        'app' : '../app/app',
        'controllers' : '../app/controllers',
        'services' : '../app/services',
        'angular' :'angular/angular.min',
        'angular-animate': 'angular-animate/angular-animate',
        'angularRoute' : 'angular-route/angular-route.min',
        'angularLocalStorage' : 'angular-local-storage/dist/angular-local-storage.min',
        'angular-loading-bar': 'angular-loading-bar/src/loading-bar',
        'cryptojslib' : 'cryptojslib/rollups/pbkdf2',
        'jquery' : 'jquery/dist/jquery.min',
        'jquery-ui' : 'jquery-ui/jquery-ui.min',
        'noty': 'noty/js/noty/packaged/jquery.noty.packaged.min',
        'bootstrap' : 'bootstrap/dist/js/bootstrap.min',
        'bootstrap-fileinput' : 'bootstrap-fileinput/js/fileinput',
        'underscore': 'underscore/underscore-min',
        'colorbox': 'jquery-colorbox/jquery.colorbox-min'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute' :{
            deps: ['angular'],
            exports : 'angularRoute'
        },
        'angularLocalStorage' :{
            deps: ['angular'],
            exports : 'angularLocalStorage'
        },		
        'angular-animate':{
            deps:['angular'],
            exports : 'angular-animate'
        },        
        'angular-loading-bar':{
            deps:['angular'],
            exports : 'angular-loading-bar'
        },
        'cryptojslib' : {
            exports : 'cryptojslib'
        },
        'noty': ['jquery'],
        'colorbox': ['jquery'],        
        'bootstrap' : ['jquery'],
        'bootstrap-fileinput': {
            deps: ['bootstrap'],
            exports: 'bootstrap-fileinput'
        },
        'underscore': {
            exports: '_'
        },
    }
});

require(['require','angular','angularRoute','angularLocalStorage','angular-animate','angular-loading-bar',
    'cryptojslib','noty','colorbox','bootstrap','bootstrap-fileinput','underscore','app'], function () {
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

        angular.bootstrap(document, ['mainApp']);
    });
});