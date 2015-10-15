'use strict';

/**
 * Das Modul fuer den Zugriff auf die Praxisboerse.
 */
var praxisboerse = angular.module('Praxisboerse', []);

/**
 * Kapselung des Zugriffs in Form eines Dienstes.
 * Noch einfacher klappt der Zugriff auf eine REST-Schnittstelle
 * in vielen Faellen mit dem Modul ngResource.
 */
praxisboerse.factory('PraxisboerseService', [ '$http', function($http) {
    var server = {};

    /**
     * Abholen der Essen.
     * @returns Alle Essen, sortiert in Gruppen von Mahlzeiten.
     */
    server.getCredent = function(url) {
        return $http.get(url);
    };

    /**
     * Die eigentliche Funktion des Dienstes.
     * @returns Alle Essen, sortiert in Gruppen von Mahlzeiten.
     */
    return {
        getCredent: function(url) {
            return server.getCredent(url);
        }
    }
}]);

/**
 * Controller fuer Ausgabe der Mahlzeiten.
 */
praxisboerse.controller('PraxisboerseController', ['$scope', 'PraxisboerseService', function($scope, PraxisboerseService) {

    /**
     * Essen mit eingestelltem Datum erneut abholen.
     */
    $scope.refresh = function() {
        PraxisboerseService.getCredent($scope.url).then(function(response) {
            $scope.credent = response.data;
        }, function(error) {
            console.log('No credent:' + error);
        });
    };

    /**
     * Empfang von Nachrichten eines Vater-Controllers.
     */
    $scope.$on('refreshPraxisboerse', function(event) {$scope.refresh();});

    /**
     * Initial: Essen abholen.
     */
    $scope.refresh();
}]);

praxisboerse.directive('praxisboerseView', function() {
    return {
        scope: {
            url: '@url'
        },
        templateUrl: 'praxisboerse/praxisboerseTemplate.html',
        restrict: 'E',
        link: function(scope, element, attrs) {
        }
    };
});
