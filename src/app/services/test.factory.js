/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('testFactory', testFactory);
    function testFactory($log, UtilityService) {
        var speedDistanceChart;
        return {

            getTestTrainGraph: function (data) {
                speedDistanceChart = c3.generate({
                    bindto: '#chart',
                    size: {
                        height: 400
                    },
                    data: {
                        json: data[1].actualSpeedAndPositionList,
                        keys: {
                            x: 'position',
                            value: ['speed']
                        },
                        xSort: false,
                        names: {
                            'speed.actualDrving': 'Actual Driving'
                        },

                    },
                    axis: {
                        x: {
                            tick: {
                                centered: true,
                                fit: false,
                                culling: {
                                    max: 5
                                }
                            }
                        },
                        y2: {
                            show: true
                        }
                    }

                })
            },

            LoadTrainGraphData: function (data) {
                speedDistanceChart.load({
                    json: data[0].speedRestrictionList,
                    keys: {
                        x: 'beginPoint',
                        value: ['speedRestrictionValue']
                    },
                    type: 'step'
                })
                speedDistanceChart.load({
                    json: data[1].flatoutSpeedAndPositionList,
                    keys: {
                        x: 'position',
                        value: ['speed']
                    },
                    names: {
                        'speed.flatoutDriving': 'flatout'
                    }
                })
                speedDistanceChart.load({
                    json: data[0].optimalSpeedAndPositionList,
                    keys: {
                        x: 'position',
                        value: ['speed.optimalDriving']
                    },
                    names: {
                        'speed.optimalDriving': 'optimalDriving'
                    }
                })

                speedDistanceChart.load({
                    json: data[0].scaledElevationList,
                    keys: {
                        x: 'position',
                        value: ['scaledElevation']
                    },
                    axes: {
                        'scaledElevation': 'y2'
                    }
                })

            }
        }
    }
})();

