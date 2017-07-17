/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsController', CompareMyRunsController);

  function CompareMyRunsController(UrlGenerator, httpCallsService, 
    $scope, $log, energySummaryCompareFactory, latenessSummaryCompareFactory,speedDistanceCompareDataFactory, speedDistanceCompareChartFactory, UtilityService) {
    var vm = this;
    vm.tabs = [
      { id: "0", title: 'Energy Summary' },
      { id: "1", title: 'Lateness Summary' },
      { id: "2", title: 'Speed Distance' }
    ];
    vm.key = false;
    var energySummaryGraphLabels, energySummaryData, energySummaryTotals;
    vm.speedDistanceLinks = {};
    vm.chartSubtitle = UrlGenerator.getData().subtitle;
    vm.promise = httpCallsService.getByJson('assets/driverMultipleRunsResponse.json')
      .then(function (data) {
        vm.response = data;
        vm.error = false;
        _.each(vm.tabs, function (val, key) {
          switch (vm.tabs[key].id) {
            case "0": {
              vm.energySummaries = vm.response.energySummaries;
              // $log.debug(vm.energySummaries);
              // vm.graphIndicator = vm.energySummaries.energySummaryAdvice.graphIndicator;
              energySummaryData = energySummaryCompareFactory.getEnergySummaryData(vm.energySummaries)
              energySummaryTotals = energySummaryCompareFactory.getEnergySummarySumofLinks(energySummaryData);
              energySummaryGraphLabels = energySummaryCompareFactory.getEnergySummaryGraphLabels();
              energySummaryCompareFactory.getEnergySummaryChart(energySummaryTotals, energySummaryGraphLabels, vm.graphIndicators_array);
              vm.graphLinks = energySummaryCompareFactory.getEnergySummaryGraphLinks(vm.energySummaries[0].energySummaryLinks);
              // $log.info(vm.graphLinks)
              break;
            }

            case "1": {
              vm.latenessSummaries = vm.response.latenessSummaries;
              vm.latenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryData(vm.latenessSummaries)
              vm.latenessSummaryChartLabels = latenessSummaryCompareFactory.getlatenessSummaryChartLabels()
              latenessSummaryCompareFactory.getLatenessSummaryChart(vm.latenessSummaryData, vm.latenessSummaryChartLabels)
              vm.latenessSummaryChartLinks = latenessSummaryCompareFactory.getLatenessSummaryLinks(vm.latenessSummaries[0].latenessSummaries)
              $log.info(vm.latenessSummaryChartLinks)
              break;
            }
            case "2": {
              vm.speedDistances = vm.response.speedDistanceReports;
              vm.speedDistanceChartLabels = speedDistanceCompareDataFactory.getSpeedDistanceGraphLabels();
              speedDistanceDataCompare_All(vm.speedDistances)
              vm.speedDistanceData_Kph = speedDistanceCompareDataFactory.getSpeedDistanceData_Kph();
              vm.speedDistanceData_Mph = speedDistanceCompareDataFactory.getSpeedDistanceData_Mph();
              $log.info(vm.speedDistances)
              break;
            }
            default: {
            }
          }
        })
        // end of each function
      }).catch(function (error) {

      })

    function speedDistanceDataCompare_All(speedDistanceData) {
      speedDistanceCompareDataFactory.getSpeedDistanceLinks(speedDistanceData)
      speedDistanceCompareDataFactory.getActualSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getFlatoutSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getOptimalSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getSpeedRestrictions(speedDistanceData);
      speedDistanceCompareDataFactory.getElevation(speedDistanceData);
      vm.getDriverAdvice = speedDistanceCompareDataFactory.getDriverAdvice(speedDistanceData)
    };

    vm.linkOnselect = function (selectedLink){
      if (selectedLink){
        _.each(vm.graphLinks, function (val, key){
          if (vm.graphLinks[key] == selectedLink){
            vm.indexOfSelectedLink = key
            return vm.indexOfSelectedLink;
          }
        })
        $log.info("the selcted link is " + vm.indexOfSelectedLink)
        speedDistanceCompareOnSelectLink();
        
      }else{
        $log.info("You did not select a link.");
      }
    };

    function speedDistanceCompareOnSelectLink() {
      speedDistanceCompareDriverAdviceOfSelectedLink();
      vm.modData_Kph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Kph, vm.indexOfSelectedLink, vm.graphLinks)
      vm.modData_Mph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Mph, vm.indexOfSelectedLink, vm.graphLinks)
      speedDistanceCompareChartFactory.getSpeedDistanceCompareChart(vm.modData_Kph, vm.speedDistanceChartLabels);
      
      if (vm.radioModel === 'Kph') {
        speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(vm.modData_Kph, vm.indexOfSelectedLink);
      //  speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(vm.speedDistanceData_Kph, vm.indexOfSelectedLink);
      }else if (vm.radioModel === 'Mph'){
        speedDistanceCompareChartFactory.setSpeedDistanceCompareMph(vm.modData_Mph, vm.indexOfSelectedLink);
      }
      
    }

    function speedDistanceCompareDriverAdviceOfSelectedLink(){
      vm.runtimeDescription = vm.getDriverAdvice[vm.indexOfSelectedLink].runtimeDescription
      vm.earlyDepartureAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyDepartureAdvice
      vm.earlyArrivalAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyArrivalAdvice
      vm.timeSavedAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].timeSavedAdvice
      vm.energyAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].energyAdvice
      vm.goodDrivingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].goodDrivingAdvice
      vm.spareTimeAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].spareTimeAdvice
      vm.speedingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].speedingAdvice
    }

    vm.links = {};
    vm.energySummaryLinksOnselect = function () {
      // $log.debug(vm.links.selected);
      UtilityService.addCheckedItems(vm.links.selected);
      vm.newenergySummaryData = energySummaryCompareFactory.getenergySummaryLinksData(vm.energySummaries, vm.links.selected);
      vm.newEnergySummaryTotal = energySummaryCompareFactory.getEnergySummarySumofLinks(vm.newenergySummaryData.energySummaryLinksData_array);
      vm.graphIndicators_array = vm.newenergySummaryData.graphIndicators_array;
      // $log.debug(vm.newEnergySummaryTotal);
      energySummaryCompareFactory.setEnergySummaryChart(vm.newEnergySummaryTotal, vm.graphIndicators_array);
    };

    vm.latenessLinks = {}
    vm.latenessSummaryKeyOnChange = function(latenessSummaryKey){
      $log.debug(latenessSummaryKey)
      if (!latenessSummaryKey) {
        //do something
        latenessSummaryCompareFactory.setLatenessSummaryChart(vm.latenessSummaryData)
        return;
      }
    }
    vm.latenessSummaryLinksOnselect = function () {
      // $log.debug(vm.latenessLinks.selected)

      vm.newLatenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryLinksData( vm.latenessSummaries, vm.latenessLinks.selected)
      latenessSummaryCompareFactory.setLatenessSummaryChart(vm.newLatenessSummaryData)

    }
    
    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(vm.modData_Kph, vm.indexOfSelectedLink);
          //speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(vm.speedDistanceData_Kph, vm.indexOfSelectedLink)
        } else {
          speedDistanceCompareChartFactory.setSpeedDistanceCompareMph(vm.modData_Mph, vm.indexOfSelectedLink);
        }
      }
    })


    vm.gridOnOff=true;
    vm.gridbtnOnChange = function (btn) {
      speedDistanceCompareChartFactory.setGridOnOff(btn)
    }

  }
})();
