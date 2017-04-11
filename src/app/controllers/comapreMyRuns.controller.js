/** Created by Samskrithi on 10/27/2016. */
(function() {
  'use strict';

  angular
  .module('dassimFrontendV03')
  
  .controller('CompareMyRunsController', CompareMyRunsController);
  
  function CompareMyRunsController(UrlGenerator, httpCallsService, speedDistanceChartFactory, 
    $scope, $log, speedDistanceDataFactory, energySummaryCompareFactory, onTimeRunningCompareFactory, UtilityService) {
    var vm = this;
    vm.tabs = [];
    vm.key= false, vm.error0=false;
    vm.error1=false;vm.error2=false;
    var energySummaryGraphLabels, energySummaryData1,energySummaryData2, energySummaryFunc1,energySummaryFunc2, selectedLink;
    var driverAdvice;
    vm.speedDistanceLinks = {};
    vm.chartSubtitle= UrlGenerator.getData().subtitle;
    vm.tabs = UtilityService.getTab();
    _.each(vm.tabs, function (val, key) {
      switch (vm.tabs[key].id) {
        case "0" : {
          var energyUrl = UrlGenerator.getData().energyUrl;
          // $log.debug(energyUrl);
          vm.promise = httpCallsService.getByJson('assets/energySummaryCompare.json')
          .then(function (data) {
            vm.error=false;
            vm.response0 = data;
            // $log.debug(vm.response0);
            energySummaryData1 = energySummaryCompareFactory.getEnergySummaryData(vm.response0.energySummaryLink1)
            energySummaryData2 = energySummaryCompareFactory.getEnergySummaryData(vm.response0.energySummaryLink2)
            energySummaryFunc1 = energySummaryCompareFactory.getEnergySummarySumofLinks(energySummaryData1);
            energySummaryFunc2 = energySummaryCompareFactory.getEnergySummarySumofLinks(energySummaryData2);
            energySummaryGraphLabels = energySummaryCompareFactory.getEnergySummaryGraphLabels();
            energySummaryCompareFactory.getEnergySummaryChart(energySummaryFunc1, energySummaryGraphLabels);
            vm.graphLinks = energySummaryCompareFactory.getEnergySummaryGraphLinks(vm.response0.energySummaryLink1);
              // $log.debug(vm.graphLinks);
              
            }).catch(function (response) {
              vm.error0=true;
              vm.energySummaryErrorMessage = response.data + response.status +"<h1> Energy Summary Report error </h1>";
              // var myEl = angular.element( document.querySelector( '#chart0' ) );
              // myEl.text("An error has occurred.\n HTTP error: " + response.data + "status: "+response.status + "(" + response.statusText + ")")
              // $log.debug("EnergySummary Url response: " + response.status);
            });
            break;
          }
        case "1": {
            var onTimeUrl = UrlGenerator.getData().onTimeUrl;
            $log.debug(onTimeUrl)
            vm.promise = httpCallsService.getByJson('assets/onTimeRunningCompare.json')
            .then(function (data) {
              vm.error1=false;
              vm.response1 = data;
              $log.debug(vm.response1)
              vm.dataFunc = onTimeRunningCompareFactory.getOnTimeData(vm.response1);
              vm.onTimeGraphLabels = onTimeRunningCompareFactory.getonTimeGraphLabels(vm.response1);
              //$log.debug(vm.dataFunc);
              onTimeRunningCompareFactory.getOnTimeChart(vm.dataFunc, vm.onTimeGraphLabels);
            }).catch(function (response) {
              vm.error1=true;
              vm.onTimeErrorMessage = response.data + "<h1> OnTime Chart error </h1>";
              // $scope.myText = response.data;
              // var myEl = angular.element( document.querySelector( '#chart1' ) );
              // myEl.text("An error has occurred.\n HTTP error: " + response.data + "status: "+response.status + "(" + response.statusText + ")")
              // $log.debug("OnTime Url response: " + response.status);
            });
            break;
          }
        case "2" : {
            var speedDistanceUrl = UrlGenerator.getData().speedDistanceUrl;
            // $log.debug(speedDistanceUrl);
            vm.promise = httpCallsService.getByUrl(speedDistanceUrl)
            .then(function (data){
              vm.error2=false;
              vm.speedDistanceresponse = data;

              speedDistanceData_All(vm.speedDistanceresponse);
              vm.speedDistanceData_Kph = speedDistanceDataFactory.getSpeedDistanceData_Kph();
              vm.routeLinks =  vm.speedDistanceData_Kph.links;
              vm.speedDistanceLinks.selected= vm.routeLinks[0];

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
              vm.SpeedDistanceGraphLabels= speedDistanceDataFactory.getSpeedDistanceGraphLabels();
              speedDistanceChartFactory.getSpeedDistanceChart(vm.speedDistanceData_Kph, vm.SpeedDistanceGraphLabels);
              speedDistanceChartFactory.setSDMarker(50);
            }).catch(function (response) {
              vm.error2=true;
              vm.speedDistanceErrorMessage = response.data+ "<h1> sd Chart error </h1>";
              // var myEl = angular.element( document.querySelector( '#chart2') );
              // myEl.text('An error has occurred.\n HTTP error: '+ response.data + ' status: '+response.status + '(' + response.statusText + ')')
              // vm.errormessage= "An error has occurred.\n HTTP error: " + response.data + "</br> status: "+response.status + "(" + response.statusText + ")"
              // $log.debug("An error has occurred.\n HTTP error: " + response.data + "</br> status: "+response.status + "(" + response.statusText + ")");
            });
            break;
          }
          default: {
            // $log.debug("inside switch")
          }
        }

      });

    function speedDistanceData_All (data){
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
      }if (x == 1) {
        return 'views/OnTimeRunningChart.tmpl.html'
      } if(x == 2){
        return 'views/SpeedDistanceChart.tmpl.html'
      }else return ''

    };


    vm.checkedItems = UtilityService.getCheckedItems();

    vm.checkboxModel = function(key){
      if(!$scope[key]){
        //do something
        energySummaryCompareFactory.setEnergySummaryChart(energySummaryFunc)
        return;
      }
      //do nothing
    };
    vm.links={};
    vm.energySummaryLinksOnselect = function () {
      // $log.debug(vm.links.selected);
      UtilityService.addCheckedItems(vm.links.selected);
      vm.newenergySummaryData = energySummaryCompareFactory.getEnergySummarylinksData(vm.response0.energySummaryLink1, vm.links.selected);
      vm.newEnergySummaryTotal = energySummaryCompareFactory.getEnergySummarySumofLinks(vm.newenergySummaryData);
      // $log.debug(vm.newEnergySummaryTotal);
      energySummaryCompareFactory.setEnergySummaryChart(vm.newEnergySummaryTotal);
    };

    vm.speedDistanceLinkOnselect = function(selected) {
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
      if(_.contains(vm.speedDistanceData_Kph.links, selected)){
        // $log.debug(_.indexOf(vm.speedDistanceData_Kph.links, selected))
        if(vm.radioModel === 'Kph'){
          // $log.debug(vm.radioModel)
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Kph, index)
      }else if(vm.radioModel === 'Mph'){
        // $log.debug(vm.radioModel)
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Mph, index)
        speedDistanceChartFactory.setSDMarker(50);
      }
      }
    }



    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function(newValue, oldValue){
      if(newValue !== oldValue){
        if(newValue == 'Kph'){
        vm.speedDistanceLinks.selected=vm.routeLinks[0]
        var indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
        // $log.debug(indexSel);
        speedDistanceChartFactory.setSpeedDistanceKph(vm.speedDistanceData_Kph, indexSel)
      }else{
        indexSel = _.indexOf(vm.routeLinks, vm.speedDistanceLinks.selected)
        // $log.debug(indexSel);
        // $log.debug(vm.speedDistanceLinks.selected)
        speedDistanceChartFactory.setSpeedDistanceMph(vm.speedDistanceData_Mph, indexSel)
      }
      }
      
    })

    vm.SpeedUnit = function(value){
      vm.getSpeedData = speedDistanceDataFactory.getSpeedDistanceData_Kph() 
      $log.debug(vm.getSpeedData.flatoutDriving[0]);
    }
    
  }
})();
