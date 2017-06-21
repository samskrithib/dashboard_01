/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .controller('TrainGraphController', TrainGraphController);

  function TrainGraphController(httpCallsService, UrlGenerator, $q, $scope, $log, UtilityService, trainGraphFactory) {
    var vm = this;

    vm.TTadherencePercentileError = false;
    vm.TTAdherenceTrackTrainsError = false;
    vm.getTabs = UtilityService.getCheckedItems()[0];
    vm.routesFlag = UtilityService.getCheckedItems()[2];
    var subtitle = UrlGenerator.getTTAdherenceUrl().data;
    $log.info(vm.getTabs)
    vm.subTitle = subtitle.fromStation.locationName + " - " + subtitle.toStation.locationName +
      "<p>" + subtitle.fromDate + " to " + subtitle.toDate + "</p> " + "<strong> Days : </strong> " + subtitle.daysOfTheWeek
      + " <strong>| Time :  </strong>" + subtitle.fromTime + " - " + subtitle.toTime

    // $log.debug(vm.getTabs)
    if (vm.getTabs == 'TTTrackTrains') {
      vm.pageHeader = 'Timetable Adherence Track Trains';
      var TTAdherenceTrackTrainsUrl;
      var keyxValue = 'unixTime';
      var stinglength = 7;
      var tickFormat = null;
      var tooltipFormat = function (d) {
        var x = moment(d).format("MMMM Do YYYY, h:mm:ss a")
        return x;
      }
      if (vm.routesFlag) {
        TTAdherenceTrackTrainsUrl = UtilityService.getCheckedItems()[1]
      }
      else {
        TTAdherenceTrackTrainsUrl = UrlGenerator.getTTAdherenceUrl().trackTrains;
      }
      vm.TTUrl = TTAdherenceTrackTrainsUrl;
      vm.totalItems = 7;
      $log.info(vm.currentpage)
    }

    if (vm.getTabs == 'TTPercentile') {
      vm.pageHeader = 'Timetable Adherence Percentiles';
      var keyxValue = 'timeInSeconds';
      var stinglength = 9;
      var tickFormat = function (x) { return moment().startOf('day').seconds(x).format('LT') };
      var tooltipFormat = function (d) {
        var x = moment().startOf('day').seconds(d).format('h:mm:ss a')
        return x;
      }
      vm.subTitle += "<p> Percentile Selected : " + subtitle.percentileSingle + "% </p>"
      var percentileUrl;
      if (vm.routesFlag) {
        percentileUrl = UtilityService.getCheckedItems()[1]
      }
      else {
        percentileUrl = UrlGenerator.getTTAdherenceUrl().percentile;
      }

      vm.TTUrl = percentileUrl;
    }

    vm.promise = httpCallsService.getHeaders(vm.TTUrl)
      // vm.promise = httpCallsService.getByJson("assets/timetableAdherenceGraph.json")
      .then(function (response) {
        vm.response = response.data;
        vm.formData = vm.response.timetableAdherenceInputs;
        
        if (!vm.response) {
          vm.TTAdherenceTrackTrainsError = true;
          vm.TTAdherenceTrackTrainsErrorMessage = response.data + "<h3> Error Message </h3>"
        } else {
          vm.lines = gridlines(vm.response.timetableAdherenceGraph.timetableAdherenceGraphLocationList);
          trainGraphFactory.getTrainGraphChart(vm.response.timetableAdherenceGraph, keyxValue, tickFormat, tooltipFormat);
          trainGraphFactory.LoadTrainGraphData(vm.response.timetableAdherenceGraph.timetableAdherenceGraphSeriesList, vm.lines, keyxValue, stinglength)

        }
      }).catch(function (response) {
        vm.TTAdherenceTrackTrainsError = true;
        vm.TTAdherenceTrackTrainsErrorMessage = response.data + "<h3> Error Message </h3>"
      })

    vm.pageOnclick = function (currentpage) {

      vm.routesFlag= false;
      $log.info(currentpage)
      vm.formData.fromStation = {"locationName": vm.formData.fromLocation, "tiploc": vm.formData.fromTiploc}
      vm.formData.toStation = {"locationName": vm.formData.toLocation, "tiploc": vm.formData.toTiploc}
      $log.info(vm.formData)
      UtilityService.clean();
      UtilityService.addCheckedItems(vm.getTabs);
      vm.newUrl= UrlGenerator.generateTTAdherenceUrls(vm.formData, currentpage).trackTrains
      $log.info(vm.newUrl)

      httpCallsService.getHeaders(vm.newUrl)
      .then(function(response){
        $log.info(response)
      })
    }



    function gridlines(data) {
      var lines = [];
      _.each(data, function (val, key) {
        var obj = {};
        obj.value = data[key].distanceFromFromLocationInKms;
        obj.text = data[key].locationName;
        obj.tiploc = data[key].tiploc;
        lines[lines.length] = obj;
      })
      return lines;
    }


  }
})();


