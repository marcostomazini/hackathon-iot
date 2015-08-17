'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'acomandaApp';
	// var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];
	var applicationModuleVendorDependencies = ['ngRoute', 'ngAnimate', 'ngStorage','ngTouch', 'ngCookies', 'pascalprecht.translate', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'ui.utils'];
	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('caixas');
ApplicationConfiguration.registerModule('caixas.create');
ApplicationConfiguration.registerModule('caixas.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cliente'); // crud
ApplicationConfiguration.registerModule('clientes'); // list
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('empresas');
ApplicationConfiguration.registerModule('empresas.create');
ApplicationConfiguration.registerModule('empresas.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('entregadores');
ApplicationConfiguration.registerModule('entregadores.create');
ApplicationConfiguration.registerModule('entregadores.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('fornecedores');
ApplicationConfiguration.registerModule('fornecedores.create');
ApplicationConfiguration.registerModule('fornecedores.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('garcoms');
ApplicationConfiguration.registerModule('garcoms.create');
ApplicationConfiguration.registerModule('garcoms.edit');
'use strict';

// Empresas controller
angular.module('caixas', [])
	.controller('CaixasController', CaixasController);

function CaixasController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Caixas,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/caixas';

	$scope.$on('enterpriseChange', function() {
        $scope.caixas = Caixas.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.caixas = Caixas.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var caixa = $scope.caixas[index];

						if (caixa) {							
							caixa.$remove( function (response) {
								if (response) {
									$scope.caixas = _.without($scope.caixas, caixa);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Empresas controller
angular.module('caixas.create', [])
	.controller('CaixasCreateController', CaixasCreateController);

'use strict';
function CaixasCreateController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Caixas,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/caixas';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var model = new Caixas ({
			user: $scope.caixa.user,
		});

		if ($scope.authentication.user.empresa) {
			model.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		model.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// Empresas controller
angular.module('caixas.edit', [])
	.controller('CaixasEditController', CaixasEditController);


function CaixasEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Caixas,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/caixas';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var caixa = $scope.caixa;
		caixa.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.caixa = Caixas.get({ 
			caixaId: $stateParams.caixaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('caixas').factory('Caixas', ['$resource',
	function($resource) {
		return $resource('api/caixas/:caixaId', { caixaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Clientes controller
angular.module('cliente', [])
		.controller('ClienteController', ClienteController);

'use strict';
function ClienteController($scope, $rootScope,
	$stateParams, 
	$location, 
	$http,	
	Authentication, 
	Clientes,
	AComanda) {
	
	$scope.cliente = AComanda.carregaObjeto($location.path()) || Clientes.get({ clienteId: $stateParams.clienteId });

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.urlBase = '/#!/cadastros/clientes';

	$scope.authentication = Authentication;

	// Create new cliente
	$scope.save = function() {
		// Create new cliente object

		var cliente = undefined;
		if (!$scope.edit) {
			cliente = new Clientes($scope.cliente);
			if ($scope.authentication.user.empresa) {
				cliente.empresa = $scope.authentication.user.empresa._id;
			}

			// Redirect after save
			cliente.$save(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);				
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});

		} else if ($scope.edit) {
			cliente = $scope.cliente;

			cliente.$update(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);	
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}		
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// Clientes controller
angular.module('clientes', [])
	.controller('ClientesController', ClientesController);

function ClientesController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Clientes,
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	AComanda) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/clientes';

	$scope.$on('enterpriseChange', function() {
        $scope.clientes = Clientes.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.clientes = Clientes.query();

	var deletarRegistro = function(index) {
		var cliente = $scope.clientes[index];

		if (cliente) {							
			cliente.$remove( function (response) {
				if (response) {
					$scope.clientes = _.without($scope.clientes, cliente);
					AComanda.showMessage(response);
				}
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}
	};

	$scope.deleteConfirm = function(index) {
		AComanda.deleteConfirm(null, deletarRegistro.bind(null, index));
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('clientes').factory('Clientes', ['$resource',
	function($resource) {

		var Clientes = $resource('api/clientes/:clienteId', 
			{ clienteId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Clientes;
	}
]);
'use strict';

// Empresas controller
angular.module('empresas', [])
	.controller('EmpresasController', EmpresasController);

function EmpresasController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Users,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	var model = this;
	model.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	model.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/empresas';

	// Context
	$scope.authentication = Authentication;
	$scope.authentication.empresas = $scope.app.empresas = Empresas.query();

	// Find a list
	$scope.init = function() {
		var user = new Users($scope.authentication.user);
		user.salt = undefined;
		user.password= undefined;
		if (user.empresa) user.empresa = user.empresa._id;
		user.$update(function(response) {
			$scope.authentication.user = Authentication.user = response;
		}, function(response) {
			$scope.error = response.data.message;
		});
	};

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var empresa = $scope.app.empresas[index];

						if (empresa) {							
							empresa.$remove( function (response) {
								if (response) {
									$scope.init();
									$scope.authentication.empresas = $scope.app.empresas = _.without($scope.app.empresas, empresa);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Empresas controller
angular.module('empresas.create', [])
	.controller('EmpresasCreateController', EmpresasCreateController);

'use strict';
function EmpresasCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Empresas,
	AComanda) {
	
	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

  	$scope.empresa = {};

	$scope.urlBase = '/#!/cadastros/empresas';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var empresa = new Empresas ($scope.empresa);

		// Redirect after save
		empresa.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// Empresas controller
angular.module('empresas.edit', [])
	.controller('EmpresasEditController', EmpresasEditController);


function EmpresasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Empresas,
	AComanda) {

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.urlBase = '/#!/cadastros/empresas';

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.authentication = Authentication;

	$scope.save = function() {
		var empresa = $scope.empresa;
		if (empresa.telefone) { 
			empresa.telefone = empresa.telefone.toString().replace(/\D/g, '');
		}
		if (empresa.cnpj) { 
			empresa.cnpj = empresa.cnpj.toString().replace(/\D/g, '');
		}

		empresa.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.empresa = Empresas.get({ 
			empresaId: $stateParams.empresaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

//Empresas service used to communicate Empresas REST endpoints
angular.module('empresas').factory('Empresas', ['$resource',
	function($resource) {

		var Empresas = $resource('api/empresas/:empresaId', { empresaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			ativos: {
				method: 'GET', 
				url: 'api/empresas/actives', 
				isArray: true
			}
		});
    	
    	return Empresas;
	}
]);
'use strict';

// Empresas controller
angular.module('entregadores', [])
	.controller('EntregadoresController', EntregadoresController);

function EntregadoresController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Entregadores,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/entregadores';

	$scope.$on('enterpriseChange', function() {
        $scope.entregadores = Entregadores.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.entregadores = Entregadores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var entregadores = $scope.entregadores[index];

						if (entregadores) {							
							entregadores.$remove( function (response) {
								if (response) {
									$scope.entregadores = _.without($scope.entregadores, entregador);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Empresas controller
angular.module('entregadores.create', [])
	.controller('EntregadoresCreateController', EntregadoresCreateController);

'use strict';
function EntregadoresCreateController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Entregadores,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/entregadores';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var model = new Entregadores ({
			user: $scope.entregador.user,
		});

		if ($scope.authentication.user.empresa) {
			model.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		model.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// Empresas controller
angular.module('entregadores.edit', [])
	.controller('EntregadoresEditController', EntregadoresEditController);


function EntregadoresEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Entregadores,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/entregadores';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var entregador = $scope.entregador;
		entregador.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.entregador = Entregadores.get({ 
			entregadorId: $stateParams.entregadorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('entregadores').factory('Entregadores', ['$resource',
	function($resource) {
		return $resource('api/entregadores/:entregadorId', { entregadorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Fornecedores controller
angular.module('fornecedores', [])
	.controller('FornecedoresController', FornecedoresController);

function FornecedoresController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Fornecedores,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/fornecedores';

	$scope.$on('enterpriseChange', function() {
        $scope.fornecedores = Fornecedores.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.fornecedores = Fornecedores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var fornecedor = $scope.fornecedores[index];

						if (fornecedor) {							
							fornecedor.$remove( function (response) {
								if (response) {
									$scope.fornecedores = _.without($scope.fornecedores, fornecedor);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Fornecedores controller
angular.module('fornecedores.create', [])
	.controller('FornecedoresCreateController', FornecedoresCreateController);

'use strict';
function FornecedoresCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Fornecedores,
	AComanda) {
	
	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.urlBase = '/#!/cadastros/fornecedores';

	$scope.authentication = Authentication;

	// Create new fornecedor
	$scope.save = function() {
		// Create new fornecedor object
		var fornecedor = new Fornecedores($scope.fornecedor);

		if ($scope.authentication.user.empresa) {
			fornecedor.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		fornecedor.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// Fornecedores controller
angular.module('fornecedores.edit', [])
	.controller('FornecedoresEditController', FornecedoresEditController);


function FornecedoresEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Fornecedores,
	AComanda) {

	$scope.refreshAddresses = function(address) {
		AComanda.carregaEndereco(address).then(function(response) {	    
	    	$scope.addresses = response;
	    });
  	};

	$scope.urlBase = '/#!/cadastros/fornecedores';

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};	

	$scope.authentication = Authentication;

	$scope.save = function() {
		var fornecedor = $scope.fornecedor;

		fornecedor.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.fornecedor = Fornecedores.get({ 
			fornecedorId: $stateParams.fornecedorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

//Fornecedores service used to communicate fornecedores REST endpoints
angular.module('fornecedores').factory('Fornecedores', ['$resource',
	function($resource) {

		var Fornecedores = $resource('api/fornecedores/:fornecedorId', 
			{ fornecedorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Fornecedores;
	}
]);
'use strict';

// Empresas controller
angular.module('garcoms', [])
	.controller('GarcomsController', GarcomsController);

function GarcomsController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Empresas,
	Garcoms,
	DTOptionsBuilder, 
	DTColumnDefBuilder) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.$on('enterpriseChange', function() {
        $scope.garcoms = Garcoms.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.garcoms = Garcoms.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var garcom = $scope.garcoms[index];

						if (garcom) {							
							garcom.$remove( function (response) {
								if (response) {
									$scope.garcoms = _.without($scope.garcoms, garcom);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Empresas controller
angular.module('garcoms.create', [])
	.controller('GarcomsCreateController', GarcomsCreateController);

'use strict';
function GarcomsCreateController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Garcoms,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.authentication = Authentication;

	// Create new Empresa
	$scope.save = function() {
		// Create new Empresa object
		var model = new Garcoms ({
			user: $scope.garcom.user,
		});

		if ($scope.authentication.user.empresa) {
			model.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		model.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// Empresas controller
angular.module('garcoms.edit', [])
	.controller('GarcomsEditController', GarcomsEditController);


function GarcomsEditController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	Garcoms,
	AComanda) {

	$scope.urlBase = '/#!/cadastros/garcoms';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var garcom = $scope.garcom;
		garcom.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.garcom = Garcoms.get({ 
			garcomId: $stateParams.garcomId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

//Garcoms service used to communicate Garcoms REST endpoints
angular.module('garcoms').factory('Garcoms', ['$resource',
	function($resource) {
		return $resource('api/garcoms/:garcomId', { garcomId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cartoes');
ApplicationConfiguration.registerModule('cartoes.create');
ApplicationConfiguration.registerModule('cartoes.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('contas');
ApplicationConfiguration.registerModule('contas.create');
ApplicationConfiguration.registerModule('contas.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('formas-pagamento');
ApplicationConfiguration.registerModule('formas-pagamento.create');
ApplicationConfiguration.registerModule('formas-pagamento.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('pontos-venda');
ApplicationConfiguration.registerModule('pontos-venda.create');
ApplicationConfiguration.registerModule('pontos-venda.edit');
'use strict';

// Cartoes controller
angular.module('cartoes', [])
	.controller('CartoesController', CartoesController);

function CartoesController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Cartoes) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.$on('enterpriseChange', function() {
        $scope.cartoes = Cartoes.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.cartoes = Cartoes.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var cartao = $scope.cartoes[index];

						if (cartao) {							
							cartao.$remove( function (response) {
								if (response) {
									$scope.cartoes = _.without($scope.cartoes, cartao);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('cartoes.create', [])
		.controller('CartoesCreateController', CartoesCreateController);

'use strict';
function CartoesCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Cartoes,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var cartao = new Cartoes($scope.cartao);

		if ($scope.authentication.user.empresa) {
			cartao.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		cartao.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// controller
angular.module('cartoes.edit', [])
	.controller('CartoesEditController', CartoesEditController);


function CartoesEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Cartoes,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/cartoes';

	$scope.authentication = Authentication;

	$scope.save = function() {
		
		var cartao = $scope.cartao;

		cartao.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.cartao = Cartoes.get({ 
			cartaoId: $stateParams.cartaoId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('cartoes').factory('Cartoes', ['$resource',
	function($resource) {

		var Cartoes = $resource('api/cartoes/:cartaoId', 
			{ cartaoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Cartoes;
	}
]);
'use strict';

// Contas controller
angular.module('contas', [])
	.controller('ContasController', ContasController);

function ContasController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Contas) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/financeiro/contas';

	$scope.$on('enterpriseChange', function() {
        $scope.contas = Contas.query();
    });

    $scope.verificaVencimento = function(item) { 
    	var dataAtual = $filter('date')(new Date(), 'yyyy-MM-dd');
    	var data = $filter('date')(item.vencimento, 'yyyy-MM-dd');

    	if (data == dataAtual && item.ativo) {
    		if (item.tipo == 'apagar') return 'danger';
    		if (item.tipo == 'areceber') return 'success';
    	}
    };

	// Context
	$scope.authentication = Authentication;
	$scope.contas = Contas.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var conta = $scope.contas[index];

						if (conta) {							
							conta.$remove( function (response) {
								if (response) {
									$scope.contas = _.without($scope.contas, conta);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('contas.create', [])
		.controller('ContasCreateController', ContasCreateController);

'use strict';
function ContasCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Contas,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/contas';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};
	
	// Create new
	$scope.save = function() {
		// Create new object
		var conta = new Contas($scope.conta);

		if ($scope.authentication.user.empresa) {
			conta.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		conta.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// controller
angular.module('contas.edit', [])
	.controller('ContasEditController', ContasEditController);


function ContasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Contas,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/contas';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};

	$scope.save = function() {
		var conta = $scope.conta;

		conta.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.conta = Contas.get({ 
			contaId: $stateParams.contaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('contas').factory('Contas', ['$resource',
	function($resource) {

		var Contas = $resource('api/contas/:contaId', 
			{ contaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Contas;
	}
]);
'use strict';

// FormasPagamento controller
angular.module('formas-pagamento', [])
	.controller('FormasPagamentoController', FormasPagamentoController);

function FormasPagamentoController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	FormasPagamento) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.$on('enterpriseChange', function() {
        $scope.formasPagamento = FormasPagamento.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.formasPagamento = FormasPagamento.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var formaPagamento = $scope.formasPagamento[index];

						if (formaPagamento) {							
							formaPagamento.$remove( function (response) {
								if (response) {
									$scope.formasPagamento = _.without($scope.formasPagamento, formaPagamento);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('formas-pagamento.create', [])
		.controller('FormasPagamentoCreateController', FormasPagamentoCreateController);

'use strict';
function FormasPagamentoCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	FormasPagamento,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var formaPagamento = new FormasPagamento($scope.formaPagamento);

		if ($scope.authentication.user.empresa) {
			formaPagamento.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		formaPagamento.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// controller
angular.module('formas-pagamento.edit', [])
	.controller('FormasPagamentoEditController', FormasPagamentoEditController);


function FormasPagamentoEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	FormasPagamento,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/formas-pagamento';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var formaPagamento = $scope.formaPagamento;

		formaPagamento.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.formaPagamento = FormasPagamento.get({ 
			formaPagamentoId: $stateParams.formaPagamentoId
		});
	};
	
	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('formas-pagamento').factory('FormasPagamento', ['$resource',
	function($resource) {

		var FormasPagamento = $resource('api/formas-pagamento/:formaPagamentoId', 
			{ formaPagamentoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return FormasPagamento;
	}
]);
'use strict';

// PontosVenda controller
angular.module('pontos-venda', [])
	.controller('PontosVendaController', PontosVendaController);

function PontosVendaController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	PontosVenda) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.$on('enterpriseChange', function() {
        $scope.pontosVenda = PontosVenda.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.pontosVenda = PontosVenda.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var pontoVenda = $scope.pontosVenda[index];

						if (pontoVenda) {							
							pontoVenda.$remove( function (response) {
								if (response) {
									$scope.pontosVenda = _.without($scope.pontosVenda, pontoVenda);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('pontos-venda.create', [])
		.controller('PontosVendaCreateController', PontosVendaCreateController);

'use strict';
function PontosVendaCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	PontosVenda,
	AComanda) {
	
	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var pontoVenda = new PontosVenda($scope.pontoVenda);

		if ($scope.authentication.user.empresa) {
			pontoVenda.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		pontoVenda.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// controller
angular.module('pontos-venda.edit', [])
	.controller('PontosVendaEditController', PontosVendaEditController);


function PontosVendaEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	PontosVenda,
	AComanda) {

	$scope.urlBase = '/#!/financeiro/pontos-venda';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var pontoVenda = $scope.pontoVenda;

		pontoVenda.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.pontoVenda = PontosVenda.get({ 
			pontoVendaId: $stateParams.pontoVendaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('pontos-venda').factory('PontosVenda', ['$resource',
	function($resource) {

		var PontosVenda = $resource('api/pontos-venda/:pontoVendaId', 
			{ pontoVendaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return PontosVenda;
	}
]);
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('categorias');
ApplicationConfiguration.registerModule('categorias.create');
ApplicationConfiguration.registerModule('categorias.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('produtos');
ApplicationConfiguration.registerModule('produtos.crud');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('setores');
ApplicationConfiguration.registerModule('setores.create');
ApplicationConfiguration.registerModule('setores.edit');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('unidades-medida');
ApplicationConfiguration.registerModule('unidades-medida.create');
ApplicationConfiguration.registerModule('unidades-medida.edit');
'use strict';

// controller
angular.module('categorias', [])
	.controller('CategoriasController', CategoriasController);

function CategoriasController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Categorias,
	AComanda) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/produto/categorias';

	$scope.$on('enterpriseChange', function() {
        $scope.categorias = Categorias.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.categorias = Categorias.query();

	var deletarRegistro = function(index) {
		var categoria = $scope.categorias[index];

		if (categoria) {							
			categoria.$remove( function (response) {
				if (response) {
					$scope.categorias = _.without($scope.categorias, categoria);
					AComanda.showMessage(response);
				}
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}
	};

	$scope.deleteConfirm = function(index) {
		AComanda.deleteConfirm(null, deletarRegistro.bind(null, index));
	};
}
'use strict';

// Controller
angular.module('categorias.create', [])
		.controller('CategoriasCreateController', CategoriasCreateController);

'use strict';
function CategoriasCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Categorias,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/categorias';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var categoria = new Categorias($scope.categoria);

		if ($scope.authentication.user.empresa) {
			categoria.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		categoria.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// controller
angular.module('categorias.edit', [])
	.controller('CategoriasEditController', CategoriasEditController);

function CategoriasEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Categorias,
	AComanda) {

	$scope.urlBase = '/#!/produto/categorias';

	$scope.authentication = Authentication;

	$scope.save = function() {
		var categoria = $scope.categoria;

		categoria.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.categoria = Categorias.get({ 
			categoriaId: $stateParams.categoriaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('categorias').factory('Categorias', ['$resource',
	function($resource) {

		var Categorias = $resource('api/categorias/:categoriaId', 
			{ categoriaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Categorias;
	}
]);
'use strict';

// controller
angular.module('produtos.crud', [])
	.controller('ProdutoController', ProdutoController);

function ProdutoController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Produtos,
	AComanda) {
	$scope.urlBase = '/#!/produto/produtos';

	$scope.authentication = Authentication;

	AComanda.pesquisar('/api/pesquisa/complementos').then(function(response) {
		$scope.complementos = response;
		$scope.produto = AComanda.carregaObjeto($location.path()) || Produtos.get({ produtoId: $stateParams.produtoId });
	});

	$scope.categoria = function(pesquisa) {
		AComanda.addPesquisa(pesquisa)
		.pesquisar('/api/pesquisa/categorias').then(function(response) {	    
			$scope.categorias = response;
		});
  	};

  	$scope.unidade = function(pesquisa) {  		
  		AComanda.addPesquisa(pesquisa)
		.pesquisar('/api/pesquisa/unidades-medida').then(function(response) {	    
			$scope.unidades = response;
		});
  	};

  	$scope.setor = function(pesquisa) {
		AComanda.addPesquisa(pesquisa)
		.pesquisar('/api/pesquisa/setores').then(function(response) {	    
			$scope.setores = response;
		});
  	};  	

	$scope.save = function() {

		var produto = undefined;

		if (!$scope.edit) {

			produto = new Produtos($scope.produto);
			if ($scope.authentication.user.empresa) {
				produto.empresa = $scope.authentication.user.empresa._id;
			}

			// Redirect after save
			produto.$save(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);	
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});

		} else if ($scope.edit) {
			produto = $scope.produto;

			produto.$update(function(response) {
				window.location = ($scope.urlBase);
				AComanda.showMessage(response);	
			}, function(errorResponse) {
				AComanda.showMessage(errorResponse.data);
			});
		}		
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// controller
angular.module('produtos', [])
	.controller('ProdutosController', ProdutosController);

function ProdutosController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Produtos) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/produto/produtos';

	$scope.$on('enterpriseChange', function() {
        $scope.produtos = Produtos.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.produtos = Produtos.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var produto = $scope.produtos[index];

						if (produto) {							
							produto.$remove( function (response) {
								if (response) {
									$scope.produtos = _.without($scope.produtos, produto);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('produtos').factory('Produtos', ['$resource',
	function($resource) {

		var Produtos = $resource('api/produtos/:produtoId', 
			{ produtoId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Produtos;
	}
]);
'use strict';

// controller
angular.module('setores', [])
	.controller('SetoresController', SetoresController);

function SetoresController($scope, 
	$stateParams, 
	$location,
	$filter,
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	Setores) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/produto/setores';

	$scope.$on('enterpriseChange', function() {
        $scope.setores = Setores.query();
    });

    $scope.verificaVencimento = function(item) { 
    	var dataAtual = $filter('date')(new Date(), 'yyyy-MM-dd');
    	var data = $filter('date')(item.vencimento, 'yyyy-MM-dd');

    	if (data == dataAtual && item.ativo) {
    		if (item.tipo == 'apagar') return 'danger';
    		if (item.tipo == 'areceber') return 'success';
    	}
    };

	// Context
	$scope.authentication = Authentication;
	$scope.setores = Setores.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var setor = $scope.setores[index];

						if (setor) {							
							setor.$remove( function (response) {
								if (response) {
									$scope.setores = _.without($scope.setores, setor);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('setores.create', [])
		.controller('SetoresCreateController', SetoresCreateController);

'use strict';
function SetoresCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Setores,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/setores';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};
	
	// Create new
	$scope.save = function() {
		// Create new object
		var setor = new Setores($scope.setor);

		if ($scope.authentication.user.empresa) {
			setor.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		setor.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// controller
angular.module('setores.edit', [])
	.controller('SetoresEditController', SetoresEditController);


function SetoresEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	Setores,
	AComanda) {

	$scope.urlBase = '/#!/produto/setores';

	$scope.authentication = Authentication;

	$scope.open = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.opened = true;
	};

	$scope.save = function() {
		var setor = $scope.setor;

		setor.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.setor = Setores.get({ 
			setorId: $stateParams.setorId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('setores').factory('Setores', ['$resource',
	function($resource) {

		var Setores = $resource('api/setores/:setorId', 
			{ setorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Setores;
	}
]);
'use strict';

// controller
angular.module('unidades-medida', [])
	.controller('UnidadesMedidaController', UnidadesMedidaController);

function UnidadesMedidaController($scope, 
	$stateParams, 
	$location, 
	Authentication, 
	DTOptionsBuilder, 
	DTColumnDefBuilder,
	UnidadesMedida) {

	this.dtOptions = DTOptionsBuilder
		.newOptions()
	    .withPaginationType('full_numbers')
	    .withOption('bLengthChange', false)
	    .withOption('bInfo', false)
	    .withBootstrap();
	
	this.dtColumnDefs = [
		DTColumnDefBuilder
			.newColumnDef(0)
			.withOption('bSearchable', false)
			.notVisible()
			.notSortable(),
        DTColumnDefBuilder
        	.newColumnDef(1)
        	.notSortable()
	];	

	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.$on('enterpriseChange', function() {
        $scope.unidadesMedida = UnidadesMedida.query();
    });

	// Context
	$scope.authentication = Authentication;
	$scope.unidadesMedida = UnidadesMedida.query();

	$scope.deleteConfirm = function(index) {
		noty({
			modal: true,
	        text: 'Tem certeza que deseja deletar o registro?', 
	        buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    var unidadeMedida = $scope.unidadesMedida[index];

						if (unidadeMedida) {							
							unidadeMedida.$remove( function (response) {
								if (response) {
									$scope.unidadesMedida = _.without($scope.unidadesMedida, unidadeMedida);

									noty({
									    text: response.message,
									    type: response.type
									});
								}
							}, function(errorResponse) {
								$scope.error = errorResponse.data.message;
								noty({
								    text: errorResponse.data.message,
								    type: errorResponse.data.type
								});
							});
						}
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }
	        ]
	    }); 
	};
}
'use strict';

// Controller
angular.module('unidades-medida.create', [])
		.controller('UnidadesMedidaCreateController', UnidadesMedidaCreateController);

'use strict';
function UnidadesMedidaCreateController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	UnidadesMedida,
	AComanda) {
	
	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.authentication = Authentication;

	// Create new
	$scope.save = function() {
		// Create new object
		var unidadeMedida = new UnidadesMedida($scope.unidadeMedida);

		if ($scope.authentication.user.empresa) {
			unidadeMedida.empresa = $scope.authentication.user.empresa._id;
		}

		// Redirect after save
		unidadeMedida.$save(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};	
}
'use strict';

// controller
angular.module('unidades-medida.edit', [])
	.controller('UnidadesMedidaEditController', UnidadesMedidaEditController);


function UnidadesMedidaEditController($scope, 
	$stateParams, 
	$location, 
	$http,
	Authentication, 
	UnidadesMedida,
	AComanda) {

	$scope.urlBase = '/#!/produto/unidades-medida';

	$scope.authentication = Authentication;

	$scope.save = function() {
		
		var unidadeMedida = $scope.unidadeMedida;

		unidadeMedida.$update(function(response) {
			window.location = ($scope.urlBase);
			noty({
			    text: response.message,
			    type: response.type
			});
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
			noty({
			    text: errorResponse.data.message,
			    type: errorResponse.data.type
			});
		});
	};

	// Find existing item
	$scope.findOne = function() {
		$scope.unidadeMedida = UnidadesMedida.get({ 
			unidadeMedidaId: $stateParams.unidadeMedidaId
		});
	};

	// Submit form
	$scope.submitForm = function() {		
		if (AComanda.validaForm($scope.formValidate)) {
		  $scope.save();
		}
	};
}
'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('unidades-medida').factory('UnidadesMedida', ['$resource',
	function($resource) {

		var UnidadesMedida = $resource('api/unidades-medida/:unidadeMedidaId', 
			{ unidadeMedidaId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return UnidadesMedida;
	}
]);
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('cadastros');
/*!
 * 
 * Angle - Bootstrap Admin App + AngularJS
 * 
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: http://support.wrapbootstrap.com/knowledge_base/topics/usage-licenses
 * 
 */
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');

angular.module('core').run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache', 'Authentication',
  function ($rootScope, $state, $stateParams, $window, $templateCache,Authentication) {

    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // Uncomment this to disables template cache
    /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });*/

    // Scope Globals
    // ----------------------------------- 
    $rootScope.app = {
      name: 'Afftasarden',
      description: 'Sensorizacao',
      year: ((new Date()).getFullYear()),
      layout: {
        isFixed: true,
        isCollapsed: false,
        isBoxed: false,
        isRTL: false,
        horizontal: false,
        isFloat: false,
        asideHover: false,
        theme: null
      },
      useFullLayout: false,
      hiddenFooter: false,
      viewAnimation: 'ng-fadeInUp',
      empresas: []
    };
  }
]);
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('financeiro');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('page');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('produto');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('sidebar', 'Articles', 'articles', 'dropdown', '/articles(/.*)?', false, null, 30);
		// Menus.addSubMenuItem('sidebar', 'articles', 'List Articles', 'articles/list');
		// Menus.addSubMenuItem('sidebar', 'articles', 'New Article', 'articles/create');
	}
]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('app.articles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('app.listArticles', {
			url: '/articles/list',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('app.createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('app.viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html',
			controller: 'ArticlesController'
		}).
		state('app.editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			debugger
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('cadastros').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Cadastros', 'cadastros', 'dropdown', '/cadastros(/.*)?', false, null, 20, 'icon-user-follow');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Empresa', 'cadastros/empresas', null, false, ['admin']);
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Caixa', 'cadastros/caixas');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Garçom', 'cadastros/garcoms');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Entregador', 'cadastros/entregadores');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Fornecedor', 'cadastros/fornecedores');
		Menus.addSubMenuItem('sidebar', 'cadastros', 'Cliente', 'cadastros/clientes');
	}
]).controller('CadastrosController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Empresas',
			  	'Garcoms',
			  	'Entregadores',
			  	'Caixas',
			  	'Fornecedores',
			  	'Clientes',
	function($scope, $stateParams, $location, Authentication, Empresas, Garcoms, Entregadores, Caixas,
			Fornecedores, Clientes) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			$scope.cadastros = [];

			Empresas.query().$promise.then(function(data) {
				addPanel('Empresas', 'fa-desktop', 'bg-info', '#!/cadastros/empresas', data.length, 0);
			});

			Caixas.query().$promise.then(function(data) {
				addPanel('Caixas', 'fa-dollar', 'bg-danger-light', '#!/cadastros/caixas', data.length, 1);
			});

			Garcoms.query().$promise.then(function(data) {
				addPanel('Garçons', 'fa-user', 'bg-success', '#!/cadastros/garcoms', data.length, 2);
			});

			Entregadores.query().$promise.then(function(data) {
				addPanel('Entregadores', 'fa-send', 'bg-info', '#!/cadastros/entregadores', data.length, 3);
			});

			Fornecedores.query().$promise.then(function(data) {
				addPanel('Fornecedores', 'fa-building', 'bg-danger-light', '#!/cadastros/fornecedores', data.length, 4);
			});

			Clientes.query().$promise.then(function(data) {
				addPanel('Clientes', 'fa-group', 'bg-purple', '#!/cadastros/clientes', data.length, 5);
			});
		};

		function addPanel(name, icon, color, link, count, order) {
			$scope.cadastros.push({
				name: name,
				icon: icon,
				color: color,
				link: link,
				count: count,
				order: order
			});
		};
	}
]);
'use strict';

//Setting up route
angular.module('cadastros').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.cadastros', {
			url: '/cadastros',
			templateUrl: 'modules/cadastros/views/cadastros.client.view.html'
		}).

		state('app.createCaixa', {
			url: '/cadastros/caixas/create',
			templateUrl: 'modules/cadastros/caixas/views/create-caixa.client.view.html'
		}).
		state('app.editCaixa', {
			url: '/cadastros/caixas/:caixaId/edit',
			templateUrl: 'modules/cadastros/caixas/views/edit-caixa.client.view.html'
		}).

		state('app.createGarcom', {
			url: '/cadastros/garcoms/create',
			templateUrl: 'modules/cadastros/garcoms/views/create-garcom.client.view.html'
		}).
		state('app.editGarcom', {
			url: '/cadastros/garcoms/:garcomId/edit',
			templateUrl: 'modules/cadastros/garcoms/views/edit-garcom.client.view.html'
		}).

		state('app.createEntregador', {
			url: '/cadastros/entregadores/create',
			templateUrl: 'modules/cadastros/entregadores/views/create-entregador.client.view.html'
		}).
		state('app.editEntregador', {
			url: '/cadastros/entregadores/:entregadorId/edit',
			templateUrl: 'modules/cadastros/entregadores/views/edit-entregador.client.view.html'
		}).

		state('app.createEmpresa', {
			url: '/cadastros/empresas/create',
			templateUrl: 'modules/cadastros/empresas/views/create-empresa.client.view.html'
		}).
		state('app.editEmpresa', {
			url: '/cadastros/empresas/:empresaId/edit',
			templateUrl: 'modules/cadastros/empresas/views/edit-empresa.client.view.html'
		}).

		state('app.createFornecedor', {
			url: '/cadastros/fornecedores/create',
			templateUrl: 'modules/cadastros/fornecedores/views/create-fornecedor.client.view.html'
		}).
		state('app.editFornecedor', {
			url: '/cadastros/fornecedores/:fornecedorId/edit',
			templateUrl: 'modules/cadastros/fornecedores/views/edit-fornecedor.client.view.html'
		}).		

		state('app.createCliente', {
			url: '/cadastros/clientes/create',
			templateUrl: 'modules/cadastros/clientes/views/cliente.client.view.html'
		}).
		state('app.editCliente', {
			url: '/cadastros/clientes/:clienteId/edit',
			templateUrl: 'modules/cadastros/clientes/views/cliente.client.view.html'
		})

		;
	}
]);
'use strict';

// Configuring the Core module
angular.module('core').run(['Menus',
  function(Menus) {
    // Add default menu entry
    Menus.addMenuItem('sidebar', 'Inicio', 'dash', null, '/dash', false, null, null, 'icon-home');
  }
]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });
  }
]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
    // registering components after bootstrap
    angular.module('core').controller = $controllerProvider.register;
    angular.module('core').directive  = $compileProvider.directive;
    angular.module('core').filter     = $filterProvider.register;
    angular.module('core').factory    = $provide.factory;
    angular.module('core').service    = $provide.service;
    angular.module('core').constant   = $provide.constant;
    angular.module('core').value      = $provide.value;

  }
]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix : 'modules/core/i18n/',
      suffix : '.json'
    });
    $translateProvider.preferredLanguage('pt_br');
    $translateProvider.useLocalStorage();
  }
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  }
]).config(['$tooltipProvider', function ($tooltipProvider) {
    $tooltipProvider.options({appendToBody: true});
  }
]);

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
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader')
    })

    .state('app.comunidade', {
      url: '/comunidade',
      templateUrl: 'modules/core/views/comunidade.client.view.html',
      controller: 'ComunidadeController',
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader')
    })

    .state('app.prefeitura', {
      url: '/prefeitura',
      templateUrl: 'modules/core/views/prefeitura.client.view.html',
      controller: 'PrefeituraController',
      resolve: helper.resolveFor('flot-chart','flot-chart-plugins', 'sparklines', 'classyloader')
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
angular.module('core').controller('ClienteController', ['$scope', 'ChartData', '$timeout', '$interval', function ($scope, ChartData, $timeout, $interval) {
    'use strict';

    $interval(function () { 
        $.getJSON("/api/sensor/caixa", function (data) {
            try {
                    var dado = data[0];
                    var litros = parseInt(dado.valor);
                    var pctg = Math.floor(litros / 2000 * 100);
                    if (pctg > 100) pctg = 100;
                    $('#water').text(litros.toString() + " litros");
                    if (Math.abs(data[0].valor - data[10].valor) > 20)
                        $('#water').toggleClass("animate").css({ height: pctg + "%" });                
            }
            catch (ex) { }
        });

        //$('#historicoConsumo').setData().setupGrid();
    }, 2000);

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
            borderWidth: 0,
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
                lineWidth: 3,
                show: true,
                barWidth: 1,
                fill: 0.9
            }
        },
        yaxis: {
            min: 0,
            max: 100
        },
        grid: {
            show: false,
            borderColor: 'red',
            borderWidth: 2,
            backgroundColor: '#fcfcfc'
        },
        shadowSize: 2
    };
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
        xaxis: {
            tickColor: '#fcfcfc',
            mode: 'categories',
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
        shadowSize: 10
    };
    // SPLINE
    // ----------------------------------- 
    $//scope.splineData = ChartData.load('server/chart/spline.json');
    $scope.historicoDataset = ChartData.load('api/sensor/caixa-historico');

    function updateHistorico() {

        $.getJSON("/api/sensor/caixa-historico", function (data) {
            try {
                    $scope.historicoDataset = data             
            }
            catch (ex) { }
        });
        //$scope.historicoDataset = ChartData.load('api/sensor/caixa-historico');
    }

    updateHistorico();
    $interval(updateHistorico, 2000);

    $scope.caixaDaguaHistoricoOptions = {
        legend: {
            position: 'nw'
        },
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
        xaxis: {
            tickColor: '#fcfcfc',
            mode: 'time',
            minTickSize: [2, "second"],
        },
        yaxis: {
            min: 0,
            alignTicksWithAxis: 1,
            tickColor: '#eee',
            position: ($scope.app.layout.isRTL ? 'right' : 'left')
        },
        shadowSize: 10
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
            mode: 'categories',
            alignTicksWithAxis: 10
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
            lines: { show: true, fill: true, fillColor: { colors: ['#a0e0f3', '#23b7e5'] } },
            shadowSize: 0 // Drawing is faster without shadows
        },
        grid: {
            show: false,
            borderWidth: 0,
            minBorderMargin: 20,
            labelMargin: 10
        },
        xaxis: {
            tickFormatter: function () {
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

    $scope.$on('panel-refresh', function (event, id) {

        console.log('Simulating chart refresh during 3s on #' + id);

        // Instead of timeout you can request a chart data
        $timeout(function () {

            // directive listen for to remove the spinner 
            // after we end up to perform own operations
            $scope.$broadcast('removeSpinner', id);

            console.log('Refreshed #' + id);

        }, 3000);

    });


    // PANEL DISMISS EVENTS
    // ----------------------------------- 

    // Before remove panel
    $scope.$on('panel-remove', function (event, id, deferred) {

        console.log('Panel #' + id + ' removing');

        // Here is obligatory to call the resolve() if we pretend to remove the panel finally
        // Not calling resolve() will NOT remove the panel
        // It's up to your app to decide if panel should be removed or not
        deferred.resolve();

    });

    // Panel removed ( only if above was resolved() )
    $scope.$on('panel-removed', function (event, id) {

        console.log('Panel #' + id + ' removed');

    });

}]).service('ChartData', ["$resource", function ($resource) {

    var opts = {
        get: { method: 'GET', isArray: true }
    };
    return {
        load: function (source) {
            return $resource(source, {}, opts).get();
        }
    };
}]);
angular.module('core').controller('ComunidadeController', ['$scope', 'ChartData', '$timeout', '$interval', function ($scope, ChartData, $timeout,$interval) {
  'use strict';
  
  $interval(function () {
      try {
          for (var i = 2; i <= 8; i++) {
              var v = parseInt($('.c' + i).text());
              v = Math.floor(v + Math.random() * 3);
              $('.c' + i).text(v);
          }
      }
      catch (ex) { }
  }, 400);

  $interval(function () {
      try {
          $.getJSON("/api/sensor/caixa", function (data) {
              var v = parseInt($(".c1").text());
              var d1 = parseInt(data[1].valor);
              var d0 = parseInt(data[0].valor);
              console.log(d1 + " - " + d0 + " = " + (d1 - d0));
              console.log(v);
              var gasto = d1 - d0;
              if (gasto > 0) {
                  $(".c1").text(v + gasto);
              }
          });
      }
      catch (ex) { }
  }, 2000);

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
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Users', 'Empresas',
	function($scope, Authentication, Menus, Users, Empresas) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Empresas do usuario
		$scope.app.empresas =  Empresas.query();

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});		

		$scope.changeEnterpriseDefault = function(empresa) {
			if (!$scope.authentication.user.empresa || $scope.authentication.user.empresa.name !== empresa.name) {
				$scope.authentication.user.empresa = empresa._id;		
				var user = new Users($scope.authentication.user);
				user.$update(function(response) {
					Authentication.user = response;
					$scope.$emit('changeEnterpriseDefault');
				}, function(response) {
					$scope.error = response.data.message;
				});
			}
		};

		$scope.logout = function(idEmpresa) {
			noty({
				modal: true,
	        	text: 'Tem certeza que deseja sair do sistema?', 
	        	buttons: [
	            { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
	                    $noty.close();
	                    window.location = '/auth/signout';
	                }
	            },
	            { 
	                addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
	                    $noty.close();
	                }
	            }]
	    	}); 
		};		
	}
]);
angular.module('core').controller('PrefeituraController', ['$scope', 'ChartData', '$timeout', '$interval', function($scope, ChartData, $timeout,$interval) {
  'use strict';
  
//   // handles the callback from the received event
//   var handleCallback = function (msg) {
//       $scope.$apply(function () {
//         //$scope.msg = JSON.parse(msg.data)
//         $('#messages').append("<li>" + msg.data + "</li>") 
//       });
//   }

// debugger
//   var source = new EventSource('/api/stream');
//   source.addEventListener('message', handleCallback, false);
var t = false
 $interval(function () { 
        $.getJSON("/api/sensor/solo", function (data) {
            try {
                  var dado = data[0];
                  if (parseInt(dado.valor) > 1000 && t == false) {                      
                    t = true;
                    noty({
                      text: 'Nascente com estado critico, pois o solo esta bastante seco',
                      type: 'error'
                    });
                  }

            }
            catch (ex) { }
        });

        //$('#historicoConsumo').setData().setupGrid();
    }, 4000);

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
'use strict';

angular.module('core').controller('SidebarController',
  ['$rootScope', '$scope', '$state', 'Authentication', 'Menus', 'Utils',
  function($rootScope, $scope, $state,  Authentication, Menus, Utils) {

    $scope.authentication = Authentication;
    $scope.menu = Menus.getMenu('sidebar');

    var collapseList = [];

    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
      if ( newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      if( !item.sref || item.sref == '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value, key) {
          if(isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else
        return $state.is(item.sref) || $state.includes(item.sref);
    };

    // Load menu from json file
    // ----------------------------------- 
    
    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
             (isActive(item) ? ' active' : '') ;
    };

    // Handle sidebar collapse items
    // ----------------------------------- 

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {
      // collapsed sidebar doesn't toggle drodopwn
      if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        collapseList[$index] = !collapseList[$index];
        closeAllBut($index);
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }
    
      return true;    
    };

    $scope.userBlockVisible = true;
    $scope.$on('toggleUserBlock', function(event, args) {
      $scope.userBlockVisible = ! $scope.userBlockVisible;      
    });

    $scope.openProfile = function() {
      window.location = ('/#!/settings/profile');      
    };    

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

  }
]);

/**=========================================================
 * Module: anchor.js
 * Disables null anchor behavior
 =========================================================*/

angular.module('core').directive('href', function() {

  return {
    restrict: 'A',
    compile: function(element, attr) {
        return function(scope, element) {
          if(attr.ngClick || attr.href === '' || attr.href === '#'){
            if( !element.hasClass('dropdown-toggle') )
              element.on('click', function(e){
                e.preventDefault();
                e.stopPropagation();
              });
          }
        };
      }
   };
});
/**=========================================================
 * Module: animate-enabled.js
 * Enable or disables ngAnimate for element with directive
 =========================================================*/

angular.module('core').directive("animateEnabled", ["$animate", function ($animate) {
  return {
    link: function (scope, element, attrs) {
      scope.$watch(function () {
        return scope.$eval(attrs.animateEnabled, scope);
      }, function (newValue) {
        $animate.enabled(!!newValue, element);
      });
    }
  };
}]);
/**=========================================================
 * Module: chart.js
 * Wrapper directive for chartJS. 
 * Based on https://gist.github.com/AndreasHeiberg/9837868
 =========================================================*/

var ChartJS = function (type) {
    return {
        restrict: "A",
        scope: {
            data: "=",
            options: "=",
            id: "@",
            width: "=",
            height: "=",
            resize: "=",
            chart: "@",
            segments: "@",
            responsive: "=",
            tooltip: "=",
            legend: "="
        },
        link: function ($scope, $elem) {
            var ctx = $elem[0].getContext("2d");
            var autosize = false;

            $scope.size = function () {
                if ($scope.width <= 0) {
                    $elem.width($elem.parent().width());
                    ctx.canvas.width = $elem.width();
                } else {
                    ctx.canvas.width = $scope.width || ctx.canvas.width;
                    autosize = true;
                }

                if($scope.height <= 0){
                    $elem.height($elem.parent().height());
                    ctx.canvas.height = ctx.canvas.width / 2;
                } else {
                    ctx.canvas.height = $scope.height || ctx.canvas.height;
                    autosize = true;
                }
            };

            $scope.$watch("data", function (newVal, oldVal) {
                if(chartCreated)
                    chartCreated.destroy();

                // if data not defined, exit
                if (!newVal) {
                    return;
                }
                if ($scope.chart) { type = $scope.chart; }

                if(autosize){
                    $scope.size();
                    chart = new Chart(ctx);
                }

                if($scope.responsive || $scope.resize)
                    $scope.options.responsive = true;

                if($scope.responsive !== undefined)
                    $scope.options.responsive = $scope.responsive;

                chartCreated = chart[type]($scope.data, $scope.options);
                chartCreated.update();
                if($scope.legend)
                    angular.element($elem[0]).parent().after( chartCreated.generateLegend() );
            }, true);

            $scope.$watch("tooltip", function (newVal, oldVal) {
                if (chartCreated)
                    chartCreated.draw();
                if(newVal===undefined || !chartCreated.segments)
                    return;
                if(!isFinite(newVal) || newVal >= chartCreated.segments.length || newVal < 0)
                    return;
                var activeSegment = chartCreated.segments[newVal];
                activeSegment.save();
                activeSegment.fillColor = activeSegment.highlightColor;
                chartCreated.showTooltip([activeSegment]);
                activeSegment.restore();
            }, true);

            $scope.size();
            var chart = new Chart(ctx);
            var chartCreated;
        }
    };
};

/* Aliases for various chart types */
angular.module('core').directive("chartjs",       function () { return ChartJS(); });
angular.module('core').directive("linechart",     function () { return ChartJS("Line"); });
angular.module('core').directive("barchart",      function () { return ChartJS("Bar"); });
angular.module('core').directive("radarchart",    function () { return ChartJS("Radar"); });
angular.module('core').directive("polarchart",    function () { return ChartJS("PolarArea"); });
angular.module('core').directive("piechart",      function () { return ChartJS("Pie"); });
angular.module('core').directive("doughnutchart", function () { return ChartJS("Doughnut"); });
angular.module('core').directive("donutchart",    function () { return ChartJS("Doughnut"); });

/**=========================================================
 * Module: classy-loader.js
 * Enable use of classyloader directly from data attributes
 =========================================================*/

angular.module('core').directive('classyloader', ["$timeout", "Utils", function($timeout, Utils) {
  'use strict';

  var $scroller       = $(window),
      inViewFlagClass = 'js-is-in-view'; // a classname to detect when a chart has been triggered after scroll

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      // run after interpolation  
      $timeout(function(){
  
        var $element = $(element),
            options  = $element.data();
        
        // At lease we need a data-percentage attribute
        if(options) {
          if( options.triggerInView ) {

            $scroller.scroll(function() {
              checkLoaderInVIew($element, options);
            });
            // if the element starts already in view
            checkLoaderInVIew($element, options);
          }
          else
            startLoader($element, options);
        }

      }, 0);

      function checkLoaderInVIew(element, options) {
        var offset = -20;
        if( ! element.hasClass(inViewFlagClass) &&
            Utils.isInView(element, {topoffset: offset}) ) {
          startLoader(element, options);
        }
      }
      function startLoader(element, options) {
        element.ClassyLoader(options).addClass(inViewFlagClass);
      }
    }
  };
}]);

/**=========================================================
 * Module: clear-storage.js
 * Removes a key from the browser storage via element click
 =========================================================*/

angular.module('core').directive('resetKey',  ['$state','$rootScope', function($state, $rootScope) {
  'use strict';

  return {
    restrict: 'A',
    scope: {
      resetKey: '='
    },
    link: function(scope, element, attrs) {
      
      scope.resetKey = attrs.resetKey;

    },
    controller: ["$scope", "$element", function($scope, $element) {
    
      $element.on('click', function (e) {
          e.preventDefault();

          if($scope.resetKey) {
            delete $rootScope.$storage[$scope.resetKey];
            $state.go($state.current, {}, {reload: true});
          }
          else {
            $.error('No storage key specified for reset.');
          }
      });

    }]

  };

}]);
/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

angular.module('core').directive('filestyle', function() {
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      var options = $element.data();
      
      // old usage support
        options.classInput = $element.data('classinput') || options.classInput;
      
      $element.filestyle(options);
    }]
  };
});

/**=========================================================
 * Module: flatdoc.js
 * Creates the flatdoc markup and initializes the plugin
 =========================================================*/

angular.module('core').directive('flatdoc', ['$location', function($location) {
  return {
    restrict: "EA",
    template: "<div role='flatdoc'><div role='flatdoc-menu'></div><div role='flatdoc-content'></div></div>",
    link: function(scope, element, attrs) {

      Flatdoc.run({
        fetcher: Flatdoc.file(attrs.src)
      });
      
      var $root = $('html, body');
      $(document).on('flatdoc:ready', function() {
        var docMenu = $('[role="flatdoc-menu"]');
        docMenu.find('a').on('click', function(e) {
          e.preventDefault(); e.stopPropagation();
          
          var $this = $(this);
          
          docMenu.find('a.active').removeClass('active');
          $this.addClass('active');

          $root.animate({
                scrollTop: $(this.getAttribute('href')).offset().top - ($('.topnavbar').height() + 10)
            }, 800);
        });

      });
    }
  };

}]);
/**=========================================================
 * Module: flot.js
 * Initializes the Flot chart plugin and handles data refresh
 =========================================================*/

angular.module('core').directive('flot', ['$http', '$timeout', function($http, $timeout) {
  'use strict';
  return {
    restrict: 'EA',
    template: '<div></div>',
    scope: {
      dataset: '=?',
      options: '=',
      series: '=',
      callback: '=',
      src: '='
    },
    link: linkFunction
  };
  
  function linkFunction(scope, element, attributes) {
    var height, plot, plotArea, width;
    var heightDefault = 220;

    plot = null;

    width = attributes.width || '100%';
    height = attributes.height || heightDefault;

    plotArea = $(element.children()[0]);
    plotArea.css({
      width: width,
      height: height
    });

    function init() {
      var plotObj;
      if(!scope.dataset || !scope.options) return;
      plotObj = $.plot(plotArea, scope.dataset, scope.options);
      scope.$emit('plotReady', plotObj);
      if (scope.callback) {
        scope.callback(plotObj, scope);
      }

      return plotObj;
    }

    function onDatasetChanged(dataset) {
      if (plot) {
        plot.setData(dataset);
        plot.setupGrid();
        return plot.draw();
      } else {
        plot = init();
        onSerieToggled(scope.series);
        return plot;
      }
    }
    scope.$watchCollection('dataset', onDatasetChanged, true);

    function onSerieToggled (series) {
      if( !plot || !series ) return;
      var someData = plot.getData();
      for(var sName in series) {
        angular.forEach(series[sName], toggleFor(sName));
      }
      
      plot.setData(someData);
      plot.draw();
      
      function toggleFor(sName) {
        return function (s, i){
          if(someData[i] && someData[i][sName])
            someData[i][sName].show = s;
        };
      }
    }
    scope.$watch('series', onSerieToggled, true);
    
    function onSrcChanged(src) {

      if( src ) {

        $http.get(src)
          .success(function (data) {

            $timeout(function(){
              scope.dataset = data;
            });

        }).error(function(){
          $.error('Flot chart: Bad request.');
        });
        
      }
    }
    scope.$watch('src', onSrcChanged);
  }

}]);

/**=========================================================
 * Module: form-wizard.js
 * Handles form wizard plugin and validation
 =========================================================*/

angular.module('core').directive('formWizard', ["$parse", function($parse){
  'use strict';

  return {
    restrict: 'A',
    scope: true,
    link: function(scope, element, attribute) {
      var validate = $parse(attribute.validateSteps)(scope),
          wiz = new Wizard(attribute.steps, !!validate, element);
      scope.wizard = wiz.init();

    }
  };

  function Wizard (quantity, validate, element) {
    
    var self = this;
    self.quantity = parseInt(quantity,10);
    self.validate = validate;
    self.element = element;
    
    self.init = function() {
      self.createsteps(self.quantity);
      self.go(1); // always start at fist step
      return self;
    };

    self.go = function(step) {
      
      if ( angular.isDefined(self.steps[step]) ) {

        if(self.validate && step !== 1) {
          var form = $(self.element),
              group = form.children().children('div').get(step - 2);

          if (false === form.parsley().validate( group.id )) {
            return false;
          }
        }

        self.cleanall();
        self.steps[step] = true;
      }
    };

    self.active = function(step) {
      return !!self.steps[step];
    };

    self.cleanall = function() {
      for(var i in self.steps){
        self.steps[i] = false;
      }
    };

    self.createsteps = function(q) {
      self.steps = [];
      for(var i = 1; i <= q; i++) self.steps[i] = false;
    };

  }

}]);

/**=========================================================
 * Module: fullscreen.js
 * Toggle the fullscreen mode on/off
 =========================================================*/

angular.module('core').directive('toggleFullscreen', function() {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      element.on('click', function (e) {
          e.preventDefault();

          if (screenfull.enabled) {
            
            screenfull.toggle();
            
            // Switch icon indicator
            if(screenfull.isFullscreen)
              $(this).children('em').removeClass('fa-expand').addClass('fa-compress');
            else
              $(this).children('em').removeClass('fa-compress').addClass('fa-expand');

          } else {
            $.error('Fullscreen not enabled');
          }

      });
    }
  };

});


/**=========================================================
 * Module: load-css.js
 * Request and load into the current page a css file
 =========================================================*/

angular.module('core').directive('loadCss', function() {
  'use strict';

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('click', function (e) {
          if(element.is('a')) e.preventDefault();
          var uri = attrs.loadCss,
              link;

          if(uri) {
            link = createLink(uri);
            if ( !link ) {
              $.error('Error creating stylesheet link element.');
            }
          }
          else {
            $.error('No stylesheet location defined.');
          }

      });

    }
  };

  function createLink(uri) {
    var linkId = 'autoloaded-stylesheet',
        oldLink = $('#'+linkId).attr('id', linkId + '-old');

    $('head').append($('<link/>').attr({
      'id':   linkId,
      'rel':  'stylesheet',
      'href': uri
    }));

    if( oldLink.length ) {
      oldLink.remove();
    }

    return $('#'+linkId);
  }


});
/**=========================================================
 * Module: masked,js
 * Initializes the masked inputs
 =========================================================*/

/* jshint -W026 */
angular.module('core').directive('masked', function() {
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      var $elem = $($element);
      if($.fn.inputmask)
        $elem.inputmask();
    }]
  };
});
/**=========================================================
 * Module: morris.js
 * AngularJS Directives for Morris Charts
 =========================================================*/

(function() {
    "use strict";

    angular.module('core').directive('morrisBar',   morrisChart('Bar')   );
    angular.module('core').directive('morrisDonut', morrisChart('Donut') );
    angular.module('core').directive('morrisLine',  morrisChart('Line')  );
    angular.module('core').directive('morrisArea',  morrisChart('Area')  );

    function morrisChart(type) {
      return function () {
        return {
          restrict: 'EA',
          scope: {
            morrisData: '=',
            morrisOptions: '='
          },
          link: function($scope, elem, attrs) {
            // start ready to watch for changes in data
            $scope.$watch("morrisData", function(newVal, oldVal) {
              if (newVal) {
                $scope.morrisInstance.setData(newVal);
                $scope.morrisInstance.redraw();
              }
            }, true);
            // the element that contains the chart
            $scope.morrisOptions.element = elem;
            // If data defined copy to options
            if($scope.morrisData)
              $scope.morrisOptions.data = $scope.morrisData;
            // Init chart
            $scope.morrisInstance = new Morris[type]($scope.morrisOptions);

          }
        }
      }
    }

})();

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

angular.module('core').directive('searchOpen', ['navSearch', function(navSearch) {
  'use strict';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.toggle);
    }]
  };

}]).directive('searchDismiss', ['navSearch', function(navSearch) {
  'use strict';

  var inputSelector = '.navbar-form input[type="text"]';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {

      $(inputSelector)
        .on('click', function (e) { e.stopPropagation(); })
        .on('keyup', function(e) {
          if (e.keyCode == 27) // ESC
            navSearch.dismiss();
        });
        
      // click anywhere closes the search
      $(document).on('click', navSearch.dismiss);
      // dismissable options
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.dismiss);
    }]
  };

}]);


/**=========================================================
 * Module: notify.js
 * Directive for notify plugin
 =========================================================*/

angular.module('core').directive('notify', ["$window", "Notify", function($window, Notify){

  return {
    restrict: 'A',
    scope: {
        options: '=',
        message: '='
    },
    link: function (scope, element, attrs) {
      
      element.on('click', function (e) {
        e.preventDefault();
        Notify.alert(scope.message, scope.options);
      });

    }
  };

}]);


/**=========================================================
 * Module: now.js
 * Provides a simple way to display the current time formatted
 =========================================================*/

angular.module('core').directive("now", ['dateFilter', '$interval', function(dateFilter, $interval){
    return {
      restrict: 'E',
      link: function(scope, element, attrs){
        
        var format = attrs.format;

        function updateTime() {
          var dt = dateFilter(new Date(), format);
          element.text(dt);
        }

        updateTime();
        $interval(updateTime, 1000);
      }
    };
}]);
/**=========================================================
 * Module panel-tools.js
 * Directive tools to control panels. 
 * Allows collapse, refresh and dismiss (remove)
 * Saves panel state in browser storage
 =========================================================*/

angular.module('core').directive('paneltool', ["$compile", "$timeout", function($compile, $timeout){
  var templates = {
    /* jshint multistr: true */
    collapse:"<a href='#' panel-collapse='' tooltip='Collapse Panel' ng-click='{{panelId}} = !{{panelId}}'> \
                <em ng-show='{{panelId}}' class='fa fa-plus'></em> \
                <em ng-show='!{{panelId}}' class='fa fa-minus'></em> \
              </a>",
    dismiss: "<a href='#' panel-dismiss='' tooltip='Close Panel'>\
               <em class='fa fa-times'></em>\
             </a>",
    refresh: "<a href='#' panel-refresh='' data-spinner='{{spinner}}' tooltip='Refresh Panel'>\
               <em class='fa fa-refresh'></em>\
             </a>"
  };

  function getTemplate( elem, attrs ){
    var temp = '';
    attrs = attrs || {};
    if(attrs.toolCollapse)
      temp += templates.collapse.replace(/{{panelId}}/g, (elem.parent().parent().attr('id')) );
    if(attrs.toolDismiss)
      temp += templates.dismiss;
    if(attrs.toolRefresh)
      temp += templates.refresh.replace(/{{spinner}}/g, attrs.toolRefresh);
    return temp;
  }
  
  return {
    restrict: 'E',
    scope: false,
    link: function (scope, element, attrs) {

      var tools = scope.panelTools || attrs;
  
      $timeout(function() {
        element.html(getTemplate(element, tools )).show();
        $compile(element.contents())(scope);
        
        element.addClass('pull-right');
      });

    }
  };
}])
/**=========================================================
 * Dismiss panels * [panel-dismiss]
 =========================================================*/
.directive('panelDismiss', ["$q", "Utils", function($q, Utils){
  'use strict';
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function ($scope, $element) {
      var removeEvent   = 'panel-remove',
          removedEvent  = 'panel-removed';

      $element.on('click', function () {

        // find the first parent panel
        var parent = $(this).closest('.panel');

        removeElement();

        function removeElement() {
          var deferred = $q.defer();
          var promise = deferred.promise;
          
          // Communicate event destroying panel
          $scope.$emit(removeEvent, parent.attr('id'), deferred);
          promise.then(destroyMiddleware);
        }

        // Run the animation before destroy the panel
        function destroyMiddleware() {
          if(Utils.support.animation) {
            parent.animo({animation: 'bounceOut'}, destroyPanel);
          }
          else destroyPanel();
        }

        function destroyPanel() {

          var col = parent.parent();
          parent.remove();
          // remove the parent if it is a row and is empty and not a sortable (portlet)
          col
            .filter(function() {
            var el = $(this);
            return (el.is('[class*="col-"]:not(.sortable)') && el.children('*').length === 0);
          }).remove();

          // Communicate event destroyed panel
          $scope.$emit(removedEvent, parent.attr('id'));

        }
      });
    }]
  };
}])
/**=========================================================
 * Collapse panels * [panel-collapse]
 =========================================================*/
.directive('panelCollapse', ['$timeout', function($timeout){
  'use strict';
  
  var storageKeyName = 'panelState',
      storage;
  
  return {
    restrict: 'A',
    scope: false,
    controller: ["$scope", "$element", function ($scope, $element) {

      // Prepare the panel to be collapsible
      var $elem   = $($element),
          parent  = $elem.closest('.panel'), // find the first parent panel
          panelId = parent.attr('id');

      storage = $scope.$storage;

      // Load the saved state if exists
      var currentState = loadPanelState( panelId );
      if ( typeof currentState !== 'undefined') {
        $timeout(function(){
            $scope[panelId] = currentState; },
          10);
      }

      // bind events to switch icons
      $element.bind('click', function() {

        savePanelState( panelId, !$scope[panelId] );

      });
    }]
  };

  function savePanelState(id, state) {
    if(!id) return false;
    var data = angular.fromJson(storage[storageKeyName]);
    if(!data) { data = {}; }
    data[id] = state;
    storage[storageKeyName] = angular.toJson(data);
  }

  function loadPanelState(id) {
    if(!id) return false;
    var data = angular.fromJson(storage[storageKeyName]);
    if(data) {
      return data[id];
    }
  }

}])
/**=========================================================
 * Refresh panels
 * [panel-refresh] * [data-spinner="standard"]
 =========================================================*/
.directive('panelRefresh', ["$q", function($q){
  'use strict';
  
  return {
    restrict: 'A',
    scope: false,
    controller: ["$scope", "$element", function ($scope, $element) {
      
      var refreshEvent   = 'panel-refresh',
          whirlClass     = 'whirl',
          defaultSpinner = 'standard';


      // catch clicks to toggle panel refresh
      $element.on('click', function () {
        var $this   = $(this),
            panel   = $this.parents('.panel').eq(0),
            spinner = $this.data('spinner') || defaultSpinner
            ;

        // start showing the spinner
        panel.addClass(whirlClass + ' ' + spinner);

        // Emit event when refresh clicked
        $scope.$emit(refreshEvent, panel.attr('id'));

      });

      // listen to remove spinner
      $scope.$on('removeSpinner', removeSpinner);

      // method to clear the spinner when done
      function removeSpinner (ev, id) {
        if (!id) return;
        var newid = id.charAt(0) == '#' ? id : ('#'+id);
        angular
          .element(newid)
          .removeClass(whirlClass);
      }
    }]
  };
}]);

/**=========================================================
 * Module: play-animation.js
 * Provides a simple way to run animation with a trigger
 * Requires animo.js
 =========================================================*/
 
angular.module('core').directive('animate', ["$window", "Utils", function($window, Utils){

  'use strict';

  var $scroller = $(window).add('body, .wrapper');
  
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {

      // Parse animations params and attach trigger to scroll
      var $elem     = $(elem),
          offset    = $elem.data('offset'),
          delay     = $elem.data('delay')     || 100, // milliseconds
          animation = $elem.data('play')      || 'bounce';
      
      if(typeof offset !== 'undefined') {
        
        // test if the element starts visible
        testAnimation($elem);
        // test on scroll
        $scroller.scroll(function(){
          testAnimation($elem);
        });

      }

      // Test an element visibilty and trigger the given animation
      function testAnimation(element) {
          if ( !element.hasClass('anim-running') &&
              Utils.isInView(element, {topoffset: offset})) {
          element
            .addClass('anim-running');

          setTimeout(function() {
            element
              .addClass('anim-done')
              .animo( { animation: animation, duration: 0.7} );
          }, delay);

        }
      }

      // Run click triggered animations
      $elem.on('click', function() {

        var $elem     = $(this),
            targetSel = $elem.data('target'),
            animation = $elem.data('play') || 'bounce',
            target    = $(targetSel);

        if(target && target.length) {
          target.animo( { animation: animation } );
        }
        
      });
    }
  };

}]);

/**=========================================================
 * Module: scroll.js
 * Make a content box scrollable
 =========================================================*/

angular.module('core').directive('scrollable', function(){
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs) {
      var defaultHeight = 250;
      elem.slimScroll({
          height: (attrs.height || defaultHeight)
      });
    }
  };
});
/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

/* jshint -W026 */
angular.module('core').directive('sidebar', ['$rootScope', '$window', 'Utils', function($rootScope, $window, Utils) {
  'use strict';
  var $win  = $($window);
  var $body = $('body');
  var $scope;
  var $sidebar;
  var currentState = $rootScope.$state.current.name;

  return {
    restrict: 'EA',
    template: '<nav class="sidebar" ng-transclude></nav>',
    transclude: true,
    replace: true,
    link: function(scope, element, attrs) {
      
      $scope   = scope;
      $sidebar = element;

      var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
      var subNav = $();
      $sidebar.on( eventName, '.nav > li', function() {

        if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

          subNav.trigger('mouseleave');
          subNav = toggleMenuItem( $(this) );

          // Used to detect click and touch events outside the sidebar          
          sidebarAddBackdrop();

        }

      });

      scope.$on('closeSidebarMenu', function() {
        removeFloatingNav();
      });

      // Normalize state when resize to mobile
      $win.on('resize', function() {
        if( ! Utils.isMobile() )
          $body.removeClass('aside-toggled');
      });

      // Adjustment on route changes
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        currentState = toState.name;
        // Hide sidebar automatically on mobile
        $('body.aside-toggled').removeClass('aside-toggled');

        $rootScope.$broadcast('closeSidebarMenu');
      });

      // Allows to close
      if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {

        $('.wrapper').on('click.sidebar', function(e){
          // don't check if sidebar not visible
          if( ! $body.hasClass('aside-toggled')) return;

          // if not child of sidebar
          if( ! $(e.target).parents('.aside').length ) {
            $body.removeClass('aside-toggled');          
          }

        });
      }

    }
  };

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
      .siblings('li')
      .removeClass('open')
      .end()
      .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');
    
    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
    var subNav = ul.clone().appendTo( $aside );
    
    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
      .addClass('nav-floating')
      .css({
        position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
        top:      itemTop,
        bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
      });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.dropdown-backdrop').remove();
    $('.sidebar-subnav.nav-floating').remove();
    $('.sidebar li.open').removeClass('open');
  }

}]);
/**=========================================================
 * Module: skycons.js
 * Include any animated weather icon from Skycons
 =========================================================*/

angular.module('core').directive('skycon', function(){

  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      
      var skycons = new Skycons({'color': (attrs.color || 'white')});

      element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');

      skycons.add(element.children()[0], attrs.skycon);

      skycons.play();

    }
  };
});
/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
 
angular.module('core').directive('sparkline', ['$timeout', '$window', function($timeout, $window){

  'use strict';

  return {
    restrict: 'EA',
    controller: ["$scope", "$element", function ($scope, $element) {
      var runSL = function(){
        initSparLine($element);
      };

      $timeout(runSL);
    }]
  };

  function initSparLine($element) {
    var options = $element.data();

    options.type = options.type || 'bar'; // default chart is bar
    options.disableHiddenCheck = true;

    $element.sparkline('html', options);

    if(options.resize) {
      $(window).resize(function(){
        $element.sparkline('html', options);
      });
    }
  }

}]);

/**=========================================================
 * Module: table-checkall.js
 * Tables check all checkbox
 =========================================================*/

angular.module('core').directive('checkAll', function() {
  'use strict';
  
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element){
      
      $element.on('change', function() {
        var $this = $(this),
            index= $this.index() + 1,
            checkbox = $this.find('input[type="checkbox"]'),
            table = $this.parents('table');
        // Make sure to affect only the correct checkbox column
        table.find('tbody > tr > td:nth-child('+index+') input[type="checkbox"]')
          .prop('checked', checkbox[0].checked);

      });
    }]
  };

});
/**=========================================================
 * Module: tags-input.js
 * Initializes the tag inputs plugin
 =========================================================*/

angular.module('core').directive('tagsinput', ["$timeout", function($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {

      element.on('itemAdded itemRemoved', function(){
        // check if view value is not empty and is a string
        // and update the view from string to an array of tags
        if(ngModel.$viewValue && ngModel.$viewValue.split) {
          ngModel.$setViewValue( ngModel.$viewValue.split(',') );
          ngModel.$render();
        }
      });

      $timeout(function(){
        element.tagsinput();
      });

    }
  };
}]);

/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that 
 * affects globally the entire layout or more than one item 
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

angular.module('core').directive('toggleState', ['toggleStateService', function(toggle) {
  'use strict';
  
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var $body = $('body');

      $(element)
        .on('click', function (e) {
          e.preventDefault();
          var classname = attrs.toggleState;
          
          if(classname) {
            if( $body.hasClass(classname) ) {
              $body.removeClass(classname);
              if( ! attrs.noPersist)
                toggle.removeState(classname);
            }
            else {
              $body.addClass(classname);
              if( ! attrs.noPersist)
                toggle.addState(classname);
            }
            
          }

      });
    }
  };
  
}]);

/**=========================================================
 * Module: trigger-resize.js
 * Triggers a window resize event from any element
 =========================================================*/

angular.module('core').directive("triggerResize", ['$window', '$timeout', function ($window, $timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.on('click', function(){
        $timeout(function(){
          $window.dispatchEvent(new Event('resize'))
        });
      });
    }
  };
}]);

/**=========================================================
 * Module: validate-form.js
 * Initializes the validation plugin Parsley
 =========================================================*/

angular.module('core').directive('validateForm', function() {
  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      var $elem = $($element);
      if($.fn.parsley)
        $elem.parsley();
    }]
  };
});

/**=========================================================
 * Module: vector-map.js.js
 * Init jQuery Vector Map plugin
 =========================================================*/

angular.module('core').directive('vectorMap', ['vectorMap', function(vectorMap){
  'use strict';

  var defaultColors = {
      markerColor:  '#23b7e5',      // the marker points
      bgColor:      'transparent',      // the background
      scaleColors:  ['#878c9a'],    // the color of the region in the serie
      regionFill:   '#bbbec6'       // the base region color
  };

  return {
    restrict: 'EA',
    link: function(scope, element, attrs) {

      var mapHeight   = attrs.height || '300',
          options     = {
            markerColor:  attrs.markerColor  || defaultColors.markerColor,
            bgColor:      attrs.bgColor      || defaultColors.bgColor,
            scale:        attrs.scale        || 1,
            scaleColors:  attrs.scaleColors  || defaultColors.scaleColors,
            regionFill:   attrs.regionFill   || defaultColors.regionFill,
            mapName:      attrs.mapName      || 'world_mill_en'
          };
      
      element.css('height', mapHeight);
      
      vectorMap.init( element , options, scope.seriesData, scope.markersData);

    }
  };

}]);
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
 
angular.module('core').factory('AComanda', ['$http', '$q', function($http, $q) {
  'use strict';

  var parametrosPesquisa = [];

  return {

    validaForm: function(form) {    
        if (form.$valid) {
          return true;
        } else {
          var message = '';

          for (var key in form) {
              if (key.indexOf('$') == 0) continue;
              for (var error in form[key].$error) {
                  if (form[key].$error[error] === true) {
                    if (!_.isUndefined($('[name=' + key + ']').data(error.toLowerCase() + '-message')))
                      message += $('[name=' + key + ']').data(error.toLowerCase() + '-message') + '<br>';
                  }
              }
          } 

          // if (_.isArray(form.$error.required)) {          
          //   message += 'Existem campos não preenchidos<br>';
          // }

          // if (_.isArray(form.$error.number)) {
          //   message += 'Existem campos preenchidos incorretamente<br>';
          // }

          // if (_.isArray(form.$error.cnpj)) {
          //   message += 'Digite um CNPJ válido<br>';
          // }
          
          // if (_.isArray(form.$error.cpf)) {
          //   message = 'Digite um CPF válido<br>';
          // }

          // if (_.isArray(form.$error.brPhoneNumber)) {
          //   message += 'Digite um Telefone válido<br>';
          // }

          // if (_.isArray(form.$error.email)) {
          //   message += 'Digite um Email válido<br>';
          // }

          // if (_.isArray(form.$error.max)) {
          //   message = 'Valor digitado excede o permitido<br>';
          // }

          if (!_.isEmpty(message)) {
            noty({
              text: message,
              type: 'error'
            });
          }
        }
    },

    carregaEndereco: function(address) {
      var def = $q.defer();
      var params = {
        address: address, 
        sensor: false
      };
      $http.get(
        'http://maps.googleapis.com/maps/api/geocode/json', { params: params }
      ).then(function(response) {   
        def.resolve(response.data.results);  
      });
      return def.promise;
    },
    
    pesquisar: function(url) {
      var def = $q.defer();
      $http.post(url, parametrosPesquisa).then(function(response) {        
        def.resolve(response.data);  
        parametrosPesquisa = [];
      });      
      return def.promise;
    },

    addPesquisa: function(valor, campo, tipo) {      
      parametrosPesquisa.push({
        campo: campo || 'nome',
        valor: valor,
        tipo: tipo || 'String'
      });
      return this;
    },

    deleteConfirm: function(message, callbackYes, callbackNo) {
      noty({
        modal: true,
        text: message || 'Tem certeza que deseja deletar o registro?', 
        buttons: [{ addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
              $noty.close();
              if (callbackYes && typeof(callbackYes) === "function") {
                callbackYes();
              }
            }
          }, { 
            addClass: 'btn btn-warning', text: 'Não', onClick: function($noty) {
              $noty.close();
              if (callbackNo && typeof(callbackNo) === "function") {
                callbackNo();
              }
            }
          }]
      }); 
    },

    showMessage: function(data) {
      noty({
        text: data.message,
        type: data.type
      });
    },

    carregaObjeto: function(path) {
      if (/create/.test(path)) {
        return {};
      } else if (/edit/.test(path)) {
        return null;
      }
    }

  }

}]);

angular.module('core').service('browser', function(){
  "use strict";

  var matched, browser;

  var uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
      /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    var platform_match = /(ipad)/.exec( ua ) ||
      /(iphone)/.exec( ua ) ||
      /(android)/.exec( ua ) ||
      /(windows phone)/.exec( ua ) ||
      /(win)/.exec( ua ) ||
      /(mac)/.exec( ua ) ||
      /(linux)/.exec( ua ) ||
      /(cros)/i.exec( ua ) ||
      [];

    return {
      browser: match[ 3 ] || match[ 1 ] || "",
      version: match[ 2 ] || "0",
      platform: platform_match[ 0 ] || ""
    };
  };

  matched = uaMatch( window.navigator.userAgent );
  browser = {};

  if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.version);
  }

  if ( matched.platform ) {
    browser[ matched.platform ] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
    browser.mobile = true;
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if ( browser.cros || browser.mac || browser.linux || browser.win ) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+ and Safari are webkit based browsers
  if ( browser.chrome || browser.opr || browser.safari ) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if ( browser.rv )
  {
    var ie = "msie";

    matched.browser = ie;
    browser[ie] = true;
  }

  // Opera 15+ are identified as opr
  if ( browser.opr )
  {
    var opera = "opera";

    matched.browser = opera;
    browser[opera] = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if ( browser.safari && browser.android )
  {
    var android = "android";

    matched.browser = android;
    browser[android] = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;


  return browser;

});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
 
angular.module('core').factory('colors', ['APP_COLORS', function(colors) {
  'use strict';
  return {
    byName: function(name) {
      return (colors[name] || '#fff');
    }
  };

}]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
        //this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, level, parentMenuItemURL, menuItemUIRoute, isPublic, roles, position,
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position,
																iconClass, translateKey, alert) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender,
				iconClass: iconClass || 'fa fa-file-o',
				translate: translateKey,
				alert: alert
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
		//Adding the sidebar menu
		this.addMenu('sidebar');
	}
]);
/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/
 
angular.module('core').service('navSearch', function() {
  'use strict';
  var navbarFormSelector = 'form.navbar-form';
  return {
    toggle: function() {
      
      var navbarForm = $(navbarFormSelector);

      navbarForm.toggleClass('open');
      
      var isOpen = navbarForm.hasClass('open');
      
      navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

    },

    dismiss: function() {
      $(navbarFormSelector)
        .removeClass('open')      // Close control
        .find('input[type="text"]').blur() // remove focus
        .val('')                    // Empty input
        ;
    }
  };

});
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

/* jshint -W026 */
/* jshint -W003 */
angular.module('core').provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
  "use strict";


  // Set here the base of the relative path
  // for all app views
  this.basepath = function (uri) {
    return 'app/views/' + uri;
  };

  // Generates a resolve object by passing script names
  // previously configured in constant.APP_REQUIRES
  this.resolveFor = function () {
    var _args = arguments;
    return {
      deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
        // Creates a promise chain for each argument
        var promise = $q.when(1); // empty promise
        for(var i=0, len=_args.length; i < len; i ++){
          promise = andThen(_args[i]);
        }
        return promise;

        // creates promise to chain dynamically
        function andThen(_arg) {
          // also support a function that returns a promise
          if(typeof _arg == 'function')
              return promise.then(_arg);
          else
              return promise.then(function() {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load( whatToLoad );
              });
        }
        // check and returns required data
        // analyze module items with the form [name: '', files: []]
        // and also simple array of script files (for not angular js)
        function getRequired(name) {
          if (appRequires.modules)
              for(var m in appRequires.modules)
                  if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                      return appRequires.modules[m];
          return appRequires.scripts && appRequires.scripts[name];
        }

      }]};
  }; // resolveFor

  // not necessary, only used in config block for routes
  this.$get = function(){};

}]);


'use strict';

// clientes service used to communicate clientes REST endpoints
angular.module('core').factory('Sensores', ['$resource',
	function($resource) {

		var Sensores = $resource('api/sensores/:sensorId', 
			{ sensorId: '@_id' }, 
			{ update: { method: 'PUT' } });
    	
    	return Sensores;
	}
]);
/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

angular.module('core').service('toggleStateService', ['$rootScope', function($rootScope) {
  'use strict';
  var storageKeyName  = 'toggleState';

  // Helper object to check for words in a phrase //
  var WordChecker = {
    hasWord: function (phrase, word) {
      return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
    },
    addWord: function (phrase, word) {
      if (!this.hasWord(phrase, word)) {
        return (phrase + (phrase ? ' ' : '') + word);
      }
    },
    removeWord: function (phrase, word) {
      if (this.hasWord(phrase, word)) {
        return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
      }
    }
  };

  // Return service public methods
  return {
    // Add a state to the browser storage to be restored later
    addState: function(classname){
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      if(!data)  {
        data = classname;
      }
      else {
        data = WordChecker.addWord(data, classname);
      }

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },

    // Remove a state from the browser storage
    removeState: function(classname){
      var data = $rootScope.$storage[storageKeyName];
      // nothing to remove
      if(!data) return;

      data = WordChecker.removeWord(data, classname);

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },
    
    // Load the state string and restore the classlist
    restoreState: function($elem) {
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      // nothing to restore
      if(!data) return;
      $elem.addClass(data);
    }

  };

}]);
/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

angular.module('core').service('Utils', ["$window", "APP_MEDIAQUERY", function($window, APP_MEDIAQUERY) {
    'use strict';
    
    var $html = angular.element("html"),
        $win  = angular.element($window),
        $body = angular.element('body');

    return {
      // DETECTION
      support: {
        transition: (function() {
          var transitionEnd = (function() {

            var element = document.body || document.documentElement,
              transEndEventNames = {
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend',
                transition: 'transitionend'
              }, name;

            for (name in transEndEventNames) {
              if (element.style[name] !== undefined) return transEndEventNames[name];
            }
          }());

          return transitionEnd && { end: transitionEnd };
        })(),
        animation: (function() {
          var animationEnd = (function() {

            var element = document.body || document.documentElement,
              animEndEventNames = {
                WebkitAnimation: 'webkitAnimationEnd',
                MozAnimation: 'animationend',
                OAnimation: 'oAnimationEnd oanimationend',
                animation: 'animationend'
              }, name;

            for (name in animEndEventNames) {
              if (element.style[name] !== undefined) return animEndEventNames[name];
            }
          }());

          return animationEnd && { end: animationEnd };
        })(),
        requestAnimationFrame: window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               window.oRequestAnimationFrame ||
                               function(callback){ window.setTimeout(callback, 1000/60); },
        touch: (
            ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
            (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) || //IE 10
            (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0) || //IE >=11
            false
        ),
        mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
      },
      // UTILITIES
      isInView: function(element, options) {

        var $element = $(element);

        if (!$element.is(':visible')) {
          return false;
        }

        var window_left = $win.scrollLeft(),
            window_top  = $win.scrollTop(),
            offset      = $element.offset(),
            left        = offset.left,
            top         = offset.top;

        options = $.extend({topoffset:0, leftoffset:0}, options);

        if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
            left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
          return true;
        } else {
          return false;
        }
      },
      langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
      isTouch: function () {
        return $html.hasClass('touch');
      },
      isSidebarCollapsed: function () {
        return $body.hasClass('aside-collapsed');
      },
      isSidebarToggled: function () {
        return $body.hasClass('aside-toggled');
      },
      isMobile: function () {
        return $win.width() < APP_MEDIAQUERY.tablet;
      }
    };
}]);
'use strict';

// Configuring module
angular.module('financeiro').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Financeiro', 'financeiro', 'dropdown', '/financeiro(/.*)?', false, null, 20, 'icon-wallet');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Caixa (pdv)', 'financeiro/pontos-venda');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Cartão', 'financeiro/cartoes');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Conta', 'financeiro/contas');
		Menus.addSubMenuItem('sidebar', 'financeiro', 'Forma de Pagamento', 'financeiro/formas-pagamento');		
	}
]).controller('FinanceiroController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Cartoes',
			  	'Contas',
			  	'FormasPagamento',
			  	'PontosVenda',
	function($scope, $stateParams, $location, Authentication, Cartoes, Contas, FormasPagamento, PontosVenda) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			$scope.cadastros = [];

			Cartoes.query().$promise.then(function(data) {
				addPanel('Cartões', 'fa-credit-card', 'bg-gray', '#!/financeiro/cartoes', data.length, 0);
			});

			Contas.query().$promise.then(function(data) {
				addPanel('Contas', 'fa-money', 'bg-warning-light', '#!/financeiro/contas', data.length, 1);
			});

			FormasPagamento.query().$promise.then(function(data) {
				addPanel('Formas de Pagamento', 'fa-dollar', 'bg-info-light', '#!/financeiro/formas-pagamento', data.length, 2);
			});	

			PontosVenda.query().$promise.then(function(data) {
				addPanel('Pontos de Venda', 'fa-desktop', 'bg-purple-light', '#!/financeiro/pontos-venda', data.length, 3);
			});	
		};

		function addPanel(name, icon, color, link, count, order) {
			$scope.cadastros.push({
				name: name,
				icon: icon,
				color: color,
				link: link,
				count: count,
				order: order
			});
		};
	}
]);
'use strict';

//Setting up route
angular.module('financeiro').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.financeiro', {
			url: '/financeiro',
			templateUrl: 'modules/financeiro/views/financeiro.client.view.html'
		})

		.state('app.createPontoVenda', {
			url: '/financeiro/pontos-venda/create',
			templateUrl: 'modules/financeiro/pontos-venda/views/create-ponto-venda.client.view.html'
		})
		.state('app.editPontoVenda', {
			url: '/financeiro/pontos-venda/:pontoVendaId/edit',
			templateUrl: 'modules/financeiro/pontos-venda/views/edit-ponto-venda.client.view.html'
		})

		.state('app.createCartao', {
			url: '/financeiro/cartoes/create',
			templateUrl: 'modules/financeiro/cartoes/views/create-cartao.client.view.html'
		})
		.state('app.editCartao', {
			url: '/financeiro/cartoes/:cartaoId/edit',
			templateUrl: 'modules/financeiro/cartoes/views/edit-cartao.client.view.html'
		})

		.state('app.createFormaPagamento', {
			url: '/financeiro/formas-pagamento/create',
			templateUrl: 'modules/financeiro/formas-pagamento/views/create-forma-pagamento.client.view.html'
		})
		.state('app.editFormaPagamento', {
			url: '/financeiro/formas-pagamento/:formaPagamentoId/edit',
			templateUrl: 'modules/financeiro/formas-pagamento/views/edit-forma-pagamento.client.view.html'
		})

		.state('app.createConta', {
			url: '/financeiro/contas/create',
			templateUrl: 'modules/financeiro/contas/views/create-conta.client.view.html'
		})
		.state('app.editConta', {
			url: '/financeiro/contas/:contaId/edit',
			templateUrl: 'modules/financeiro/contas/views/edit-conta.client.view.html'
		})

		;
	}
]);
'use strict';

// Setting up route
angular.module('page').config(['$stateProvider',
  function($stateProvider) {
    // Users state routing
    $stateProvider.
    state('page', {
		url: '/page',
		templateUrl: 'modules/page/views/page.client.view.html'
    });
  }
]);

'use strict';

// Configuring module
angular.module('produto').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('sidebar', 'Produto', 'produto', 'dropdown', '/produto(/.*)?', false, null, 20, 'icon-handbag');
		Menus.addSubMenuItem('sidebar', 'produto', 'Categoria', 'produto/categorias');
		Menus.addSubMenuItem('sidebar', 'produto', 'Setor', 'produto/setores');
		Menus.addSubMenuItem('sidebar', 'produto', 'Unidade de Medida', 'produto/unidades-medida');
		Menus.addSubMenuItem('sidebar', 'produto', 'Produto', 'produto/produtos');
	}
]).controller('ProdutoOpcoesController', ['$scope', 
				'$stateParams', 
				'$location', 
				'Authentication', 
			  	'Setores',
			  	'Categorias',
			  	'UnidadesMedida',
			  	'Produtos',
	function($scope, $stateParams, $location, Authentication, Setores, Categorias, UnidadesMedida, Produtos) {
		$scope.authentication = Authentication;

		$scope.$on('enterpriseChange', function() {
			$scope.init();
		});

		$scope.init = function() {
			var i = 0;

			$scope.cadastros = [];		

			Setores.query().$promise.then(function(data) {
				addPanel('Setores', 'fa-sitemap', 'bg-green', '#!/produto/setores', data.length, i++);
			});

			Categorias.query().$promise.then(function(data) {
				addPanel('Categorias', 'fa-list', 'bg-info-light', '#!/produto/categorias', data.length, i++);
			});	

			UnidadesMedida.query().$promise.then(function(data) {
				addPanel('Unidades de Medida', 'fa-eyedropper', 'bg-danger-light', '#!/produto/unidades-medida', data.length, i++);
			});

			Produtos.query().$promise.then(function(data) {
				addPanel('Produtos', 'fa-eyedropper', 'bg-warning', '#!/produto/produtos', data.length, i++);
			});
		};

		function addPanel(name, icon, color, link, count, order) {
			$scope.cadastros.push({
				name: name,
				icon: icon,
				color: color,
				link: link,
				count: count,
				order: order
			});
		};
	}
]);

'use strict';

//Setting up route
angular.module('produto').config(['$stateProvider',
function ($stateProvider) {
		// Cadastros state routing
		$stateProvider.
		state('app.produto', {
			url: '/produto',
			templateUrl: 'modules/produto/views/produto.client.view.html'
		})

		.state('app.createUnidadeMedida', {
			url: '/produto/unidades-medida/create',
			templateUrl: 'modules/produto/unidades-medida/views/create-unidade-medida.client.view.html'
		})
		.state('app.editUnidadeMedida', {
			url: '/produto/unidades-medida/:unidadeMedidaId/edit',
			templateUrl: 'modules/produto/unidades-medida/views/edit-unidade-medida.client.view.html'
		})

		.state('app.createSetor', {
			url: '/produto/setores/create',
			templateUrl: 'modules/produto/setores/views/create-setor.client.view.html'
		})
		.state('app.editSetor', {
			url: '/produto/setores/:setorId/edit',
			templateUrl: 'modules/produto/setores/views/edit-setor.client.view.html'
		})

		.state('app.createCategoria', {
			url: '/produto/categorias/create',
			templateUrl: 'modules/produto/categorias/views/create-categoria.client.view.html'
		})
		.state('app.editCategoria', {
			url: '/produto/categorias/:categoriaId/edit',
			templateUrl: 'modules/produto/categorias/views/edit-categoria.client.view.html'
		})

		.state('app.createProduto', {
			url: '/produto/produtos/create',
			templateUrl: 'modules/produto/produtos/views/produto.client.view.html'
		})
		.state('app.editProduto', {
			url: '/produto/produtos/:produtoId/edit',
			templateUrl: 'modules/produto/produtos/views/produto.client.view.html'
		})

		;
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider','$urlRouterProvider',
	function($stateProvider,$urlRouterProvider) {		

		// Users state routing
		$stateProvider.
		state('page.signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('page.signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('page.forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('page.reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('page.reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('page.reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		}).
		state('app.password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('app.profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('app.accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			if($scope.registerForm.$valid) {
				$scope.credentials.username = $scope.credentials.email;
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
					noty({
					    text: response.message,
					    type: response.type
					});
				});
			} else {
				$scope.registerForm.name.$dirty = true;
				$scope.registerForm.account_email.$dirty = true;
				$scope.registerForm.account_password.$dirty = true;
				$scope.registerForm.account_password_confirm.$dirty = true;
			}
		};

		$scope.signin = function() {
			if($scope.loginForm.$valid) {
				$http.post('/auth/signin', $scope.credentials).success(function(response) {
					// If successful we assign the response to the global user model
					$scope.authentication.user = response;

					// And redirect to the index page
					$location.path('/');
				}).error(function(response) {
					$scope.error = response.message;
					noty({
					    text: response.message,
					    type: response.type
					});
				});
			} else {
				// set as dirty if the user click directly to login so we show the validation messages
				$scope.loginForm.account_email.$dirty = true;
				$scope.loginForm.account_password.$dirty = true;
			}
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Empresas', 'Authentication',
	function($scope, $http, $location, Users, Empresas, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) window.location = ('#!/page/signin');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};


		$scope.update = function() {
			var user = new Users($scope.user);			

			if (user.empresa) user.empresa = user.empresa._id;

			user.$update(function(response) {
				$scope.user = Authentication.user = response;

				noty({
				    text: 'Atualizado com sucesso',
				    type: 'success'
				});

			}, function(response) {
				$scope.error = response.data.message;
			});
		};

		$scope.submitted = false;
		$scope.validateInput = function(name, type) {
			var input = $scope.formValidate[name];
			return (input.$dirty || $scope.submitted) && input.$error[type];
		};

		// Submit form
		$scope.submitForm = function() {
			$scope.submitted = true;
			if ($scope.formValidate.$valid) {
			  $scope.update();
			} else {
			  console.log('Not valid!!');
			  return false;
			}
		};
		
		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

}]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user,
			empresas: window.empresas
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);