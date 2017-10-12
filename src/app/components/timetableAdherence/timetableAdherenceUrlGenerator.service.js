(function () {
  'use strict';
  angular
    .module('timetableAdherenceModule')
    .factory('timetableAdherenceUrlGeneratorService', timetableAdherenceUrlGeneratorService);

  function timetableAdherenceUrlGeneratorService(UtilityService, $filter) {
    var TTAdherencePercentile, TTAdherenceTrackTrains, routeIdUrl, trainGraphPageIdUrl;
    var modifiedData = {};
    return{
      console: function () {
        console.log("timetableAdherenceUrlGeneratorService")
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
          }else{
            modifiedData.daysRange = data.daysRange.toString();
          }
          modifiedData.daysOfTheWeek = data.daysRange.toString();

        } else {
          modifiedData.daysOfTheWeek = data.daysOfTheWeek.toString();
          modifiedData.daysRange = data.daysOfTheWeek.toString();
        }

        if (getTab == 'TTPercentile') {
          modifiedData.percentile = data.percentileSelected.split("%")
          modifiedData.percentileSingle = modifiedData.percentile[0];
          // percentile=80
          TTAdherencePercentile = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&percentile=" + modifiedData.percentile[0] + "&pageId=0";
        } else {
          TTAdherenceTrackTrains = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&pageId=0";
        }

        console.log("generateTTAdherenceUrls", TTAdherencePercentile)
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
        trainGraphPageIdUrl = "traingraphs-paging?pageId=" + pageId;
        return trainGraphPageIdUrl;
      },
      getTTAdherenceUrl: function () {
        return {
          percentile: TTAdherencePercentile,
          trackTrains: TTAdherenceTrackTrains,
          data: modifiedData,
          routeIdUrl: routeIdUrl
        }
      }
    }
  };
})();
