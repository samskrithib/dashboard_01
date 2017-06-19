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
    // $log.debug(vm.getTabs)
    vm.subTitle = subtitle.fromStation.locationName + " - " + subtitle.toStation.locationName +
      "<p>" + subtitle.fromDate + " to " + subtitle.toDate + "</p> " + "<p> Days : " + subtitle.daysOfTheWeek + "</p>"
      + "<p> Time : " + subtitle.fromTime + " - " + subtitle.toTime + "</p>"

    // $log.debug(vm.getTabs)
    if (vm.getTabs == 'TTTrackTrains') {
      var keyxValue = 'unixTime';
      var stinglength = 7;
      var tickFormat = null;
      var tooltipFormat = function (d) {
        var x = moment(d).format("MMMM Do YYYY, h:mm:ss a")
        return x;
      }
      var TTAdherenceTrackTrainsUrl
      if (vm.routesFlag) {
        TTAdherenceTrackTrainsUrl = UtilityService.getCheckedItems()[1]
      }
      else {
        TTAdherenceTrackTrainsUrl = UrlGenerator.getTTAdherenceUrl().trackTrains;
        // $log.debug(TTAdherenceTrackTrainsUrl)
        // var routeIdUrl = UrlGenerator.getTTAdherenceUrl().routeIdUrl;
      }
      vm.promise = httpCallsService.getHeaders(TTAdherenceTrackTrainsUrl)
        // vm.promise = httpCallsService.getByJson("assets/timetableAdherenceGraph.json")
        .then(function (response) {
          vm.response = response.data;
          $log.info(vm.response)
          if (!vm.response) {
            vm.TTAdherenceTrackTrainsError = true;
            vm.TTAdherenceTrackTrainsErrorMessage = response + "<h3> Error Message </h3>"
          } else {
            vm.lines = gridlines(vm.response.timetableAdherenceGraph.timetableAdherenceGraphLocationList);
            trainGraphFactory.getTrainGraphChart(vm.response.timetableAdherenceGraph, keyxValue, tickFormat, tooltipFormat);
            trainGraphFactory.LoadTrainGraphData(vm.response.timetableAdherenceGraph.timetableAdherenceGraphSeriesList, vm.lines, keyxValue, stinglength)

          }
        }).catch(function (response) {
          vm.TTAdherenceTrackTrainsError = true;
          vm.TTAdherenceTrackTrainsErrorMessage = response + "<h3> Error Message </h3>"
        })


    }
    if (vm.getTabs == 'TTPercentile') {
      var keyxValue = 'timeInSeconds';
      var stinglength = 9;
      var tickFormat = function (x) { return moment().startOf('day').seconds(x).format('h:mm:ss a') };
      var tooltipFormat = function (d) {
        var x = moment().startOf('day').seconds(d).format('h:mm:ss a')
        return x;
      }
      var percentileUrl;
      if (vm.routesFlag) {
        percentileUrl = UtilityService.getCheckedItems()[1]
      }
      else {
        //  vm.subTitle += "<p> Percentile Selected : " + subtitle.percentileSingle + "% </p>"
        percentileUrl = UrlGenerator.getTTAdherenceUrl().percentile;
        // $log.debug(percentileUrl)
      }
      vm.promise1 = httpCallsService.getByUrl(percentileUrl)
        // vm.promise1 = httpCallsService.getByJson("assets/timetableAdherenceGraph.json")
        .then(function (response) {
          vm.response = response;
          $log.info(vm.response)

          if (!vm.response) {
            vm.TTadherencePercentileError = true;
            vm.TTadherencePercentileErrorMessage = response + "<h3> Error Message</h3>";
          }
          vm.TTadherencePercentileError = false;
          vm.lines = gridlines(vm.response.timetableAdherenceGraph.timetableAdherenceGraphLocationList);
          trainGraphFactory.getTrainGraphChart(vm.response.timetableAdherenceGraph, keyxValue, tickFormat, tooltipFormat);
          trainGraphFactory.LoadTrainGraphData(vm.response.timetableAdherenceGraph.timetableAdherenceGraphSeriesList, vm.lines, keyxValue, stinglength)

        }).catch(function (response) {
          vm.TTadherencePercentileError = true;
          vm.TTadherencePercentileErrorMessage = response + "<h3> Error Message</h3>";

        })

    }

    function gridlines(data) {
      var lines = [];
      _.each(data, function (val, key) {
        var obj = {};
        obj.value = data[key].distance;
        obj.text = data[key].locationName;
        obj.tiploc = data[key].tiploc;
        lines[lines.length] = obj;
      })
      return lines;
    }
    
    var time = moment().startOf('day').seconds(35040).format('H:mm:ss')
    // $log.info("time: " + time)
    // $log.debug(moment({seconds:'58'}).format("HH:mm:ss"))
    // $log.debug(moment.unix(1318781876).format("h:mm:ss A"))
    // $log.debug(moment([2010, 0, 31, 0, 0, 0]).add(76920).format("h:mm:ss A"))
  }
})();


