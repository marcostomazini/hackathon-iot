'use strict';

(function() {
	// Garcoms Controller Spec
	describe('Garcoms Controller Tests', function() {
		// Initialize global variables
		var GarcomsController,
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

			// Initialize the Garcoms controller.
			GarcomsController = $controller('GarcomsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Garcom object fetched from XHR', inject(function(Garcoms) {
			// Create sample Garcom using the Garcoms service
			var sampleGarcom = new Garcoms({
				name: 'New Garcom'
			});

			// Create a sample Garcoms array that includes the new Garcom
			var sampleGarcoms = [sampleGarcom];

			// Set GET response
			$httpBackend.expectGET('garcoms').respond(sampleGarcoms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.garcoms).toEqualData(sampleGarcoms);
		}));

		it('$scope.findOne() should create an array with one Garcom object fetched from XHR using a garcomId URL parameter', inject(function(Garcoms) {
			// Define a sample Garcom object
			var sampleGarcom = new Garcoms({
				name: 'New Garcom'
			});

			// Set the URL parameter
			$stateParams.garcomId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/garcoms\/([0-9a-fA-F]{24})$/).respond(sampleGarcom);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.garcom).toEqualData(sampleGarcom);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Garcoms) {
			// Create a sample Garcom object
			var sampleGarcomPostData = new Garcoms({
				name: 'New Garcom'
			});

			// Create a sample Garcom response
			var sampleGarcomResponse = new Garcoms({
				_id: '525cf20451979dea2c000001',
				name: 'New Garcom'
			});

			// Fixture mock form input values
			scope.name = 'New Garcom';

			// Set POST response
			$httpBackend.expectPOST('garcoms', sampleGarcomPostData).respond(sampleGarcomResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Garcom was created
			expect($location.path()).toBe('/garcoms/' + sampleGarcomResponse._id);
		}));

		it('$scope.update() should update a valid Garcom', inject(function(Garcoms) {
			// Define a sample Garcom put data
			var sampleGarcomPutData = new Garcoms({
				_id: '525cf20451979dea2c000001',
				name: 'New Garcom'
			});

			// Mock Garcom in scope
			scope.garcom = sampleGarcomPutData;

			// Set PUT response
			$httpBackend.expectPUT(/garcoms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/garcoms/' + sampleGarcomPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid garcomId and remove the Garcom from the scope', inject(function(Garcoms) {
			// Create new Garcom object
			var sampleGarcom = new Garcoms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Garcoms array and include the Garcom
			scope.garcoms = [sampleGarcom];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/garcoms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGarcom);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.garcoms.length).toBe(0);
		}));
	});
}());