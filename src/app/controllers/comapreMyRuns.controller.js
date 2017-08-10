/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsController', CompareMyRunsController);

  function CompareMyRunsController(UrlGenerator, httpCallsService,
    $scope, $log, unitPerformanceScoreCompareFactory, energySummaryCompareFactory, latenessSummaryCompareFactory, speedDistanceCompareDataFactory, speedDistanceCompareChartFactory, UtilityService) {
    var vm = this;
    vm.tabs = [{
        id: "0",
        title: 'Unit Performance'
      },
      {
        id: "1",
        title: 'Energy & Lateness Summary'
      },
      {
        id: "2",
        title: 'Speed Distance'
      }
    ];
    vm.key = false;
    vm.radioModel = 'Kph';
    var energySummaryGraphLabels, energySummaryData;
    vm.speedDistanceLinks = {};
    vm.chartSubtitle = UrlGenerator.getData().subtitle;
    vm.promise = httpCallsService.getByJson('assets/DriverRunsMultiple.json')
      // vm.promise = httpCallsService.getByJson('assets/driverMultipleRunsResponse.json')
      .then(function (data) {
        vm.response = data;
        vm.error = false;
        _.each(vm.tabs, function (val, key) {
          switch (vm.tabs[key].id) {
            case "0":
              {
                vm.unitPerformanceData = _.pluck(vm.response.driverMultipleRunsReportList, 'trainUnitPerformancePerJourney');
                vm.unitPerformanceScoreChartLabels = unitPerformanceScoreCompareFactory.getUnitPerformanceScoreChartLabels();
                vm.chartIndicators = _.pluck(vm.unitPerformanceData, 'journeyPerformanceIndicator')
                unitPerformanceScoreCompareFactory.getUnitPerformanceScoreChart(vm.unitPerformanceData, vm.unitPerformanceScoreChartLabels, vm.chartIndicators)
                break;
              }

            case "1":
              {
                vm.energySummaries = _.pluck(vm.response.driverMultipleRunsReportList, 'energySummaryReportPerJourney');
                vm.energySummaryData = _.pluck(vm.energySummaries, 'energySummaryPerJourney')
                energySummaryGraphLabels = energySummaryCompareFactory.getEnergySummaryGraphLabels();
                energySummaryCompareFactory.getEnergySummaryChart(vm.energySummaryData, energySummaryGraphLabels, vm.chartIndicators);
                vm.graphLinks = energySummaryCompareFactory.getEnergySummaryGraphLinks(vm.energySummaries[0].energySummaryLinks);

                vm.latenessSummaries = _.pluck(vm.response.driverMultipleRunsReportList, 'latenessSummaryReportPerJourney');
                vm.latenessSummaryData = _.pluck(vm.latenessSummaries, 'latenessSummaryPerJourney')
                vm.latenessSummaryChartLabels = latenessSummaryCompareFactory.getlatenessSummaryChartLabels()
                latenessSummaryCompareFactory.getLatenessSummaryChart(vm.latenessSummaryData, vm.latenessSummaryChartLabels, vm.chartIndicators)
                break;
              }
            case "2":
              {
                vm.speedDistanceProfiles = _.pluck(vm.response.driverMultipleRunsReportList, 'speedDistanceReportPerLinkWithLink')
                vm.trackInformationPerLink = vm.response.trackInformationList;
                vm.speedDistanceChartLabels = speedDistanceCompareDataFactory.getSpeedDistanceGraphLabels();
                speedDistanceDataCompare_All(vm.speedDistanceProfiles, vm.trackInformationPerLink)
                vm.speedDistanceData_Kph = speedDistanceCompareDataFactory.getSpeedDistanceData_Kph();
                vm.speedDistanceData_Mph = speedDistanceCompareDataFactory.getSpeedDistanceData_Mph();
                var formatData = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Kph, 0, vm.graphLinks);
                speedDistanceCompareChartFactory.getSpeedDistanceCompareChart(formatData, vm.getlatenessSummaryChartLabels)
                break;
              }
            default:
              {}
          }
        })
        // end of each function
      }).catch(function (error) {

      })

    function speedDistanceDataCompare_All(speedDistanceData, trackInfo) {
      speedDistanceCompareDataFactory.getSpeedDistanceLinks(speedDistanceData)
      speedDistanceCompareDataFactory.getActualSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getFlatoutSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getOptimalSpeedDistance(speedDistanceData);
      speedDistanceCompareDataFactory.getSpeedRestrictions(trackInfo);
      speedDistanceCompareDataFactory.getElevation(trackInfo);
      vm.getDriverAdvice = speedDistanceCompareDataFactory.getDriverAdvice(speedDistanceData)
    };

    vm.linkOnselect = function (selectedLink) {
      if (selectedLink) {
        _.each(vm.graphLinks, function (val, key) {
          if (vm.graphLinks[key].stations == selectedLink) {
            vm.indexOfSelectedLink = key
            return vm.indexOfSelectedLink;
          }
        })
        speedDistanceCompareOnSelectLink(vm.indexOfSelectedLink)

      } else {
        vm.indexOfSelectedLink = null;
      }
      energySummaryLinksOnselect(vm.indexOfSelectedLink)
      latenessSummaryLinksOnselect(vm.indexOfSelectedLink)
      unitPerformanceLinksOnSelect(vm.indexOfSelectedLink)
    };

    function unitPerformanceLinksOnSelect(indexOfSelectedLink) {
      if (indexOfSelectedLink == null) {
        unitPerformanceScoreCompareFactory.setUnitPerformanceScoreChart(vm.unitPerformanceData, vm.chartIndicators);
      } else {
        vm.newUnitPerformanceData = unitPerformanceScoreCompareFactory.getUnitPerfromanceLinksData(vm.unitPerformanceData, indexOfSelectedLink);
        var performanceIndicatorsArray = vm.newUnitPerformanceData.performanceIndicators;
        unitPerformanceScoreCompareFactory.setUnitPerformanceScoreChart(vm.newUnitPerformanceData.array, performanceIndicatorsArray);
      }
    }

    function latenessSummaryLinksOnselect(indexOfSelectedLink) {
      var newLatenessSummaryLinksData = [];
      var runtimePerformanceLinksData = [];
      // $log.info(indexOfSelectedLink)
      if (indexOfSelectedLink == null) {
        // $log.info(vm.latenessSummaryData)
        latenessSummaryCompareFactory.setLatenessSummaryChart(vm.latenessSummaryData, vm.chartIndicators)
      } else {
        var newLatenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryLinksData(vm.latenessSummaries, indexOfSelectedLink, vm.unitPerformanceData)
        newLatenessSummaryLinksData = newLatenessSummaryData.latenessSummaryData_Array;
        runtimePerformanceLinksData = newLatenessSummaryData.runtimePerformanceIndicators
        $log.info(runtimePerformanceLinksData)
        latenessSummaryCompareFactory.setLatenessSummaryChart(newLatenessSummaryLinksData, runtimePerformanceLinksData)
      }
    }

    function energySummaryLinksOnselect(indexOfSelectedLink) {
      if (indexOfSelectedLink == null) {
        energySummaryCompareFactory.setEnergySummaryChart(vm.energySummaryData, vm.chartIndicators);
      } else {
        vm.newenergySummaryData = energySummaryCompareFactory.getenergySummaryLinksData(vm.energySummaries, indexOfSelectedLink, vm.unitPerformanceData);
        vm.newEnergySummaryLinksData = vm.newenergySummaryData.energySummaryLinksData_array;
        vm.energyPerformanceIndicators_array = vm.newenergySummaryData.energyPerformanceIndicators_array;
        energySummaryCompareFactory.setEnergySummaryChart(vm.newEnergySummaryLinksData, vm.energyPerformanceIndicators_array);
      }

    };

    function speedDistanceCompareOnSelectLink(indexOfSelectedLink) {
      speedDistanceCompareDriverAdviceOfSelectedLink();
      if (vm.radioModel === 'Kph') {
        vm.modData_Kph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Kph, indexOfSelectedLink, vm.graphLinks)
        speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(vm.modData_Kph, indexOfSelectedLink);
      } else if (vm.radioModel === 'Mph') {
        vm.modData_Mph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Mph, indexOfSelectedLink, vm.graphLinks)
        speedDistanceCompareChartFactory.setSpeedDistanceCompareMph(vm.modData_Mph, indexOfSelectedLink);
      }

    }

    function speedDistanceCompareDriverAdviceOfSelectedLink() {
      vm.runtimeDescription = vm.getDriverAdvice[vm.indexOfSelectedLink].runtimeDescription
      vm.earlyDepartureAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyDepartureAdvice
      vm.earlyArrivalAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyArrivalAdvice
      vm.timeSavedAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].timeSavedAdvice
      vm.energyAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].energyAdvice
      vm.goodDrivingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].goodDrivingAdvice
      vm.spareTimeAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].spareTimeAdvice
      vm.speedingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].speedingAdvice
    }

    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          var modData_Kph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Kph, vm.indexOfSelectedLink, vm.graphLinks)
          speedDistanceCompareChartFactory.setSpeedDistanceCompareKph(modData_Kph, vm.indexOfSelectedLink);
        } else {
          var modData_Mph = speedDistanceCompareDataFactory.getDataFormat(vm.speedDistanceData_Mph, vm.indexOfSelectedLink, vm.graphLinks)
          speedDistanceCompareChartFactory.setSpeedDistanceCompareMph(modData_Mph, vm.indexOfSelectedLink);
        }
      }
    })


    vm.gridOnOff = true;
    vm.gridbtnOnChange = function (btn) {
      speedDistanceCompareChartFactory.setGridOnOff(btn)
    }

  }
})();
