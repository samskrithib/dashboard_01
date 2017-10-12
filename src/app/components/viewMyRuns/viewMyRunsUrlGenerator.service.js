(function () {
  'use strict';
  angular
    .module('viewMyRunsModule')
    .factory('viewMyRunsUrlGeneratorService', viewMyRunsUrlGeneratorService);

  function viewMyRunsUrlGeneratorService($filter) {
    var url, viewRunsUrl, subtitle;
    return {
      console: function () {
        console.log("viewMyRunsUrlGeneratorService")
      },
      generateTrainTimesUrl: function (a, b, c) {
        url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
        return url;
      },
      generateReportsUrl: function (date, time, from, to) {
        var formatdate = $filter('date')(date, 'dd-MM-yyyy')
        subtitle = from.locationName + ' to ' + to.locationName + ' at ' + time + ' on ' + formatdate;
        viewRunsUrl = 'driver-runs/single-run?scheduledDepDateTime=' + formatdate + ' ' + time + '&originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc
        // viewRunsUrl = 'assets/UnitPerformance_updated.json';

        // return viewRunsUrl;
      },
      getData: function () {
        // $log.debug(viewRunsUrl)
        return {
          subtitle: subtitle,
          viewRunsUrl: viewRunsUrl
        }
      }
    }
  }
})();
