/** Created by Samskrithi on 10/14/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('UrlGenerator', function UrlGenerator($filter, $log, UtilityService) {
      var url,viewRunsUrl, subtitle, TTAdherencePercentile, TTAdherenceTrackTrains, dwellTimesUrl, routeIdUrl, trainGraphPageIdUrl;
      var modifiedData = {};
      return {
        generateTrainTimesUrl: function (a, b, c) {
          url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
          return url;
        },

        generateReportsUrl: function (date, time, from, to) {
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          // speedDistanceUrl = 'speeddistancegraph?plannedDepDateTime=' + date + ' ' + time + '&originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc;
          subtitle = from.locationName +' to ' + to.locationName + ' at ' + time + ' on ' + formatdate;
          viewRunsUrl = 'driverRuns/single?scheduledDepDateTime='+formatdate+' '+ time + '&originTiploc='+ from.tiploc + '&destinationTiploc=' +to.tiploc
          // viewRunsUrl = 'assets/UnitPerformance_updated.json';
          
          // return viewRunsUrl;
        },
        generateDwellTimesUrl: function(date, time, from, to){
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          dwellTimesUrl = 'dwelltimeReports/perJourney?originTiploc='+from.tiploc+'&destinationTiploc='+ to.tiploc+'&scheduledDepDateTime='+ formatdate +' '+ time ;
        },
        getDwellTimesUrl: function(){
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
          $log.info("in url"+ getTab)
          modifiedData.fromStation = data.fromStation;
          modifiedData.toStation = data.toStation;
          modifiedData.fromDate = $filter('date')(data.fromDate, 'yyyy-MM-dd')
          modifiedData.toDate = $filter('date')(data.toDate, 'yyyy-MM-dd')
          if(data.startTime){
             modifiedData.fromTime = $filter('date')(data.startTime, 'HH:mm:ss')
          }else{
            modifiedData.fromTime = $filter('date')(data.fromTime, 'HH:mm:ss')
          }
         if(data.endTime){
          modifiedData.toTime = $filter('date')(data.endTime, 'HH:mm:ss')
         }else{
            modifiedData.toTime = $filter('date')(data.toTime, 'HH:mm:ss')
         }
          
          modifiedData.fromRecord = data.fromRecord;
          if(data.serviceCode){
             modifiedData.serviceCodes = data.serviceCode.join();
          }else{
             modifiedData.serviceCodes = data.serviceCodes.join();
          }
          if(data.daysRange){
            modifiedData.daysOfTheWeek = data.daysRange.join(', ');
          }else{
            modifiedData.daysOfTheWeek = data.daysOfTheWeek.join(',');
          }
          
          if (getTab == 'TTPercentile') {
           modifiedData.percentile = data.percentileSelected.split("%")
           modifiedData.percentileSingle = modifiedData.percentile[0];
            // percentile=80
            TTAdherencePercentile = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&serviceCodes=" + modifiedData.serviceCodes + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&percentile=" + modifiedData.percentile[0] + "&pageId=0";
          }else{
            TTAdherenceTrackTrains = "traingraphs-main?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&serviceCodes=" + modifiedData.serviceCodes + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&pageId=0";
          }
          return{
            percentile: TTAdherencePercentile,
            trackTrains: TTAdherenceTrackTrains
          }
        },

        generateRouteIdUrl: function(routeId){
          routeIdUrl = "traingraphs-route?routeId=" + routeId;
          return routeIdUrl;
        },
        generatePageIdUrl: function(pageId){
          trainGraphPageIdUrl = "traingraphs-paging?pageId="+pageId
          return trainGraphPageIdUrl;
        },
        getTTAdherenceUrl: function () {
          return {
            percentile: TTAdherencePercentile,
            trackTrains: TTAdherenceTrackTrains,
            data: modifiedData,
            routeIdUrl : routeIdUrl
          }
        }

      }
    });
})();
