var gameOfShellsRepo = angular.module('gameOfShellsRepo',[]);

gameOfShellsRepo.controller('LogicCtrl', ['$scope','$timeout', function ($scope,$timeout) {
  var SHUFFLE_SPEED = 500;

  //default levels
  $scope.nbContainer = 3; //number of container on the board
  $scope.nbShuffle = 5;   //number of shuffle

  //show/hide interface
  $scope.showBet = false;
  $scope.selectedContainer = true;

  //data arrays
  $scope.containers = []; //array of all containers
  $scope.possibleSolutions = []; //array of all possbile solutions

  var margin = 10; //margin left/right between each container in px
  var boardSize = 1000; //board size in px

  /**
   * Generate an array containing all possible solutions for nbContainer
   * @param  {integer} nbContainer number of containers
   * @return {array} array with all possible solutions
   */
  function loadPossibleSolution(nbContainer) {
    var firstVal = 0;
    var secondVal = firstVal + 1;

    var solution = [];
    var solutions = [];

    while (firstVal < nbContainer - 1) {
      solutions.push([firstVal, secondVal]);
      secondVal++;

      if (secondVal === nbContainer) {
        firstVal++;
        secondVal = firstVal + 1;
      }
    }
    return solutions;
  }

  /**
   * Initialise the containers data and size
   */
  function initContainer() {
    $scope.containers = [];
    var containerSize = Math.floor((boardSize - ($scope.nbContainer * 2 * margin)) / $scope.nbContainer);

    for (var i = 0; i < $scope.nbContainer; i++) {
      var singleContainer = {
        id: i,
        ball: (i === 0) ? true : false,
        width: containerSize + 'px',
        positionX : margin + (2 * margin * i) + (containerSize * i) + 'px'
      };
      $scope.containers.push(singleContainer);
    }
    $scope.possibleSolutions = loadPossibleSolution($scope.nbContainer);
  }

  /**
   * Switch position of two containers
   * @param  {object} c1 first container
   * @param  {object} c2 second container
   */
  function switchContainer (c1, c2) {
    var tmp = c1.positionX;
    c1.positionX = c2.positionX;
    c2.positionX = tmp;
  }

  /**
   * Delay the change of position of two containers
   * @param  {array} pairToSwitch selected solution pair to switch
   * @param  {integer} i          iteration variable
   * @param  {bool} lastitem      boolean to know if it is the last switch
   */
  function delayswitch (pairToSwitch, i, lastitem){
    var delayTimer = SHUFFLE_SPEED * i;
    $timeout(function(){
      switchContainer($scope.containers[pairToSwitch[0]], $scope.containers[pairToSwitch[1]]);
     }, delayTimer);

     if (lastitem) {
       $timeout(function(){
         $scope.showBet = true;
       }, delayTimer + SHUFFLE_SPEED);
     }
  }

  /**
   * Returns a random integer between min (included) and max (included)
   * @param  {integer} min
   * @param  {integer} max
   * @return {integer} random integer between min max
   */
  function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffle containers click
   */
  $scope.shuffleContainers = function () {
    $scope.showBet = false;
    $scope.selectedContainer = false;

    var lastitem = false;
    for (var i = 0; i < $scope.nbShuffle; i++) {
      var randomNum = getRandomIntInclusive(0, $scope.possibleSolutions.length - 1);
      var solutionPair = $scope.possibleSolutions[randomNum];

      if (i == $scope.nbShuffle - 1) {
        lastitem = true;
      }
      delayswitch(solutionPair, i, lastitem);
    }
  };

  /**
   * Click on a container to find the ball
   * @param  {object} container the selected container
   */
  $scope.selectBall = function (container) {
    if (!container) return;

    $scope.showBet = false;
    if (container.ball) {
      $scope.selectedContainer = 'win';
    } else {
      $scope.selectedContainer = 'lose';
    }
  };

  /**
   * Change the levels parameters
   * @param  {string} type    type of levels to change (ie. container, shuffle)
   * @param  {integer} change value to change (ie 1, -1)
   */
  $scope.changeLevels = function (type, change) {
    if (isNaN(parseInt(change))) return ;

    if (type === 'container') {
      $scope.nbContainer = $scope.nbContainer + change;
      initContainer();
    } else {
      $scope.nbShuffle = $scope.nbShuffle + change;
    }
  };

  //Initial load of the page
  initContainer();
}]);
