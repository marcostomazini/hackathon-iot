angular.module('sensores').controller('SimuladorController', ['$scope', 'ChartData', '$timeout', '$interval', function ($scope, ChartData, $timeout,$interval) {
  'use strict';

  // var es = new EventSource('/api/stream');
  // es.onmessage = function(e) { 
  //     $('#messages').append("<li>" + e.data + "</li>") 
  // }

// var handleCallback = function (msg) {
//       $scope.$apply(function () {
//         //$scope.msg = JSON.parse(msg.data)
//         $('#messages').append("<li>" + msg.data + "</li>") 
//       // Create new cliente object
//       var sensor = undefined;
//         sensor = new Sensores({tipo: 'todos', valor: msg.data});
//         // Redirect after save
//          sensor.$save(function(response) {

//          }, function(errorResponse) {

//          });
//         // C:0|U:1020|A:1021|G:0
//       });
//   }

//   var source = new EventSource('/api/stream');
//   source.addEventListener('message', handleCallback, false);

$scope.dados = 'C:0|U:1020|A:1021|G:0';

$scope.send = function() {
  //$.post("/api/stream")
  $.post( "/api/stream", {info: $scope.dados});
};


var stop;
$scope.fight = function() {
  // Don't start a new fight if we are already fighting
  if ( angular.isDefined(stop) ) return;

  stop = $interval(function () {
      try {
        var c = Math.floor(Math.random() * 10) + 1  
        var u = Math.floor(Math.random() * 1020) + 1; 
        var a = Math.floor(Math.random() * 1020) + 1; 
        var g = Math.floor(Math.random() * 10) + 1;

        var dados = {
          info: 'C:'+ c +'|U:'+ u +'|A:'+ a +'|G:'+ g +''
        }
        $.post( "/api/stream", dados);
      }
      catch (ex) { }
  }, 5000); 
};

$scope.stopFight = function() {
  if (angular.isDefined(stop)) {
    $interval.cancel(stop);
    stop = undefined;
  }
};


$scope.startRandom = function() {
   $scope.fight();
};

$scope.stopRandom = function() {
   $scope.stopFight();
};

}]);