'use strict';

(function() {
	// Empresas Controller Spec
	describe('Empresas Controller Tests', function() {
		// Initialize global variables
		var EmpresasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Empresas controller.
			EmpresasController = $controller('EmpresasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Empresa object fetched from XHR', inject(function(Empresas) {
			// Create sample Empresa using the Empresas service
			var sampleEmpresa = new Empresas({
				name: 'New Empresa'
			});

			// Create a sample Empresas array that includes the new Empresa
			var sampleEmpresas = [sampleEmpresa];

			// Set GET response
			$httpBackend.expectGET('empresas').respond(sampleEmpresas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.empresas).toEqualData(sampleEmpresas);
		}));

		it('$scope.findOne() should create an array with one Empresa object fetched from XHR using a empresaId URL parameter', inject(function(Empresas) {
			// Define a sample Empresa object
			var sampleEmpresa = new Empresas({
				name: 'New Empresa'
			});

			// Set the URL parameter
			$stateParams.empresaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/empresas\/([0-9a-fA-F]{24})$/).respond(sampleEmpresa);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.empresa).toEqualData(sampleEmpresa);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Empresas) {
			// Create a sample Empresa object
			var sampleEmpresaPostData = new Empresas({
				name: 'New Empresa'
			});

			// Create a sample Empresa response
			var sampleEmpresaResponse = new Empresas({
				_id: '525cf20451979dea2c000001',
				name: 'New Empresa'
			});

			// Fixture mock form input values
			scope.name = 'New Empresa';

			// Set POST response
			$httpBackend.expectPOST('empresas', sampleEmpresaPostData).respond(sampleEmpresaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Empresa was created
			expect($location.path()).toBe('/empresas/' + sampleEmpresaResponse._id);
		}));

		it('$scope.update() should update a valid Empresa', inject(function(Empresas) {
			// Define a sample Empresa put data
			var sampleEmpresaPutData = new Empresas({
				_id: '525cf20451979dea2c000001',
				name: 'New Empresa'
			});

			// Mock Empresa in scope
			scope.empresa = sampleEmpresaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/empresas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/empresas/' + sampleEmpresaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid empresaId and remove the Empresa from the scope', inject(function(Empresas) {
			// Create new Empresa object
			var sampleEmpresa = new Empresas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Empresas array and include the Empresa
			scope.empresas = [sampleEmpresa];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/empresas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmpresa);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.empresas.length).toBe(0);
		}));
	});
}());