/** Created by Samskrithi on 10/27/2016. */
(function() {
  'use strict';

  angular
  .module('dassimFrontendV03')
  
  .controller('testController', testController);
  
  function testController(httpCallsService, $scope, $log, UtilityService, testFactory) {
    var vm = this;
    vm.promise = httpCallsService.getByJson('assets/SpeedDistance.json')
    .then(function(response){
      vm.response = response;
      $log.debug(response)
      testFactory.getTestTrainGraph(vm.response);
      testFactory.LoadTrainGraphData(vm.response);
    })

 
  }
})();
