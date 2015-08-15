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