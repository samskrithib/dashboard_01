/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('energySummaryFactory', energySummaryFactory)

    function energySummaryFactory($log, $window, $filter, chartColors) {

        var EnergySummaryChart;
        return {

            //------------------------------Graph Labels --------------------------------------------------//
            getEnergySummaryGraphLabels: function () {
                var graphLabelsAndTitles = {
                    "xAxisLabels": [
                        "Actual Driving & Actual Time",
                        "Eco Driving & Actual Time (Achievable)",
                        "Eco Driving & On-Time Running (Optimum)"
                    ],
                    "yAxisLabel": "Fuel (litres)",
                    "graphTitle": "Actual vs Achievable Fuel Consumption",
                    "seriesLabels": null
                }
                return graphLabelsAndTitles;
            },

            //------------------------------Generate c3 chart----------------------------------------------//
            getEnergySummaryChart: function (energySummary, graphLabels, graphIndicator) {
                EnergySummaryChart = c3.generate({
                    bindto: '#chart1',
                    size: {
                        height: 200
                    },
                    data: {
                        json: energySummary,
                        keys: {
                            value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
                        },
                        type: 'bar',
                        labels: true,
                        colors: chartColors.energySummaryChartColors(graphIndicator)
                    },
                    title: {
                        text: graphLabels.graphTitle
                    },

                    legend: {
                        show: true,
                    },
                    axis: {
                        x: {
                            type: 'category',
                            //   categories: graphLabels.xAxisLabels,
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
                            ratio: 0.3 // this makes bar width 30% of length between ticks
                        }
                    },
                    grid: {
                        lines: {
                            front: true
                        },
                        y: {
                            lines: [
                                { value: energySummary[0].targetEnergyConsumption, text: 'Energy Target ' + energySummary[0].targetEnergyConsumption, position: 'end' }
                            ]
                        }
                    }
                });
            },

            setEnergySummaryChart: function (energySummary, graphIndicator) {
                EnergySummaryChart.load({
                    json: energySummary,
                    keys: {
                         value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
                    },
                    colors: chartColors.energySummaryChartColors(graphIndicator)
                });
            },




            toggleEnergyTarget: function (isOn) {
                if (isOn) {
                    d3.selectAll('.c3-grid line')
                        .style('visibility', 'visible')
                    d3.selectAll('.c3-ygrid-line text')
                        .style('visibility', 'visible')
                } else {
                    d3.selectAll('.c3-grid line')
                        .style('visibility', 'hidden')
                    d3.selectAll('.c3-ygrid-line text')
                        .style('visibility', 'hidden')
                }

            }


        }
    }
})();

