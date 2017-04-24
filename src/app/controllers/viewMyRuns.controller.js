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

  function ViewMyRunsController(UrlGenerator, httpCallsService, unitPerformanceScoreFactory, speedDistanceChartFactory,
    $scope, $log, speedDistanceDataFactory, energySummaryFactory, onTimeRunningFactory, UtilityService) {
    var vm = this;
    vm.tabs = [];
    vm.key = true;

    vm.speedDistanceLinks = {};
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
              vm.unitPerformanceScores = _.pluck(vm.response, 'trainUnitPerformancePerJourney');
              vm.trainUnitPerformancePerLinks_allRuns = _.pluck(vm.unitPerformanceScores, 'trainUnitPerformancePerLink')
              vm.stationToStationLinks = _.pluck(vm.unitPerformanceScores[0].trainUnitPerformancePerLink, 'link')
              // $log.debug(vm.trainUnitPerformancePerLinks_allRuns)
              vm.unitPerformanceScoreChartLabels = unitPerformanceScoreFactory.getUnitPerformanceScoreChartLabels();
              vm.chartIndicators = _.pluck(vm.unitPerformanceScores, 'performanceIndicator')
              // $log.debug(vm.chartIndicators)
              unitPerformanceScoreFactory.getUnitPerformanceScoreChart(vm.unitPerformanceScores, vm.chartIndicators, vm.unitPerformanceScoreChartLabels)
              break;
            }
            case "1":{
              vm.energySummaries = _.pluck(vm.response, 'energySummaryReportPerJourney');
              $log.debug(vm.energySummaries)

            }

            default: {
            }
          }

        })
      }).catch(function (error) {

      })


    function speedDistanceData_All(data) {
      speedDistanceDataFactory.getSpeedDistanceLinks(data);
      speedDistanceDataFactory.getActualSpeedDistance(data);
      speedDistanceDataFactory.getFlatoutSpeedDistance(data);
      speedDistanceDataFactory.getOptimalSpeedDistance(data);
      speedDistanceDataFactory.getSpeedLimits(data)
      speedDistanceDataFactory.getElevation(data)
      speedDistanceDataFactory.getDriverAdvice(data)
    };







    vm.checkboxModel = function (key) {
      if (!$scope[key]) {
        //do something
        energySummaryFactory.setEnergySummaryChart(energySummaryFunc, vm.graphIndicator)
        return;
      }
      //do nothing
    };
    vm.links = {};
    vm.linkOnselect = function (selectedLink) {
      var arrayOfSelectedLinksUnitPerformanceScore =[]
      var arrayOfSelectedLinksPerformanceIndicators =[]
      $log.debug(selectedLink)
      //find index of links 
      var indexOfSelectedLink = _.indexOf(vm.stationToStationLinks, selectedLink)
      // $log.debug(indexOfSelectedLink)
      _.each( vm.trainUnitPerformancePerLinks_allRuns, function(val, key){
          arrayOfSelectedLinksUnitPerformanceScore.push(vm.trainUnitPerformancePerLinks_allRuns[key][indexOfSelectedLink])
          arrayOfSelectedLinksPerformanceIndicators.push(vm.trainUnitPerformancePerLinks_allRuns[key][indexOfSelectedLink].performanceIndicator)
      })
      $log.debug(arrayOfSelectedLinksPerformanceIndicators)

      unitPerformanceScoreFactory.setUnitPerformanceScoreChart(arrayOfSelectedLinksUnitPerformanceScore, arrayOfSelectedLinksPerformanceIndicators)

    };


    vm.energyTargetSwitch = true;
    vm.energyTargetSwitchOnchange = function (isOn) {
      $log.debug(isOn)
      energySummaryFactory.toggleEnergyTarget(isOn)
    }
    vm.speedDistanceLinkOnselect = function (selected) {
      selectedLink = selected;
      index = _.indexOf(vm.routeLinks, selected)
      // $log.debug(index)
      vm.runtimeDescription = driverAdvice[index].runtimeDescription
      vm.earlyDepartureAdvice = driverAdvice[index].earlyDepartureAdvice
      vm.earlyArrivalAdvice = driverAdvice[index].earlyArrivalAdvice
      vm.timeSavingAdvice = driverAdvice[index].timeSavingAdvice
      vm.timeSavedAdvice = driverAdvice[index].timeSavedAdvice
      vm.energyAdvice = driverAdvice[index].energyAdvice
      vm.goodDrivingAdvice = driverAdvice[index].goodDrivingAdvice
      vm.spareTimeAdvice = driverAdvice[index].spareTimeAdvice
      vm.speedingAdvice = driverAdvice[index].speedingAdvice
      if (_.contains(vm.speedDistanceData_Kph.links, selected)) {
        // $log.debug(_.indexOf(vm.speedDistanceData_Kph.links, selected))
        if (vm.radioModel === 'Kph') {
          // $log.debug(vm.radioModel)
          speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Kph, index)
        } else if (vm.radioModel === 'Mph') {
          // $log.debug(vm.radioModel)
          speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Mph, index)
          speedDistanceChartFactory.setSDMarker(50);
        }
      }
    }



    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          vm.speedDistanceLinks.selected = vm.routeLinks[index]
          var indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
          $log.debug(indexSel);
          speedDistanceChartFactory.setSpeedDistanceKph(vm.speedDistanceData_Kph, indexSel)
        } else {
          indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
          // $log.debug(indexSel);
          // $log.debug(vm.speedDistanceLinks.selected)
          speedDistanceChartFactory.setSpeedDistanceMph(vm.speedDistanceData_Mph, indexSel)
        }
      }

    })

    vm.gridOnOff = true;
    vm.gridbtnOnChange = function (btn) {
      speedDistanceChartFactory.setGridOnOff(btn)
    }

  }
})();
