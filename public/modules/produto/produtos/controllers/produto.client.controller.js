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