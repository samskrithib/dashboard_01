/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('testController', testController);

  function testController(httpCallsService, $scope, $log, UtilityService, testFactory) {
    var vm = this;
    vm.tabs = [
      { id: "0", title: 'LS + Energy Summary' },
      { id: "1", title: 'Lateness Summary' },
     
    ];
    vm.promise = httpCallsService.getByJson('assets/lateness_energy.json')
      .then(function (response) {
        vm.response = response;
        $log.debug(response)
        testFactory.getTestChart(vm.response)
      })


  }
})();
