/** Created by Samskrithi on 18/11/2016. */

(function() {
  'use strict';
  angular
  .module('dassimFrontendV03')
  .service('latenessSummaryCompareFactory', latenessSummaryCompareFactory);
  function latenessSummaryCompareFactory($log, $window) {

    return{
        getLatenessSummaryData: function(latenessSummaries){
            $log.debug(latenessSummaries)
        },
     
// Labels for lateness summary report
      getlatenessSummaryChartLabels: function (data) {
        var graphLabelsAndTitles = {
          "xAxisLabels": "",
          "yAxisLabel": "Lateness (seconds)",
        //   "graphTitle": "Actual vs Achievable On-Time Running",
          
        };
        return graphLabelsAndTitles;
      },

//------------------------Generate OnTimeRunning chart -----------------------------------------//
      getLatenessSummaryChart: function (data, graphLabels) {
        var latenessSummaryChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 400
          },
          data: {
            
         },

         bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
           
          },
          
       });
      }

    }
  }
})();

