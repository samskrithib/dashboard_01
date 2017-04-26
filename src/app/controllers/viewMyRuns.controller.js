/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .factory('$exceptionHandler', function ($log) {
      return function (exception, cause) {
        $log.debug(exception, cause);
      }
    })
    .controller('ViewMyRunsController', ViewMyRunsController);

  function ViewMyRunsController($scope, $log, UrlGenerator, httpCallsService, unitPerformanceScoreFactory,
    energySummaryFactory, latenessSummaryFactory, speedDistanceDataFactory, speedDistanceChartFactory, UtilityService) {
    var vm = this;
    vm.tabs = [];
    vm.key = false;

    vm.firstLink;
    UtilityService.addTab('Unit performance', '0')
    UtilityService.addTab('Energy & Lateness Summary', '1')
    UtilityService.addTab('Speed Distance', '2')
    vm.tabs = UtilityService.getTab();
    var viewRunsUrl = UrlGenerator.generateReportsUrl();


    vm.promise = httpCallsService.getByJson(viewRunsUrl)
      .then(function (response) {
        vm.response = response;
        vm.trainIdentifiers = _.pluck(vm.response, 'trainIdentifier')

        _.each(vm.tabs, function (val, key) {
          switch (vm.tabs[key].id) {
            case "0": {
              vm.unitPerformanceScores = vm.response.trainUnitPerformancePerJourney;
              vm.trainUnitPerformancePerLinks_allRuns = [vm.unitPerformanceScores.trainUnitPerformancePerLink]
              vm.stationToStationLinks = _.pluck(vm.unitPerformanceScores.trainUnitPerformancePerLink, 'link')
              vm.unitPerformanceScoreChartLabels = unitPerformanceScoreFactory.getUnitPerformanceScoreChartLabels();
              vm.chartIndicators = [vm.unitPerformanceScores.performanceIndicator]
              unitPerformanceScoreFactory.getUnitPerformanceScoreChart([vm.unitPerformanceScores], vm.chartIndicators, vm.unitPerformanceScoreChartLabels)
              break;
            }
            case "1": {
              //energy Summary
              vm.energySummaries = vm.response.energySummaryReportPerJourney
              vm.totalEnergySummaries = [vm.energySummaries.energySummaryPerJourney]
              vm.energySummaryChartLabels = energySummaryFactory.getEnergySummaryGraphLabels();
              energySummaryFactory.getEnergySummaryChart(vm.totalEnergySummaries, vm.energySummaryChartLabels, vm.chartIndicators)
              vm.energySummaryLinks_allRuns = [vm.energySummaries.energySummaryLinks]

              // Lateness Summary
              vm.latenessSummaries = vm.response.latenessSummaryReportPerJourney
              vm.totalLatenessSummaries = [vm.latenessSummaries.latenessSummaryPerJourney]
              vm.latenessSummaryChartLabels = latenessSummaryFactory.getLatenessSummaryChartLabels();
              latenessSummaryFactory.getLatenessSummaryChart(vm.totalLatenessSummaries, vm.latenessSummaryChartLabels, vm.chartIndicators)
              vm.latenessSummaryLinks_allRuns = [vm.latenessSummaries.latenessSummaries]
              break;
            }
            case "2": {
              vm.speedDistanceLinks_allRuns = [vm.response.speedDistanceReportPerJourney.speedDistanceReports]
              $log.debug(vm.speedDistanceLinks_allRuns)
              vm.speedDistanceChartLabels = speedDistanceDataFactory.getSpeedDistanceGraphLabels();
              speedDistanceData_All(vm.speedDistanceLinks_allRuns[0])
              vm.speedDistanceData_Kph = speedDistanceDataFactory.getSpeedDistanceData_Kph();
              vm.speedDistanceData_Mph = speedDistanceDataFactory.getSpeedDistanceData_Mph();

              break;
            }

            default: {
              break;
            }
          }

        })
      }).catch(function (error) {

      })

    vm.checkboxModel = function (key) {
      if (!$scope[key]) {
        //do something
        unitPerformanceScoreFactory.setUnitPerformanceScoreChart([vm.unitPerformanceScores], vm.chartIndicators)
        energySummaryFactory.setEnergySummaryChart(vm.totalEnergySummaries, vm.chartIndicators)
        latenessSummaryFactory.setLatenessSummaryChart(vm.totalLatenessSummaries, vm.chartIndicators)
        return;
      }
      //do nothing

    };

    function speedDistanceData_All(data) {
      speedDistanceDataFactory.getSpeedDistanceLinks(data)
      speedDistanceDataFactory.getActualSpeedDistance(data);
      speedDistanceDataFactory.getFlatoutSpeedDistance(data);
      speedDistanceDataFactory.getOptimalSpeedDistance(data);
      speedDistanceDataFactory.getElevation(data)
      speedDistanceDataFactory.getSpeedLimits(data)
      speedDistanceDataFactory.getDriverAdvice(data)
    };

    vm.linkOnselect = function (selectedLink) {
      vm.arrayOfSelectedLinksPerformanceIndicators = []
      //find index of links 
      vm.indexOfSelectedLink = _.indexOf(vm.stationToStationLinks, selectedLink)
      unitPerformanceScoreOnSelectLink();
      energySummaryOnSelectLink();
      latenessSummaryOnSelectLink();
      speedDistanceOnselectLink();
    };

    function unitPerformanceScoreOnSelectLink() {
      vm.arrayOfSelectedLinksUnitPerformanceScore = []
      _.each(vm.trainUnitPerformancePerLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksUnitPerformanceScore.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink])
        vm.arrayOfSelectedLinksPerformanceIndicators.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink].performanceIndicator)
      })
      unitPerformanceScoreFactory.setUnitPerformanceScoreChart(vm.arrayOfSelectedLinksUnitPerformanceScore, vm.arrayOfSelectedLinksPerformanceIndicators)
    }

    function energySummaryOnSelectLink() {
      vm.arrayOfSelectedLinksEnergySummary = []
      _.each(vm.energySummaryLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksEnergySummary.push(vm.energySummaryLinks_allRuns[key][vm.indexOfSelectedLink].energySummary)
      })
      energySummaryFactory.setEnergySummaryChart(vm.arrayOfSelectedLinksEnergySummary, vm.arrayOfSelectedLinksPerformanceIndicators)
    }

    function latenessSummaryOnSelectLink() {
      vm.arrayOfSelectedLinksLatenessSummary = []
      _.each(vm.latenessSummaryLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksLatenessSummary.push(vm.latenessSummaryLinks_allRuns[key][vm.indexOfSelectedLink].latenessSummary)
      })
      latenessSummaryFactory.setLatenessSummaryChart(vm.arrayOfSelectedLinksLatenessSummary, vm.arrayOfSelectedLinksPerformanceIndicators)
    }

    function speedDistanceOnselectLink() {
      speedDistanceChartFactory.getSpeedDistanceChart(vm.speedDistanceData_Kph, vm.speedDistanceChartLabels);
      if (vm.radioModel === 'Kph') {
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Kph, vm.indexOfSelectedLink)
      } else if (vm.radioModel === 'Mph') {
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Mph, vm.indexOfSelectedLink)
      }
    }

    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          speedDistanceChartFactory.setSpeedDistanceKph(vm.speedDistanceData_Kph, vm.indexOfSelectedLink)
        } else {
          speedDistanceChartFactory.setSpeedDistanceMph(vm.speedDistanceData_Mph, vm.indexOfSelectedLink)
        }
      }

    })

    vm.gridOnOff = true;
    vm.gridbtnOnChange = function (btn) {
      speedDistanceChartFactory.setGridOnOff(btn)
    }

  }
})();
