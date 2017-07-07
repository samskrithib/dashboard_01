/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .controller('TrainGraphController', TrainGraphController);

  function TrainGraphController(httpCallsService, testFactory, UrlGenerator, $q, $scope, $log, UtilityService, trainGraphFactory) {
    var vm = this;
    vm.isCollapsed = false;
    vm.percentilesList = [
      '10%', '20%', '30%', '40%', '50%',
      '60%', '70%', '75%', '80%', '85%', '90%', '95%', '100%',
    ]
    // floating_Label();
    vm.currentPage = '1';
    $log.info(vm.currentpage)
    vm.TTadherencePercentileError = false;
    vm.TTAdherenceTrackTrainsError = false;
    vm.getTabs = UtilityService.getCheckedItems()[0];
    vm.routesFlag = UtilityService.getCheckedItems()[2];
    var subtitle = UrlGenerator.getTTAdherenceUrl().data;
    $log.info(vm.getTabs)
    vm.subTitle = subtitle.fromStation.locationName + "  to  " + subtitle.toStation.locationName +
      "<p>" + subtitle.fromDate + " to " + subtitle.toDate + "</p> " + "<strong> Days : </strong> " + subtitle.daysOfTheWeek
      + " <strong>| Time :  </strong>" + subtitle.fromTime + " - " + subtitle.toTime

    if (vm.getTabs == 'TTTrackTrains') {
      vm.pageHeader = 'Timetable Adherence Track Trains';
      var TTAdherenceTrackTrainsUrl;
      var keyxValue = 'unixTime';
      var stinglength = 7;
      var tickFormat = function (x) { return moment(x).format('M/D LT') };
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

    if (vm.TTUrl) {
      vm.promise = httpCallsService.getHeaders(vm.TTUrl)
        // vm.promise = httpCallsService.getByJson("assets/trainGraph_PerfomranceTest.json")
        .then(function (response) {
          vm.response = response.data;
          // $log.info(response)
          if (!vm.response) {
            vm.TTAdherenceTrackTrainsError = true;
            vm.TTAdherenceTrackTrainsErrorMessage = response.statusText + "<h3> Error Message </h3>"
          } else {
            $log.info(keyxValue)
            vm.lines = gridlines(vm.response.timetableAdherenceGraph.timetableAdherenceGraphLocationList);
            /* Performance Test */
            var modData = testFactory.getDataFormat(vm.response.timetableAdherenceGraph.timetableAdherenceGraphSeriesList, keyxValue)
            testFactory.getTrainGraphChart(modData, tickFormat, tooltipFormat, vm.lines)
            /*End */
            
            // trainGraphFactory.getTrainGraphChart(vm.response.timetableAdherenceGraph, keyxValue, tickFormat, tooltipFormat, vm.lines);
            // trainGraphFactory.LoadTrainGraphData(vm.response.timetableAdherenceGraph.timetableAdherenceGraphSeriesList, vm.lines, keyxValue, stinglength)
            vm.totalItems = vm.response.timetableAdherenceGraph.totalRecords;
          }

        }).catch(function (error) {
          $log.info(error)
          vm.TTAdherenceTrackTrainsError = true;
          vm.TTAdherenceTrackTrainsErrorMessage = error.statusText + "<h3> Error Message </h3>"
        })

    }
    vm.pageChanged = function (currentpage) {
      var pageId = currentpage - 1;
      vm.routesFlag = false;
      var trainGraphPageIdUrl = UrlGenerator.generatePageIdUrl(pageId);
      $log.info(trainGraphPageIdUrl)
      httpCallsService.getHeaders(trainGraphPageIdUrl)
        .then(function (response) {
          vm.pageResponse = response.data;
          $log.info(vm.pageResponse)
          var data = vm.pageResponse.timetableAdherenceGraph.timetableAdherenceGraphSeriesList
          testFactory.LoadTrainGraphData(data, vm.lines, keyxValue)
        }).catch(function (error) {
          $log.info(error)
          vm.TTAdherenceTrackTrainsError = true;
          vm.TTAdherenceTrackTrainsErrorMessage = error.statusText + "<h3> Error Message </h3>"
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


