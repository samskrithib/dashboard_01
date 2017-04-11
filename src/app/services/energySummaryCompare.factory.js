/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('energySummaryCompareFactory', energySummaryCompareFactory);
    function energySummaryCompareFactory($log, $window, $filter) {
        var actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal;
        var energySummaryLinks = [];
        var EnergySummaryChart;
        var blue = '#7cb5ec',
            orange = '#FF7F0E';
        return {
            getEnergySummaryData: function (data) {
                return _.pluck(data, 'energySummary');
            },
            // Data to generate Total or Sum of selected links Energy sumamry report
            getEnergySummarySumofLinks: function (bar) {
                // _.reduce sums up all the values and adds to memo
                actualEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.actualEnergyConsumption; }, 0), 2);
                optimalEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.optimalEnergyConsumption; }, 0), 2);
                onTimeOptimalEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.onTimeOptimalEnergyConsumption; }, 0), 2);
                targetEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.targetEnergyConsumption; }, 0), 2);
                energySummaryLinks = [actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal];
                return energySummaryLinks;
            },
            /// Data for view specific links in Energy summary report
            getEnergySummarylinksData: function (data, links) {
                var arr = [];
                var indexes = [];
                var foo = _.pluck(data, 'link');
                _.each(links, function (val, key) {
                    indexes.push(_.indexOf(foo, links[key]));
                });
                // $log.debug(indexes);
                _.each(indexes, function (val, key) {
                    arr.push(data[indexes[key]].energySummary);
                });
                // $log.debug(arr);
                return arr;
            },

            getEnergySummaryGraphLinks: function (data) {
                return (_.pluck(data, 'link'));
            },

            //------------------------------Graph Labels --------------------------------------------------//
            getEnergySummaryGraphLabels: function () {
                var graphLabelsAndTitles = {
                    "xAxisLabels": [
                        "Actual Driving & Actual Time",
                        "Eco Driving & Actual Time",
                        "Eco Driving & On Time Running"
                    ],
                    "yAxisLabel": "Fuel (litres)",
                    "graphTitle": "Actual vs Achievable Fuel Consumption",
                    "seriesLabels": null
                }
                return graphLabelsAndTitles;
            },
            getGraphLabelsPeriodic: function () {
                var graphLabelsAndTitles = {
                    "xAxisLabels": [
                        "Actual Driving & Actual Time",
                        "Eco Driving & Actual Time",
                        "Eco Driving & On Time Running"
                    ],
                    "yAxisLabel": "Fuel (litres)",
                    "graphTitle": "Actual vs Achievable Fuel Consumption (Total)",
                    "seriesLabels": null
                }
                return graphLabelsAndTitles;
            },
            //------------------------------Generate c3 chart----------------------------------------------//
            getEnergySummaryChart: function (energySummary, graphLabels) {
                EnergySummaryChart = c3.generate({
                    bindto: '#chart0',
                    size: {
                        height: 350
                    },
                    data: {
                        columns: [
                            ['data1', energySummary[0], energySummary[1], energySummary[2]],
                            ['data2', energySummary[1], energySummary[2], energySummary[0]]
                        ],
                        type: 'bar',
                        groups: [
                            ['data1', 'data2']
                        ],
                        labels: {
                            format: function (v) {
                                var screenWidth = $window.innerWidth;
                                if (screenWidth < 786) {
                                    if (v == 0) {
                                        return v;
                                    } else return "";
                                } else if (screenWidth >= 786) {
                                    return v;
                                }
                            }
                        },
                        // colors: {
                        //     'data1': function (d) { return d.value <= energySummary[3] ? blue : orange }
                        // }
                    },
                    title: {
                        text: graphLabels.graphTitle
                    },
                    // color: {
                    //     pattern: [orange, blue]
                    // },
                    legend: {
                        show: true
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: graphLabels.xAxisLabels,
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
                            front: false
                        },
                        y: {
                            lines: [
                                { value: energySummary[3], text: 'Energy Target ' + energySummary[3], position: 'end' }
                            ]
                        }
                    }
                });
            },

            setEnergySummaryChart: function (dataColumns) {
                EnergySummaryChart.load({
                    columns: [
                        ['data1', dataColumns[0], dataColumns[1], dataColumns[2]],
                        ['data2', dataColumns[2], dataColumns[1], dataColumns[0]]
                    ],
                    
                });
                EnergySummaryChart.ygrids([{ value: dataColumns[3], text: 'Energy Target ' + dataColumns[3], position: 'end' }]);
            },


            
        }
    }
})();

