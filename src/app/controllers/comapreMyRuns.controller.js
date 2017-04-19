/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsController', CompareMyRunsController);

  function CompareMyRunsController(UrlGenerator, httpCallsService, speedDistanceChartFactory,
    $scope, $log, speedDistanceDataFactory, energySummaryCompareFactory, latenessSummaryCompareFactory, UtilityService) {
    var vm = this;
    vm.tabs = [];
    vm.graphIndicators_array;
    vm.key = false, vm.error0 = false;
    vm.error1 = false; vm.error2 = false;
    var energySummaryGraphLabels, energySummaryData, energySummaryTotals, selectedLink;
    var driverAdvice;
    vm.speedDistanceLinks = {};
    vm.chartSubtitle = UrlGenerator.getData().subtitle;
    vm.tabs = UtilityService.getTab();
    // $log.debug(vm.tabs)
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
              $log.debug(energySummaryTotals)

              vm.graphLinks = energySummaryCompareFactory.getEnergySummaryGraphLinks(vm.energySummaries[0].energySummaryLinks);
              break;
            }

            case "1": {
              vm.latenessSummaries = vm.response.latenessSummaries;
              vm.latenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryData( vm.latenessSummaries)

            }
            case "2": {
              var speedDistanceUrl = UrlGenerator.getData().speedDistanceUrl;
              vm.promise = httpCallsService.getByUrl(speedDistanceUrl)
                .then(function (data) {
                  vm.error2 = false;
                  vm.speedDistanceresponse = data;

                  speedDistanceData_All(vm.speedDistanceresponse);
                  vm.speedDistanceData_Kph = speedDistanceDataFactory.getSpeedDistanceData_Kph();
                  vm.routeLinks = vm.speedDistanceData_Kph.links;
                  vm.speedDistanceLinks.selected = vm.routeLinks[0];

                  driverAdvice = speedDistanceDataFactory.getDriverAdvice(vm.speedDistanceresponse)
                  vm.runtimeDescription = driverAdvice[0].runtimeDescription
                  vm.earlyDepartureAdvice = driverAdvice[0].earlyDepartureAdvice
                  vm.earlyArrivalAdvice = driverAdvice[0].earlyArrivalAdvice
                  vm.timeSavingAdvice = driverAdvice[0].timeSavingAdvice
                  $log.debug(vm.timeSavingAdvice)
                  vm.timeSavedAdvice = driverAdvice[0].timeSavedAdvice
                  vm.energyAdvice = driverAdvice[0].energyAdvice
                  vm.goodDrivingAdvice = driverAdvice[0].goodDrivingAdvice

                  vm.speedDistanceData_Mph = speedDistanceDataFactory.getSpeedDistanceData_Mph();
                  vm.SpeedDistanceGraphLabels = speedDistanceDataFactory.getSpeedDistanceGraphLabels();
                  speedDistanceChartFactory.getSpeedDistanceChart(vm.speedDistanceData_Kph, vm.SpeedDistanceGraphLabels);
                  speedDistanceChartFactory.setSDMarker(50);
                }).catch(function (response) {
                  vm.error2 = true;
                  vm.speedDistanceErrorMessage = response.data + "<h1> sd Chart error </h1>";
                });
              break;
            }
            default: {
            }
          }

        });



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



    vm.getInclude = function (x) {
      if (x == 0) {
        return 'views/EnergySummaryChart.tmpl.html'
      } if (x == 1) {
        return 'views/OnTimeRunningChart.tmpl.html'
      } if (x == 2) {
        return 'views/SpeedDistanceChart.tmpl.html'
      } else return ''

    };


    vm.checkedItems = UtilityService.getCheckedItems();

    vm.checkboxModel = function (key) {
      if (!$scope[key]) {
        //do something
        energySummaryCompareFactory.setEnergySummaryChart(energySummaryTotals)
        return;
      }
      //do nothing
    };
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

    vm.speedDistanceLinkOnselect = function (selected) {
      selectedLink = selected;
      var index = _.indexOf(vm.routeLinks, selected)
      vm.runtimeDescription = driverAdvice[index].runtimeDescription
      vm.earlyDepartureAdvice = driverAdvice[index].earlyDepartureAdvice
      vm.earlyArrivalAdvice = driverAdvice[index].earlyArrivalAdvice
      vm.timeSavingAdvice = driverAdvice[index].timeSavingAdvice
      vm.timeSavedAdvice = driverAdvice[index].timeSavedAdvice
      vm.energyAdvice = driverAdvice[index].energyAdvice
      vm.goodDrivingAdvice = driverAdvice[index].goodDrivingAdvice
      $log.debug(vm.goodDrivingAdvice)
      if (_.contains(vm.speedDistanceData_Kph.links, selected)) {
        if (vm.radioModel === 'Kph') {
          speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Kph, index)
        } else if (vm.radioModel === 'Mph') {
          speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Mph, index)
          speedDistanceChartFactory.setSDMarker(50);
        }
      }
    }



    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          vm.speedDistanceLinks.selected = vm.routeLinks[0]
          var indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
          // $log.debug(indexSel);
          speedDistanceChartFactory.setSpeedDistanceKph(vm.speedDistanceData_Kph, indexSel)
        } else {
          indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
          // $log.debug(indexSel);
          // $log.debug(vm.speedDistanceLinks.selected)
          speedDistanceChartFactory.setSpeedDistanceMph(vm.speedDistanceData_Mph, indexSel)
        }
      }

    })

    vm.SpeedUnit = function (value) {
      vm.getSpeedData = speedDistanceDataFactory.getSpeedDistanceData_Kph()
      $log.debug(vm.getSpeedData.flatoutDriving[0]);
    }

  }
})();
