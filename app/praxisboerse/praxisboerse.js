'use strict';

/**
 * Das Modul fuer den Zugriff auf die Praxisboerse.
 */
var praxisboerse = angular.module('Praxisboerse', ['base64']);

/**
 * Kapselung des Zugriffs in Form eines Dienstes.
 * Noch einfacher klappt der Zugriff auf eine REST-Schnittstelle
 * in vielen Faellen mit dem Modul ngResource.
 */
praxisboerse.factory('PraxisboerseService', [ '$http', '$base64', '$rootScope', function($http, $base64, $rootScope) {
    var server = {};

    /**
     * Aufruf an den Server mit Base64 gecodeten Zugangsdaten (userCredentials)
     * @returns den REST Respone Body
     */
    server.getData = function(url) {
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.userCredentials
        return $http.get(url);
    };

    /**
     * Die eigentliche Funktion des Dienstes.
     * @returns den Server Response
     */
    return {
        getData: function(url) {
            return server.getData(url);
        }
    }
}]);

/**
 * Controller fuer die Verwaltung von Angebotstypen und Angeboten
 */
praxisboerse.controller('PraxisboerseController', ['$scope', '$rootScope', 'PraxisboerseService', function($scope, $rootScope, PraxisboerseService) {


    /**
     * Initial die Angebotstypen vom Server abholen
     */
    PraxisboerseService.getOfferTypes = function() {
        //var hskaCredentialCheckUrl = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/check/"
        //var urlToCheck = hskaCredentialCheckUrl + username + "/" + password;
        $scope.mobileDevice = $rootScope.mobileDevice;

        PraxisboerseService.getData($scope.url).then(function(response) {
            console.log("response: " + response.data);
            $scope.selectedOfferType = "preselect";
            $scope.offerTypes = response.data;
            $rootScope.loggedIn = true;
        }, function(error) {
            console.log('No credent:' + error);
            $scope.offerTypes = '' + error;
        });
    };

    /**
     * Die Angebote vom Server mit der angegebenen URL per REST abholen
     * @param url
     */
    PraxisboerseService.getOffers = function(url) {
        //var hskaCredentialCheckUrl = "http://www.iwi.hs-karlsruhe.de/Intranetaccess/REST/credential/check/"
        //var urlToCheck = hskaCredentialCheckUrl + username + "/" + password;

        PraxisboerseService.getData(url).then(function(response) {
            console.log("response: " + response.data);
            $scope.offers = response.data;
        }, function(error) {
            console.log('No credent:' + error);
            $scope.offers = '' + error;
        });
    };

    /**
     * Datum um einen tag erhoehen, Essen erneut abholen.
     */
    $scope.incrementDate = function() {
        $scope.offerResultsStart = $scope.offerResultsStart + $scope.offerResultsCount +1 ;
        PraxisboerseService.getOffers($rootScope.restURL + "joboffer/offers/" + $scope.selectedOfferType + "/" + $scope.offerResultsStart + "/" + $scope.offerResultsCount);
    };

    /**
     * Empfang von Nachrichten eines Vater-Controllers.
     */
    $scope.$on('incrementDate', function(event) {$scope.incrementDate();});

    ///**
    // * Aktualisierung der Daten
    // */
    //$scope.$on('refreshPraxisboerse', function(event) {
    //    $scope.getOffers();
    //});

    $scope.updateSelectedOfferType = function() {
        console.log($scope.selectedOfferType);

        if($scope.selectedOfferType != "preselect") {
            //if($scope.mobileDevice == false)
            //PraxisboerseService.getOffers($rootScope.restURL + "joboffer/offers/" + $scope.selectedOfferType + "/0/-1");
            //else
            //{
            $scope.offerResultsStart = 0;
            $scope.offerResultsCount = 10;
            PraxisboerseService.getOffers($rootScope.restURL + "joboffer/offers/" + $scope.selectedOfferType + "/" + $scope.offerResultsStart + "/" + $scope.offerResultsCount);
            //}
        }
    };

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
