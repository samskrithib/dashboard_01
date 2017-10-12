/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('timetableAdherenceModule')
    .controller('TimetableAdherenceInput_2_Controller', TimetableAdherenceInput_2_Controller);

  function TimetableAdherenceInput_2_Controller(timetableAdherenceUrlGeneratorService, $location, $log, UtilityService) {
    var vm = this;

    vm.timetableRoutes = UtilityService.getCheckedItems()[0];
    vm.getTabs = UtilityService.getCheckedItems()[1]
    vm.routesFlag = UtilityService.getCheckedItems()[2]
    vm.inputValues = UtilityService.getCheckedItems()[3].timetableAdherenceInputs
    $log.info(vm.inputValues)
    vm.tableRowExpanded = false;
    vm.tableRowIndexCurrExpanded = "";
    vm.tableRowIndexPrevExpanded = "";
    vm.dayDataCollapse = [];
    _.each(vm.timetableRoutes, function (val, key) {
      vm.dayDataCollapse.push(true)
    })
    $log.info(vm.dayDataCollapse, vm.dayDataCollapse.length)
    vm.selectTableRow = function (index) {
      if (vm.dayDataCollapse === 'undefined') {
        vm.dayDataCollapse = vm.dayDataCollapseFn();
      } else {

        if (vm.tableRowExpanded === false && vm.tableRowIndexCurrExpanded === "") {
          vm.tableRowIndexPrevExpanded = "";
          vm.tableRowExpanded = true;
          vm.tableRowIndexCurrExpanded = index;
          vm.dayDataCollapse[index] = false;
        } else if (vm.tableRowExpanded === true) {
          if (vm.tableRowIndexCurrExpanded === index) {
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
      for (var i = 0; vm.response.timetableRoutes.length - 1; i += 1) {
        vm.dayDataCollapse.append('true');
      }
    };

    vm.routeIdSelected = function ($valid) {
      var routeIdUrl = timetableAdherenceUrlGeneratorService.generateRouteIdUrl(vm.selectRoute)
      $log.info(routeIdUrl)
      UtilityService.addCheckedItems([vm.getTabs, routeIdUrl, vm.routesFlag])
      $location.path("timetableAdherence")

    }

  }
})();
