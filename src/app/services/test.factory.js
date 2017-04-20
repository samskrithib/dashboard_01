/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('testFactory', testFactory);
    function testFactory($log, UtilityService, DRIVE_COLORS) {
        var lateness_EnergyChart;
        var latenessChart;
        return {

            getTestChart: function (data) {
                lateness_EnergyChart = c3.generate({
                    bindto: '#chart1',
                    size: {
                        height: 400
                    },
                    data: {

                        json: data,
                        keys: {
                            x: 'category',
                            value: ['total.acheivableArrivalLatenessInSeconds', 'total.actualArrivalEarlinessInSeconds', 'total.actualArrivalLatenessInSeconds',
                                'total.actualEnergyConsumption', 'total.onTimeOptimalEnergyConsumption', 'total.optimalEnergyConsumption']
                        },
                        xSort: false,
                        type: 'bar',
                        axes: {
                            'total.actualEnergyConsumption': 'y2',
                            'total.onTimeOptimalEnergyConsumption': 'y2',
                            'total.optimalEnergyConsumption': 'y2'
                        },
                        colors: {
                            'total.actualArrivalLatenessInSeconds': DRIVE_COLORS.orange,
                            'total.actualArrivalEarlinessInSeconds': DRIVE_COLORS.red,
                            'total.acheivableArrivalLatenessInSeconds': DRIVE_COLORS.green,
                            'total.onTimeOptimalEnergyConsumption': DRIVE_COLORS.green_light,
                            'total.optimalEnergyConsumption': DRIVE_COLORS.green,
                            'total.actualEnergyConsumption': DRIVE_COLORS.red,
                        }

                    },
                    legend: {
                        
                    },
                    axis: {
                        x: {
                            type: 'category',

                        },
                        y2: {
                            show: true
                        }
                    },
                    grid: {
                        y2: {
                            // show: true,
                            lines:[
                                {value: 'total.targetEnergyConsumption', text: 'Energy target'}
                            ]
                        },

                    }

                })
            },


        }
    }
})();

