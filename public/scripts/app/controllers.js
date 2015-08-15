define(['angular', 'underscore'], function (angular, _) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', ['datatables', 
        'datatables.bootstrap', 
        'angular-loading-bar', 
        'ngAnimate'])
        .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }]);

    mainAppControllers.controller('NavCtrl', ['$scope', '$http','$location','localStorageService','AuthenticationService',
        function ($scope, $http,$location,localStorageService,AuthenticationService) {


            $scope.isAuthenticated = AuthenticationService.isLogged()

            $scope.logout = function()
            {
                localStorageService.clearAll();
                $location.path("/login");
            }
        }
    ]);

    mainAppControllers.controller('LoginCtrl', ['$scope', '$http','$location', "cryptoJSService",'localStorageService',
        function ($scope, $http,$location,CryptoJS,localStorageService) {

            $scope.failed_login = "";

            $scope.submit = function()
            {
                var salt = $scope.username;
                var enc_password = CryptoJS.PBKDF2($scope.password, salt, { keySize: 256/32 });

                var user = {"username": $scope.username, "password": enc_password.toString()};

                if($scope.username!==undefined || $scope.password !==undefined){
                    $http({method: 'POST', url: '/api/login', data:user}).
                        success(function(data, status, headers, config) {

                            localStorageService.set("auth_token",data.auth_token);
                            $location.path("/home");

                        }).
                        error(function(data, status, headers, config) {
                            if(status===401){
                                noty({
                                    text: 'Usuário ou senha incorreta!', 
                                    type: 'error'
                                });
                            }else{
                                noty({
                                    text: data,  
                                    type: 'error'
                                });
                            }
                        });
                }else{
                    noty({text: 'Username and password are mandatory!', type: 'error'});
                }

            }

        }
    ]);


    mainAppControllers.controller('RegistrationCtrl', ['$scope', '$http','cryptoJSService',
        function ($scope, $http, CryptoJS) {

            $scope.signup = function()
            {
                var salt = $scope.username;

                var enc_password = CryptoJS.PBKDF2($scope.password, salt, { keySize: 256/32 });
                var enc_check_password = CryptoJS.PBKDF2($scope.check_password, salt, { keySize: 256/32 });

                var user = {"username": $scope.username, "password": enc_password.toString(), "check_password" : enc_check_password.toString() };

                if($scope.username!==undefined || $scope.password !==undefined || $scope.check_password !==undefined){

                    if($scope.password !== $scope.check_password){
                        noty({text: 'password and check_password must be the same!', type: 'warning'});
                    }else{
                        $http({method: 'POST', url: '/api/signup', data:user}).
                            success(function(data, status, headers, config) {
                                noty({text: "Username is registered correctly!", type: 'success'});
                                $scope.username = null;
                                $scope.password = null;
                                $scope.check_password = null;
                            }).
                            error(function(data, status, headers, config) {
                                noty({text: data.message, type: 'error'});
                            });
                    }

                }else{
                    noty({text: 'Username and password are mandatory!', type: 'warning'});
                }

            }

        }
    ]);



    mainAppControllers.controller('HomeCtrl', ['$scope', '$http',
        function ($scope, $http) {

            $scope.updatePerson = function(index,modify)
            {
                var person = $scope.people[index];

                if(modify){
                    $scope.people[index].modify=true;
                }else{

                    $http({method: 'PUT', url: '/api/person/'+person._id,data:{person: person}}).
                        success(function(data, status, headers, config) {
                            $scope.people[index].modify=false;
                        }).
                        error(function(data, status, headers, config) {
                            if(status!==401){
                                noty({
                                    text: data,  
                                    type: 'error'
                                });
                            }
                        });
                }
            }

            $scope.deletePerson = function(index)
            {

                var person = $scope.people[index];

                $http({method: 'DELETE', url: '/api/person/'+person._id}).
                    success(function(data, status, headers, config) {
                        $scope.people.splice(index, 1);

                    }).
                    error(function(data, status, headers, config) {
                        if(status!==401){
                            noty({
                                text: data,  
                                type: 'error'
                            });
                        }
                    });
            }


        }
    ]);

	function getAllPerson ($http,$scope) {
		$http({method: 'GET', url: '/api/people'}).
				success(function(data, status, headers, config) {
					$scope.persons = data.people;
				}).
				error(function(data, status, headers, config) {
					if(status!==401){
						 noty({
                            text: data,  
                            type: 'error'
                        });
					}
				});
	}
	
    mainAppControllers.controller('PersonCtrl', ['$scope', '$http', 'DTOptionsBuilder', 'DTColumnDefBuilder',
        function ($scope, $http, DTOptionsBuilder, DTColumnDefBuilder) {			
			
			$scope.dtOptions = DTOptionsBuilder
								.newOptions()
								.withLanguage({
									sUrl: 'http://cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese-Brasil.json'
								})
								.withBootstrap();		
			
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(0).notVisible().notSortable(),
                DTColumnDefBuilder.newColumnDef(1).notSortable(),
				DTColumnDefBuilder.newColumnDef(2),
				DTColumnDefBuilder.newColumnDef(3)
			];
									
			getAllPerson($http,$scope);
			
            $scope.person = null;

            $scope.insertPerson = function()
            {
                window.location = '/#/person-add';
            }

			$scope.updatePerson = function(index,modify)
            {
                var person = $scope.persons[index];
				window.location = '/#/person/' + person._id;
            }

            $scope.deletePerson = function(index)
            {
				noty({
                    text: 'Tem certeza que deseja deletar o registro?', 
                    buttons: [
                        { addClass: 'btn btn-primary', text: 'Sim', onClick: function($noty) {
                                $noty.close();
                                var person = $scope.persons[index];

                                $http({method: 'DELETE', url: '/api/person/'+person._id}).
                                    success(function(data, status, headers, config) {
                                        $scope.persons.splice(index, 1);
                                        noty({
                                            text: data.message,// + '<br>Nome: ' + person.name,  
                                            type: 'success'
                                        }); 
                                    }).
                                    error(function(data, status, headers, config) {
                                        if(status!==401){
                                            noty({
                                                text: data,  
                                                type: 'error'
                                            });
                                        }
                                    });
                            }
                        },
                        { 
                            addClass: 'btn btn-danger', text: 'Não', onClick: function($noty) {
                                $noty.close();
                            }
                        }
                    ]
                });       
            }
        }
    ]);

    function initColorBox() {
        var $overflow = '';
        var colorbox_params = {
            rel: 'colorbox',
            reposition:true,
            scalePhotos:true,
            scrolling:false,
            previous:'<i class="ace-icon fa fa-arrow-left"></i>',
            next:'<i class="ace-icon fa fa-arrow-right"></i>',
            close:'&times;',
            current:'{current} of {total}',
            maxWidth:'100%',
            maxHeight:'100%',
            onOpen:function(){
                $overflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            },
            onClosed:function(){
                document.body.style.overflow = $overflow;
            },
            onComplete:function(){
                $.colorbox.resize();
            }
        };

        $('[data-rel="colorbox"]').colorbox(colorbox_params);
    }

    function initPersonEdit(person, token) {        

        var initialPreview = [];        
        var initialPreviewConfig = [];        
        if (Array.isArray(person.photos)) {
            _.each(person.photos, function(item){            
                initialPreview.push("<a href='"+ item.url+"' data-rel='colorbox'><img src='"+ 
                    item.url+"' class='file-preview-image'></a>");  
                initialPreviewConfig.push({ 
                    width: "120px", 
                    url: "/api/removephoto", 
                    key: item.public_id,
                    extra: {
                        idPerson: person._id
                    }
                })
            });
        }

        $('#input-702').on('fileuploaded', function(event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra, 
                response = data.response, reader = data.reader;
            console.log('File batch fileuploaded complete');
        });

        $('#input-702').on('filebatchuploadcomplete', function(event, files, extra) {
            console.log('File batch upload complete');
        });

        // delete header token
        $('#input-702').on('filepredelete', function(event, key, xhr) {
            xhr.setRequestHeader('Authorization', token);
        });

        $('#input-702').on('fileimageloaded', function(event, previewId) {
            initColorBox();
        });

        $("#input-702").fileinput({
            showRemove: false,
            overwriteInitial: false,
            allowedFileTypes: ['image'],
            allowedFileExtensions: ["jpg", "png"],
            allowedPreviewTypes: ['image'],
            dropZoneTitle: 'Arraste e solte arquivos aqui...',
            maxFileCount: 5,
            browseClass: "btn btn-sm btn-primary",
            removeClass: "btn btn-sm",
            uploadClass: "btn btn-sm",
            cancelClass: "btn btn-sm",
            uploadExtraData: function() {
                return { idPerson: person._id };
            },
            ajaxSettings: {
                headers: {
                    'Authorization' : token
                }
            },
            initialPreview: initialPreview,
            initialPreviewConfig: initialPreviewConfig,

            layoutTemplates :{                
                preview: '<div class="file-preview {class}">\n' +                    
                    '    <div class="{dropClass}">\n' +
                    '    <div class="file-preview-thumbnails">\n' +
                    '    </div>\n' +
                    '    <div class="clearfix"></div>' +
                    '    <div class="file-preview-status text-center text-success"></div>\n' +
                    '    <div class="kv-fileinput-error"></div>\n' +
                    '    </div>\n' +
                    '</div>'
                }

        });                

        initColorBox();
    }

	mainAppControllers.controller('PersonAddCtrl', ['$scope', '$http', '$routeParams',
        function ($scope, $http, $routeParams) {

			var person_id = $routeParams.person_id;		

            $scope.addView = (person_id === undefined);

            $scope.$back = function() { 
                window.history.back();
            };

            //jquery accordion
            $( ".accordion-style2" ).accordion({
                collapsible: true,
                heightStyle: "content",
                active: false,
                animate: 250,
                header: ".accordion-header",
                beforeActivate: function( event, ui ) {
                    if ( ui.newHeader.text() === "Fotos" ){
                        if ($scope.addView) {     
                            event.preventDefault();    
                            noty({
                                text: 'Para adicionar fotos você deve salvar o registro',
                                type: 'warning'
                            });
                        }    
                    }    
                }
            });

			if ($scope.addView) {

				$scope.person = null;                

				$scope.createPerson = function()
				{
					var person = {person: $scope.person};

					$http({method: 'POST', url: '/api/person',data:person}).
						success(function(data, status, headers, config) {                            
                            noty({
                                text: data.message,  
                                timeout: 10000, 
                                type: 'success'
                            });	

                            //window.location = '/#/person';
                            window.location = '/#/person/' + data.person._id;
						}).
						error(function(data, status, headers, config) {
							if(status!==401){
								noty({
                                    text: data,  
                                    type: 'error'
                                });
							}
						});
				}
			} else {                     
				$scope.person = null;                

				$http({ 
                    method: 'GET', 
                    url: '/api/people/' + person_id 
                    }).success(function(data, status, headers, config) {
						$scope.person = data.people;
                        $scope.origin = angular.copy($scope.person);
                        initPersonEdit($scope.person, config.headers.Authorization);
					}).error(function(data, status, headers, config) {
						if (status !== 401) {
							noty({
                                text: data,  
                                type: 'error'
                            });
						}
					});
				
				$scope.createPerson = function()
				{
					var person = $scope.person;

                    $http({method: 'PUT', url: '/api/person/'+person._id,data:{person: person}}).
                    success(function(data, status, headers, config) {
                        noty({
                            text: data.message,  
                            timeout: 10000, 
                            type: 'success'
                        });                         
                    }).
                    error(function(data, status, headers, config) {
                        if(status!==401){
                            noty({
                                text: data,  
                                type: 'error'
                            });
                        }
                    });
				}
			
			}
        }
    ]);

    return mainAppControllers;

});