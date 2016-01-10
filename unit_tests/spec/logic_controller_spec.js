describe('LogicCtrl', function () {

  var scope,controller,timeout;

  beforeEach(function() {
    angular.mock.module('gameOfShellsRepo');

    inject(function($controller, $rootScope, _$timeout_) {
      scope = $rootScope.$new();
      timeout = _$timeout_;

      controller = $controller('LogicCtrl', { $scope: scope });
    });
  });

  it(' should test Initialise load', function(){
    expect(scope.nbContainer).toBeTruthy();
    expect(scope.nbShuffle).toBeTruthy();

    expect(scope.showBet).toBeFalsy();
    expect(scope.selectedContainer).toBeTruthy();

    expect(scope.containers.length).toBeGreaterThan(1);
    expect(scope.possibleSolutions.length).toBeGreaterThan(1);
  });

  describe(' should test $scope.shuffleContainers()', function(){

    it(' and test show/hide variables',function(){
      scope.showBet = true;
      scope.selectedContainer = true;
      expect(scope.showBet).toBeTruthy();
      expect(scope.selectedContainer).toBeTruthy();

      scope.shuffleContainers();

      expect(scope.showBet).toBeFalsy();
      expect(scope.selectedContainer).toBeFalsy();
    });

    it(' and switch some containers',function(){
      scope.nbContainer = 7;
      scope.nbShuffle = 20;
      scope.containers = [
        { id: 1, positionX: 1 },
        { id: 2, positionX: 2 },
        { id: 3, positionX: 3 },
        { id: 4, positionX: 4 },
        { id: 5, positionX: 5 },
        { id: 6, positionX: 6 },
        { id: 7, positionX: 7 },
        { id: 8, positionX: 8 }
      ];

      var constantToCompare = [
        { id: 1, positionX: 1 },
        { id: 2, positionX: 2 },
        { id: 3, positionX: 3 },
        { id: 4, positionX: 4 },
        { id: 5, positionX: 5 },
        { id: 6, positionX: 6 },
        { id: 7, positionX: 7 },
        { id: 8, positionX: 8 }
      ];

      expect(scope.containers).toEqual(constantToCompare);
      expect(scope.containers.length).toEqual(8);

      scope.shuffleContainers();

      expect(scope.containers).toEqual(constantToCompare);
      expect(scope.containers.length).toEqual(8);

      timeout.flush();

      expect(scope.containers).not.toEqual(constantToCompare);
      expect(scope.containers.length).toEqual(8);
    });
  });

  describe(' should test $scope.selectBall()', function(){
    it(' and win',function(){
      var container = {
        id: 1,
        ball: true
      };
      scope.showBet = true;
      expect(scope.showBet).toBeTruthy();
      expect(scope.selectedContainer).not.toEqual('win');
      expect(scope.selectedContainer).not.toEqual('lose');

      scope.selectBall(container);

      expect(scope.showBet).toBeFalsy();
      expect(scope.selectedContainer).toEqual('win');
    });

    it(' and lose',function(){
      var container = {
        id: 1,
        ball: false
      };
      expect(scope.selectedContainer).not.toEqual('win');
      expect(scope.selectedContainer).not.toEqual('lose');

      scope.selectBall(container);

      expect(scope.selectedContainer).toEqual('lose');
    });

    it(' and do nothing as empty container',function(){
      expect(scope.selectedContainer).not.toEqual('win');
      expect(scope.selectedContainer).not.toEqual('lose');

      scope.selectBall();

      expect(scope.selectedContainer).not.toEqual('win');
      expect(scope.selectedContainer).not.toEqual('lose');
    });
  });

  describe(' should test $scope.changeLevels()', function(){
    it(' and add 1 to nbShuffle',function(){
      expect(scope.nbShuffle).toEqual(5);
      scope.changeLevels('shuffle', 1);
      expect(scope.nbShuffle).toEqual(6);
    });

    it(' and add -1 to nbShuffle',function(){
      expect(scope.nbShuffle).toEqual(5);
      scope.changeLevels('any value', -1);
      expect(scope.nbShuffle).toEqual(4);
    });

    it(' and add 1 to container and set container',function(){
      expect(scope.nbContainer).toEqual(3);
      expect(scope.containers.length).toEqual(3);
      expect(scope.possibleSolutions.length).toEqual(3);

      scope.changeLevels('container', 1);

      expect(scope.nbContainer).toEqual(4);
      expect(scope.containers.length).toEqual(4);
      expect(scope.possibleSolutions.length).toEqual(6);
    });

    it(' and add 2 to container and set container',function(){
      expect(scope.nbContainer).toEqual(3);
      expect(scope.containers.length).toEqual(3);
      expect(scope.possibleSolutions.length).toEqual(3);

      scope.changeLevels('container', 2);

      expect(scope.nbContainer).toEqual(5);
      expect(scope.containers.length).toEqual(5);
      expect(scope.possibleSolutions.length).toEqual(10);
    });

    it(' and not change anything because of error',function(){
      expect(scope.nbContainer).toEqual(3);
      scope.changeLevels('container', 'string');
      expect(scope.nbContainer).toEqual(3);
    });
  });

});
