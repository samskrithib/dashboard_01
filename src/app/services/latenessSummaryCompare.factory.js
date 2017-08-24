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
      getLatenessSummaryData: function (data, trainIdentifiers) {
        _.each(data, function (val, key) {
          data[key].name = trainIdentifiers[key];
        })
        // $log.info(data) 
        return data;
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
          latenessSummaryData_Array: latenessSummaryData_Array,
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
          "graphTitle": "Actual vs Achievable Arrival Lateness/Earliness",
          "yAxisLabel": "Lateness (seconds)",
          "seriesLabels": {
            actualArrivalLatenessInSeconds: "Actual Arrival Lateness",
            actualArrivalEarlinessInSeconds: "Actual Arrival Earliness",
            achievableArrivalLatenessInSeconds: "Achievable Arrival Lateness"
          }
          //   "graphTitle": "Actual vs Achievable On-Time Running",

        };
        return graphLabelsAndTitles;
      },

      //------------------------Generate LatenessSummary chart -----------------------------------------//
      getLatenessSummaryChart: function (latenessSummary, graphLabels, performanceIndicators) {
        latenessSummaryChart = c3.generate({
          bindto: '#latenessSummaryChart',
          size: {
            height: 300
          },
          data: {
            json: latenessSummary,
            keys: {
              x: 'name',
              value: ['actualArrivalLatenessInSeconds', 'actualArrivalEarlinessInSeconds', 'achievableArrivalLatenessInSeconds']
            },
            type: 'bar',
            names: graphLabels.seriesLabels,
            labels: true,
            colors: {
              'actualArrivalLatenessInSeconds': function (d) {
                return chartColors.colors([performanceIndicators[d.x]]);
              },
              'actualArrivalEarlinessInSeconds': function (d) {
                return chartColors.colors([performanceIndicators[d.x]]);
              },
              'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
            }
          },
          legend: {
            show: false
          },
          tooltip:{
            // grouped: false,
            order:false
          },
          axis: {
            x: {
              type: 'category',
              // categories: graphLabels.xAxisLabels,
              height: 50
            },
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
                'actualArrivalLatenessInSeconds': function (d) {
                  return chartColors.colors([performanceIndicators[d.x]]);
                },
                'actualArrivalEarlinessInSeconds': function (d) {
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
