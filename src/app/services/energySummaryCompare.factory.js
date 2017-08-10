/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('energySummaryCompareFactory', energySummaryCompareFactory);

  function energySummaryCompareFactory($log, $window, $filter, energySummaryBarColors, chartColors, DRIVE_COLORS) {
    var actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal;
    var energySummaryValues = [];
    var EnergySummaryChart;
    var energySummaryDataAllRuns_array = [];
    var eachRunallLinks;
    return {
      getEnergySummaryData: function (energySummaries) {
        energySummaryDataAllRuns_array = [];
        _.each(energySummaries, function (val, key) {
          eachRunallLinks = _.pluck(energySummaries[key].energySummaryLinks, 'energySummary');
          energySummaryDataAllRuns_array.push(eachRunallLinks)
        })
        // $log.debug(energySummaryDataAllRuns_array);
        return energySummaryDataAllRuns_array;
      },

      /// Data for view specific links in Energy summary report
      getenergySummaryLinksData: function (data, linkIndex, indicatorsData) {
        var energySummaryLinksData_array = [];
        var energyPerformanceIndicators_array = [];
        $log.info(indicatorsData)
        _.each(data, function (val, key) {
          var ES = data[key].energySummaryLinks[linkIndex].energySummary
          var energyPerformanceIndicatorPerLink = indicatorsData[key].trainUnitPerformancePerLink[linkIndex].energyPerformanceIndicator
          var energySummaryValues = {
            'name': 'Run_' + (key + 1),
            'actualEnergyConsumption': ES.actualEnergyConsumption,
            'optimalEnergyConsumption': ES.optimalEnergyConsumption,
            'onTimeOptimalEnergyConsumption': ES.onTimeOptimalEnergyConsumption,
            'targetEnergyConsumption': ES.targetEnergyConsumption
          };
          energySummaryLinksData_array.push(energySummaryValues)
         energyPerformanceIndicators_array.push(energyPerformanceIndicatorPerLink)
        })
        // $log.info(energySummaryLinksData_array)
        // return energySummaryLinksData_array
        return {
          energySummaryLinksData_array: energySummaryLinksData_array,
          energyPerformanceIndicators_array: energyPerformanceIndicators_array
        }
      },

      getEnergySummaryGraphLinks: function (data) {
        return (_.pluck(data, 'link'));
      },

      getEnergySummaryGraphIndicators: function (energySummaries) {

      },

      //------------------------------Graph Labels --------------------------------------------------//
      getEnergySummaryGraphLabels: function () {
        var graphLabelsAndTitles = {
          "xAxisLabels": {
            actualEnergyConsumption: "Actual Driving & Actual Time",
            optimalEnergyConsumption: "Eco Driving & Actual Time",
            onTimeOptimalEnergyConsumption: "Eco Driving & On-Time Running"
          },
          "yAxisLabel": "Fuel (litres)",
          "graphTitle": "Actual vs Achievable Fuel Consumption",
          "seriesLabels": null
        }
        return graphLabelsAndTitles;
      },

      //------------------------------Generate c3 chart----------------------------------------------//
      getEnergySummaryChart: function (energySummary, graphLabels, performanceIndicators) {
        EnergySummaryChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 350
          },
          data: {
            json: energySummary,
            keys: {
              // x: 'name',
              value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
            },
            type: 'bar',
            names: graphLabels.xAxisLabels,
            labels: true,
            colors: {
              'actualEnergyConsumption': function (d) {
                return chartColors.colors([performanceIndicators[d.x]]);
              },
              'optimalEnergyConsumption': function (d) {
                return DRIVE_COLORS.green
              },
              'onTimeOptimalEnergyConsumption': function (d) {
                return DRIVE_COLORS.green_light
              }
            },
            // colors: energySummaryBarColors.barColors_JsonInput(performanceIndicators)
          },
          title: {
            text: graphLabels.graphTitle
          },

          legend: {
            show: true
          },
          axis: {
            x: {
              type: 'category',
              // categories: graphLabels.xAxisLabels,
              height: 50
            },
            y: {
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
              ratio: 0.3 // this makes bar width 30% of length between ticks
            }
          }

        });
      },


      setEnergySummaryChart: function (dataColumns, performanceIndicators) {
        EnergySummaryChart.load({
          json: dataColumns,
          keys: {
            // x: 'name',
            value: ['actualEnergyConsumption', 'onTimeOptimalEnergyConsumption', 'optimalEnergyConsumption']
          },
          colors: {
              'actualEnergyConsumption': function (d) {
                return chartColors.colors([performanceIndicators[d.x]]);
              },
              'optimalEnergyConsumption': function (d) {
                return DRIVE_COLORS.green
              },
              'onTimeOptimalEnergyConsumption': function (d) {
                return DRIVE_COLORS.green_light
              }
            }

        });
      },



    }
  }
})();
