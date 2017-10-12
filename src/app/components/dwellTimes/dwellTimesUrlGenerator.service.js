(function () {
  'use strict';
  angular
    .module('dwellTimesModule')
    .factory('dwellTimesUrlGeneratorService', dwellTimesUrlGeneratorService);

  function dwellTimesUrlGeneratorService($filter) {
    var url, dwellTimesUrl;
    return {
      generateTrainTimesUrl: function (a, b, c) {
        url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
        return url;
      },
      generateDwellTimesUrl: function (date, time, from, to) {
        var formatdate = $filter('date')(date, 'dd-MM-yyyy')
        dwellTimesUrl = 'dwelltimeReports/perJourney?originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc + '&scheduledDepDateTime=' + formatdate + ' ' + time;
      },
      getDwellTimesUrl: function () {
        return dwellTimesUrl;
      }
    }
  }
})();
