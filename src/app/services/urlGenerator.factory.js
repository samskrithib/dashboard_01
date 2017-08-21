/** Created by Samskrithi on 10/14/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('UrlGenerator', function UrlGenerator($filter, $log, UtilityService) {
      var url, viewRunsUrl, subtitle, TTAdherencePercentile, TTAdherenceTrackTrains, dwellTimesUrl, routeIdUrl, trainGraphPageIdUrl;
      var modifiedData = {};
      var compareRunsUrl, compareRunsSubtitle;
      return {
        generateTrainTimesUrl: function (a, b, c) {
          url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
          return url;
        },

        generateReportsUrl: function (date, time, from, to) {
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          // speedDistanceUrl = 'speeddistancegraph?plannedDepDateTime=' + date + ' ' + time + '&originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc;
          subtitle = from.locationName + ' to ' + to.locationName + ' at ' + time + ' on ' + formatdate;
          viewRunsUrl = 'driver-runs/single-run?scheduledDepDateTime=' + formatdate + ' ' + time + '&originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc
          // viewRunsUrl = 'assets/UnitPerformance_updated.json';

          // return viewRunsUrl;
        },
        generateDwellTimesUrl: function (date, time, from, to) {
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          dwellTimesUrl = 'dwelltimeReports/perJourney?originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc + '&scheduledDepDateTime=' + formatdate + ' ' + time;
        },
        getDwellTimesUrl: function () {
          return dwellTimesUrl;
        },
        getData: function () {
          // $log.debug(viewRunsUrl)
          return {
            subtitle: subtitle,
            viewRunsUrl: viewRunsUrl
          }
        },

        generateTTAdherenceUrls: function (data) {
          var getTab = UtilityService.getCheckedItems();
          // $log.info("in url" + getTab)
          modifiedData.fromStation = data.fromStation;
          modifiedData.toStation = data.toStation;
          modifiedData.fromDate = $filter('date')(data.fromDate, 'yyyy-MM-dd')
          modifiedData.toDate = $filter('date')(data.toDate, 'yyyy-MM-dd')
          if (data.startTime) {
            modifiedData.fromTime = $filter('date')(data.startTime, 'HH:mm:ss')
          } else {
            modifiedData.fromTime = $filter('date')(data.fromTime, 'HH:mm:ss')
          }
          if (data.endTime) {
            modifiedData.toTime = $filter('date')(data.endTime, 'HH:mm:ss')
          } else {
            modifiedData.toTime = $filter('date')(data.toTime, 'HH:mm:ss')
          }

          modifiedData.fromRecord = data.fromRecord;
          
          if (data.daysRange) {
            var numOfDays = UtilityService.numberOfDaysBetweenDates(data.toDate, data.fromDate)
            if (numOfDays < 8) {
              if (numOfDays <= data.daysRange.length) {
                var array = UtilityService.daysOfDatesSelected(data.fromDate, data.toDate, data.daysRange)
                var newAray = _.intersection(data.daysRange, array)
                // $log.info(newAray)
                modifiedData.daysRange = newAray.toString();
              } else if (data.daysRange.length == 2) {
                var array = UtilityService.daysOfDatesSelected(data.fromDate, data.toDate, data.daysRange)
                var newAray = _.intersection(data.daysRange, array)
                // $log.info(newAray)
                modifiedData.daysRange = newAray.toString();
              }
              else {
                modifiedData.daysRange = data.daysRange.toString();
              }
            }
            modifiedData.daysOfTheWeek = data.daysRange.toString();
          } else {
            modifiedData.daysOfTheWeek = data.daysOfTheWeek.toString();
          }

          if (getTab == 'TTPercentile') {
            modifiedData.percentile = data.percentileSelected.split("%")
            modifiedData.percentileSingle = modifiedData.percentile[0];
            // percentile=80
            TTAdherencePercentile = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&percentile=" + modifiedData.percentile[0] + "&pageId=0";
          } else {
            TTAdherenceTrackTrains = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&pageId=0";
          }
          return {
            percentile: TTAdherencePercentile,
            trackTrains: TTAdherenceTrackTrains
          }
        },

        generateRouteIdUrl: function (routeId) {
          routeIdUrl = "traingraphs-route?routeId=" + routeId;
          return routeIdUrl;
        },
        generatePageIdUrl: function (pageId) {
          trainGraphPageIdUrl = "traingraphs-paging?pageId=" + pageId
          return trainGraphPageIdUrl;
        },
        getTTAdherenceUrl: function () {
          return {
            percentile: TTAdherencePercentile,
            trackTrains: TTAdherenceTrackTrains,
            data: modifiedData,
            routeIdUrl: routeIdUrl
          }
        },

        generateCompareRunsUrl: function(data){
          compareRunsSubtitle =  data[0].origin.locationName + " - " +  data[0].destination.locationName
          compareRunsUrl = "driver-runs/multiple-runs?"
          _.each(data, function(val, i){
           var date =  $filter('date')(data[i].date, 'dd-MM-yyyy')
            compareRunsUrl += '&originTiploc='+ data[i].origin.tiploc+ '&destinationTiploc='+data[i].destination.tiploc+"&strScheduledDepDateTime="+ date + " " + data[i].departureTime
          })
          return compareRunsUrl;
        },
        getCompareRunsInputData: function(){
          return{
            compareRunsUrl: compareRunsUrl,
            compareRunsSubtitle: compareRunsSubtitle
          }
        },
        generateCompareStoppingPatternUrl: function(data){
          var url= "driver-runs/compare-two-trains-stopping-pattern?"
          var date1 = $filter('date')(data[0].date, 'dd-MM-yyyy')
          var date2 = $filter('date')(data[1].date, 'dd-MM-yyyy')
          url += 'originTiploc1='+ data[0].origin.tiploc+ '&destinationTiploc1='+data[0].destination.tiploc+"&strScheduledDepDateTime1="+ date1 + " " + data[0].departureTime
          +'&originTiploc2='+ data[1].origin.tiploc+ '&destinationTiploc2='+data[1].destination.tiploc+"&strScheduledDepDateTime2="+ date2 + " " + data[1].departureTime
          return url;

        }

      }
    });
})();
