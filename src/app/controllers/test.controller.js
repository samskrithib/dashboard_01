/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('testController', testController);

  function testController(httpCallsService, $scope, $log, UtilityService, testFactory) {
    var vm = this;
    $log.info("test")
  }
})();
