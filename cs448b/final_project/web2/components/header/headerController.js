/**
 * Define HeaderController for the header component of CS142 project #4
 * problem #3.
 */

cs142App.controller('HeaderController', ['$scope', function($scope) {

   // Replace this with the code for CS142 Project #4, Problem #3
   $scope.currTime = new Date().getTime();
   $scope.picLinks = [
   "http://i.imgur.com/G5pfP.jpg",
   "http://i.imgur.com/WYhuB.jpg",
   "http://i.imgur.com/qlu6F.jpg"
   ];

}]);
