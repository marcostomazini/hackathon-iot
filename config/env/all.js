'use strict';

module.exports = {
	app: {
		title: 'H2Okay',
		description: 'Sensorizacao de nascentes e controle de consumo de gastos',
		keywords: 'abastecimento, meio ambiente'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'ACOMANDA-KEY',
	sessionCollection: 'sessoes',
	assets: {
		lib: {
			css: [
				// 'public/lib/bootstrap/dist/css/bootstrap.css',
				// 'public/lib/bootstrap/dist/css/bootstrap-theme.css',
			],
			js: [
				'public/lib/jquery/dist/jquery.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/ngstorage/ngStorage.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-translate/angular-translate.js',
				'public/lib/angular-translate-loader-url/angular-translate-loader-url.js',
				'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
				'public/lib/angular-translate-storage-local/angular-translate-storage-local.js',
				'public/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
				'public/lib/oclazyload/dist/ocLazyLoad.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-loading-bar/build/loading-bar.js',
				'public/lib/noty/js/noty/packaged/jquery.noty.packaged.js',
				'public/lib/underscore/underscore.js',
				 //'public/lib/datatables/media/jquery.dataTables.js',
				 //'public/lib/angular-datatables/dist/angular-datatables.js'
				// 'public/lib/jquery/dist/jquery.js',
				// 'public/lib/angular/angular.js',
				// 'public/lib/angular-resource/angular-resource.js',
				// 'public/lib/angular-cookies/angular-cookies.js',
				// 'public/lib/angular-animate/angular-animate.js',
				// 'public/lib/angular-touch/angular-touch.js',
				// 'public/lib/angular-sanitize/angular-sanitize.js',
				// 'public/lib/angular-ui-router/release/angular-ui-router.js',
				// 'public/lib/angular-ui-utils/ui-utils.js',
				// 'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			// 'public/modules/**/css/*.css'
			'public/dist/application.min.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			
			// new subroute
			'public/modules/cadastros/*[!config]*/*.js',
			'public/modules/cadastros/*[!config]*/*[!tests]*/*.js',

			// new module
			'public/modules/financeiro/*[!config]*/*.js',
			'public/modules/financeiro/*[!config]*/*[!tests]*/*.js',

			// new module
			'public/modules/produto/*[!config]*/*.js',
			'public/modules/produto/*[!config]*/*[!tests]*/*.js',

			'public/modules/*/*.js',			
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};