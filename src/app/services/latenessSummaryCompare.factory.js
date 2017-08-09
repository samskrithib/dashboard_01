/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .service('latenessSummaryCompareFactory', latenessSummaryCompareFactory);

  function latenessSummaryCompareFactory($log, $window, DRIVE_COLORS) {
    var achievableArrivalLatenessInSeconds, actualArrivalEarlinessInSeconds, actualArrivalLatenessInSeconds;
    var latenessSummary_allLinks;
    var latenessSummaryChart;
    return {
      getLatenessSummaryData: function (latenessSummaries) {
        var achievableArrivalLatenessInSeconds_array = [],
          actualArrivalEarlinessInSeconds_array = [],
          actualArrivalLatenessInSeconds_array = [],
          latenessSummaryData = {};
          $log.info(latenessSummaries)
        // _.each(latenessSummaries, function (val, key) {
        //   var LSPJ = latenessSummaries[key]
        //   $log.info(LSPJ)
          //   achievableArrivalLatenessInSeconds = latenessSummaries[key].achievableArrivalLatenessInSeconds
          //   actualArrivalEarlinessInSeconds = latenessSummaries[key].actualArrivalEarlinessInSeconds
          //   actualArrivalLatenessInSeconds = latenessSummaries[key].actualArrivalLatenessInSeconds

          //   achievableArrivalLatenessInSeconds_array.push(achievableArrivalLatenessInSeconds)
          //   actualArrivalEarlinessInSeconds_array.push(actualArrivalEarlinessInSeconds)
          //   actualArrivalLatenessInSeconds_array.push(actualArrivalLatenessInSeconds)
        // })
        // latenessSummaryData = {
        //   'actualArrivalLatenessInSeconds': actualArrivalLatenessInSeconds_array,
        //   'actualArrivalEarlinessInSeconds': actualArrivalEarlinessInSeconds_array,
        //   'achievableArrivalLatenessInSeconds': achievableArrivalLatenessInSeconds_array,
        // }
        // $log.info(latenessSummaryData)
        return latenessSummaries;
      },

      getLatenessSummaryLinksData: function (latenessSummaries, linkIndex) {
        var latenessSummaryData_Array = [];

        _.each(latenessSummaries, function (val, key) {
          var LS = latenessSummaries[key].latenessSummaries[linkIndex].latenessSummary
          latenessSummaryData_Array.push(LS)
        })
        $log.info(latenessSummaryData_Array)
        return latenessSummaryData_Array;
      },

      getLatenessSummaryLinks: function (latenessSummaries) {
        latenessSummary_allLinks = _.pluck(latenessSummaries, 'link');
        return (_.pluck(latenessSummaries, 'link'));
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
        latenessSummaryChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 400
          },
          data: {
            json: data,
            keys: {
              // x: 'name',
              value: ['actualArrivalLatenessInSeconds', 'actualArrivalEarlinessInSeconds', 'achievableArrivalLatenessInSeconds']
            },
            type: 'bar',
            labels: true,
            colors: {
              'actualArrivalEarlinessInSeconds': DRIVE_COLORS.blue,
              'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
            }
          },
          axis: {

            y: {
              //min: 0,
              label: {
                text: graphLabels.yAxisLabel,
                position: 'outer-middle'
              },
              padding: {
                top: 100
              }
            }
          },
          bar: {
            width: {
              ratio: 0.3 // this makes bar width 50% of length between ticks
            }

          },

        });
      },

      setLatenessSummaryChart: function (data) {
        latenessSummaryChart.unload({
          done: function () {
            latenessSummaryChart.load({
              json: data,
              keys: {
                value: ['actualArrivalLatenessInSeconds', 'actualArrivalEarlinessInSeconds', 'achievableArrivalLatenessInSeconds'],
              }
            })
          }

        })
      }

    }
  }
})();
