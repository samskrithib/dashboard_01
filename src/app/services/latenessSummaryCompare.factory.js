/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .service('latenessSummaryCompareFactory', latenessSummaryCompareFactory);

  function latenessSummaryCompareFactory($log, $window, DRIVE_COLORS, chartColors) {
    var achievableArrivalLatenessInSeconds, actualArrivalEarlinessInSeconds, actualArrivalLatenessInSeconds;
    var latenessSummary_allLinks;
    var latenessSummaryChart;
    return {
      getLatenessSummaryData: function (latenessSummaries) {
        var achievableArrivalLatenessInSeconds_array = [],
          actualArrivalEarlinessInSeconds_array = [],
          actualArrivalLatenessInSeconds_array = [],
          latenessSummaryData = {};
        return latenessSummaries;
      },

      getLatenessSummaryLinksData: function (latenessSummaries, linkIndex, indicatorsData) {
        var latenessSummaryData_Array = [];
        var runtimePerformanceIndicators = []
        _.each(latenessSummaries, function (val, key) {
          var LS = latenessSummaries[key].latenessSummaries[linkIndex].latenessSummary
          var runtimePerfromanceIndicatorsPerLink = indicatorsData[key].trainUnitPerformancePerLink[linkIndex].runtimePerformanceIndicator
          latenessSummaryData_Array.push(LS)
          runtimePerformanceIndicators.push(runtimePerfromanceIndicatorsPerLink)
          // $log.info(runtimePerformanceIndicators)
        })
        // $log.info(latenessSummaryData_Array)
        return {
          latenessSummaryData_Array:latenessSummaryData_Array,
          runtimePerformanceIndicators: runtimePerformanceIndicators
        };
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
      getLatenessSummaryChart: function (data, graphLabels, performanceIndicators) {
        latenessSummaryChart = c3.generate({
          bindto: '#latenessSummaryChart',
          size: {
            height: 300
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
              'actualArrivalLatenessInSeconds':function(d) {
                 return chartColors.colors([performanceIndicators[d.x]]);
              },
              'actualArrivalEarlinessInSeconds': function(d) {
                 return chartColors.colors([performanceIndicators[d.x]]);
              },
              'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
            }
          },
          legend: {
            show: false
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

      setLatenessSummaryChart: function (data, performanceIndicators) {
        latenessSummaryChart.unload({
          done: function () {
            latenessSummaryChart.load({
              json: data,
              keys: {
                value: ['actualArrivalLatenessInSeconds', 'actualArrivalEarlinessInSeconds', 'achievableArrivalLatenessInSeconds'],
              },
              colors: {
              'actualArrivalLatenessInSeconds':function(d) {
                 return chartColors.colors([performanceIndicators[d.x]]);
              },
              'actualArrivalEarlinessInSeconds': function(d) {
                 return chartColors.colors([performanceIndicators[d.x]]);
              },
              'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
            }
            })
          }

        })
      }

    }
  }
})();
