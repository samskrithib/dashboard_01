/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('unitPerformanceScoreCompareFactory', unitPerformanceScoreCompareFactory)

  function unitPerformanceScoreCompareFactory($log, $window, $filter, DRIVE_COLORS, chartColors) {
    var unitPerformanceScoreChart;
    var indicatorVar = 'performance'
    return {
      //------------------------------Graph Labels --------------------------------------------------//
      getUnitPerformanceScoreChartLabels: function () {
        var chartLabelsAndTitles = {
          "yAxisLabel": "%",
          "chartTitle": "Unit Performance Score",
          "seriesLabels": null
        }
        return chartLabelsAndTitles;
      },
      getUnitPerfromanceLinksData: function (data, linkIndex) {
        var array = [];
        var performanceIndicators = [];
        _.each(data, function (val, key) {
          var UPS = data[key].trainUnitPerformancePerLink[linkIndex]
          array.push(UPS)
          performanceIndicators.push(UPS.linkPerformanceIndicator)
        })
        return {
          array: array,
          performanceIndicators: performanceIndicators
        };
      },
      //------------------------------Generate c3 chart----------------------------------------------//
      getUnitPerformanceScoreChart: function (unitPerformanceScores, chartLabels, performanceIndicators) {
        unitPerformanceScoreChart = c3.generate({
          bindto: '#chart0',
          size: {
            height: 350
          },
          data: {
            json: unitPerformanceScores,
            keys: {
              value: ['percentageScore']
            },
            xSort: false,
            type: 'bar',
            labels: true,
            colors: {
              'percentageScore': function (d) {
                return chartColors.colors([performanceIndicators[d.x]]);
              }
            }
          },
          legend: {
            show: false
          },
          title: {
            text: chartLabels.chartTitle
          },
          axis: {
            x: {
              tick: {
                format: function () {
                  return ''
                }
              },
              type: 'category',
              height: 50
            },
            y: {
              //min: 0,
              label: {
                text: chartLabels.yAxisLabel,
                position: 'outer-middle'
              },
              padding: {
                top: 100
              }
            }
          },
          bar: {
            width: {
              ratio: 0.1 // this makes bar width 30% of length between ticks
            }
          },
          grid: {
            lines: {
              front: true
            }

          }
        });
      },

      setUnitPerformanceScoreChart: function (unitPerformanceScores, performanceIndicatorsArray) {
        // $log.info('PA : ' + performanceIndicatorsArray)
        unitPerformanceScoreChart.load({
          json: unitPerformanceScores,
          keys: {
            value: ['percentageScore']
          },
          colors: {
            'percentageScore': function (d) {
              //   $log.info(d, chartColors.colors([performanceIndicatorsArray[d.x]]))
              return chartColors.colors([performanceIndicatorsArray[d.x]]);
              //   return DRIVE_COLORS.orange;
            }
          }
        })
      }

    }
  }
})();
