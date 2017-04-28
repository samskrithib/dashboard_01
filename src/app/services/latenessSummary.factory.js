/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('latenessSummaryFactory', latenessSummaryFactory)

    function latenessSummaryFactory($log, $window, $filter, chartColors, DRIVE_COLORS) {
        var LatenessSummaryChart;
        return {
            //------------------------------Graph Labels --------------------------------------------------//
            getavgLatenessSummaryChartLabels: function () {
                var graphLabelsAndTitles = {
                    "yAxisLabel": "Average lateness (s)",
                    "graphTitle": "Actual vs Achievable Arrival Lateness",
                    "seriesLabels": {
                        actualArrivalLatenessInSeconds: "Actual Arrival Lateness",
                        actualArrivalEarlinessInSeconds: "Actual Arrival Earliness",
                        achievableArrivalLatenessInSeconds: "Achievable Arrival Lateness"
                    }
                }
                return graphLabelsAndTitles;
            },
            getLatenessSummaryChartLabels: function () {
                var graphLabelsAndTitles = {
                    "yAxisLabel": "Lateness (s)",
                }
                return graphLabelsAndTitles;
            },
            //------------------------------Generate c3 chart----------------------------------------------//
            getLatenessSummaryChart: function (latenessSummary, graphLabels, graphIndicator) {
                LatenessSummaryChart = c3.generate({
                    bindto: '#latenessSummaryChart',
                    size: {
                        height: 300
                    },
                    data: {
                        json: latenessSummary,
                        keys: {
                            value: ['actualArrivalEarlinessInSeconds','actualArrivalLatenessInSeconds', 'achievableArrivalLatenessInSeconds']
                        },
                        type: 'bar',
                        names: graphLabels.seriesLabels,
                        labels: true,
                        colors: {
                            'actualArrivalLatenessInSeconds': function (d) {
                                return chartColors.colors(graphIndicator, d)
                            },
                            'actualArrivalEarlinessInSeconds': function (d) {
                                return chartColors.colors(graphIndicator, d)
                            },
                            'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
                        }
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
                                { value: 0 }
                            ]
                        }
                    }
                });
            },

            setLatenessSummaryChart: function (latenessSummary, graphLabels, graphIndicator) {
                // $log.debug(graphLabels)
                // LatenessSummaryChart.data.names(graphLabels.seriesLabels)
                LatenessSummaryChart.axis.labels({
                    y: graphLabels.yAxisLabel
                })
                LatenessSummaryChart.load({
                    json: latenessSummary,
                    keys: {
                        value: [ 'actualArrivalEarlinessInSeconds','actualArrivalLatenessInSeconds', 'achievableArrivalLatenessInSeconds']
                    },
                    colors: {
                        'actualArrivalLatenessInSeconds': function (d) {
                            return chartColors.colors(graphIndicator, d)
                        },
                        'actualArrivalEarlinessInSeconds': function (d) {
                            return chartColors.colors(graphIndicator, d)
                        },
                        'achievableArrivalLatenessInSeconds': DRIVE_COLORS.green
                    },
                   
                });
                
            },

        }
    }
})();

