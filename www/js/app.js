/*******************************************************************************************
* CoreLogic Listing Application
* V1.0
* Adam Sellers - asellers@salesforce.com
* 16th October 2015
* Listing application that uses node.js server on postgres backend (Heroku) to surface
* real estate listings for Agents to update sales information on their mobile device.
* Also includes agent leaderboard that shows current status of agent sales in a leaderboard.
* Demo ware only! This app needs authentication and security! (maybe one day)
* A previous method used to get the data.json stuff into the model (for local stuf) is below.
* $http.get('js/data.json').success(function(data){
      $scope.listings = data;
      $scope.whichListing = $state.params.aId;

      $scope.doRefresh = function() {
      
      $http.get('js/data.json').success(function(data) {
          $scope.listings = data;
          $scope.$broadcast('scroll.refreshComplete');
        });
      };*
* 
* *******************************************************************************************/


//firstly declare the module that will be called in the ng-app directive
angular.module('listings', [
  'ionic', 
  'appServices'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

//config setup for routing of the app, setup tabs view, three tabs and one detail view

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: '/tab',
      abstract: true, 
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.list', { 
        url: '/list',
        views: {
          'list-tab' : {
            templateUrl : 'templates/list.html',
            controller : 'ListController'
          }
        }
    })
    .state('tabs.detail', { 
      url: '/list/:aId',
      views: {
        'list-tab' : {
          templateUrl : 'templates/detail.html',
          controller : 'ListController'
        }
      }
    })
    .state('tabs.home', { 
      url: '/home',
      views: {
        'home-tab' : {
          templateUrl : 'templates/home.html'
        }
      }
    })
    .state('tabs.leaderboard', { 
      url: '/leaderboard',
      views: {
        'leaderboard-tab' : {
          templateUrl : 'templates/leaderboard.html',
          controller : 'LeaderboardController'
        }
      }
    })
    $urlRouterProvider.otherwise('/tab/home');
})    

//Controller for the listings tab
.controller('ListController', ['$scope', '$state', '$http', 'ListingService',
 function($scope, $state, $http, ListingService, updateService) {


      $scope.listings = ListingService.query();
      $scope.whichListing = $state.params.aId;
      console.log($state.params.aId + ' was recorded');

     $scope.updateListing = function(listingId,price,date) {

        var query = ListingService.save({id: listingId}, {sale_price__c: price, sale_date__c: date});
        query.$promise.then(function(){
          console.log('that was successful');
        })
     };


      $scope.doRefresh = function () {
        var query = ListingService.query();
        query.$promise.then(function(data) {

          $scope.listings = data;
          $scope.$broadcast('scroll.refreshComplete');

        })

      }
}])
.controller('LeaderboardController', ['$scope', '$http', function($scope, $http) {

    $http.get('js/leaders.json').success(function(data) {
      $scope.leaders = data;
    })

      $scope.doRefresh = function() {

    $http.get('js/leaders.json').success(function(data) {
        $scope.leaders = data;
        $scope.$broadcast('scroll.refreshComplete');
        })
      }
}]);

