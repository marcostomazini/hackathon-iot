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