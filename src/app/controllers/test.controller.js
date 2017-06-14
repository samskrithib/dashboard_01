/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('testController', testController);

  function testController(httpCallsService, $scope, $log, UtilityService, testFactory) {
    var vm = this;
    vm.tableRowExpanded = false;
    vm.tableRowIndexCurrExpanded = "";
    vm.tableRowIndexPrevExpanded = "";
    vm.dayDataCollapse = [true, true, true, true, true, true];
        vm.selectTableRow = function (index) {
          $log.info(index)
          $log.info(vm.dayDataCollapse)
        if (vm.dayDataCollapse === 'undefined') {
            vm.dayDataCollapse = vm.dayDataCollapseFn();
        } else {

            if (vm.tableRowExpanded === false && vm.tableRowIndexCurrExpanded === "" ) {
                vm.tableRowIndexPrevExpanded = "";
                vm.tableRowExpanded = true;
                vm.tableRowIndexCurrExpanded = index;
                vm.dayDataCollapse[index] = false;
            } else if (vm.tableRowExpanded === true) {
                if (vm.tableRowIndexCurrExpanded === index ) {
                    vm.tableRowExpanded = false;
                    vm.tableRowIndexCurrExpanded = "";
                    vm.dayDataCollapse[index] = true;
                } else {
                    vm.tableRowIndexPrevExpanded = vm.tableRowIndexCurrExpanded;
                    vm.tableRowIndexCurrExpanded = index;
                    vm.dayDataCollapse[vm.tableRowIndexPrevExpanded] = true;
                    vm.dayDataCollapse[vm.tableRowIndexCurrExpanded] = false;
                }
            }
        }
    };
     vm.dayDataCollapseFn = function () {
        for (var i = 0;  vm.response.timetableRoutes.length - 1; i += 1) {
            vm.dayDataCollapse.append('true');
        }
    };
    vm.response = {
      "fromStation": "NWCSTLE",
      "toStation": "DNSN",
      "timetableAdherenceGraph": null,
      "timetableRoutes": [
        {
          "tiplocs": [
            "NWCSTLE",
            "HLBDGJN",
            "GRNSFDJ",
            "KEBGEJN",
            "KEBGSJN",
            "NRWDJN",
            "DNSN"
          ]
        },
        {
          "tiplocs": [
            "NWCSTLE",
            "KEBGNJN",
            "KEBGSJN",
            "NRWDJN",
            "DNSN",
            
          ]
        }
      ]
    }
  }
})();
