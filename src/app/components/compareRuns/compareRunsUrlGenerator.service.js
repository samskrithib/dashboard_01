(function () {
  'use strict';
  angular
    .module('compareRunsModule')
    .factory('compareRunsUrlGeneratorService', compareRunsUrlGeneratorService);

  function compareRunsUrlGeneratorService($filter) {
    var url;
    var compareRunsUrl, compareRunsSubtitle;
    return{
      console: function () {
        console.log('compareRunsUrlGeneratorService')
      },
      generateTrainTimesUrl: function (a, b, c) {
        url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
        return url;
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
  }
})();
