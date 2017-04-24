/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('testFactory', testFactory);
    function testFactory($log, UtilityService, DRIVE_COLORS) {
        var lateness_EnergyChart;
        var latenessChart;
        var EnergyChart;
        return {
            getchartlinks: function(data){
                return (_.pluck(data[0].energySummaryLinks, 'link'));
            },
            getenergySummaryDataOfSelectedLink: function(energySummaries, link){
                var Es;
                var allLinks = _.pluck(energySummaries[0].energySummaryLinks, 'link')
                 var indexOfLinkInArray = _.indexOf(allLinks, link )
                    $log.debug(link)
                    var energySummaryOfLink_array= []
                _.each(energySummaries, function(val, key){
                    //Find the index of link in energySummaryLinks Array
                   var energySummaryLinks_eachRun = energySummaries[key].energySummaryLinks
                   if(indexOfLinkInArray === -1 ){
                       Es = energySummaries[key].total
                   }else{
                     Es = energySummaryLinks_eachRun[indexOfLinkInArray].energySummary;
                   }
                   energySummaryOfLink_array.push(Es)
                })
                 $log.debug(energySummaryOfLink_array)
                 return energySummaryOfLink_array;
            },


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
                            lines: [
                                { value: 'total.targetEnergyConsumption', text: 'Energy target' }
                            ]
                        },

                    }

                })
            },

            getESChart: function (data) {
                EnergyChart = c3.generate({
                    bindto: '#chart0',
                    size: {
                        height: 200
                    },
                    data: {
                        json: [data],
                        keys: {
                            // x: 'headcode',
                            value: ['actualEnergyConsumption', 'onTimeOptimalEnergyConsumption', 'optimalEnergyConsumption']
                        },
                        xSort: false,
                        type: 'bar',
                        colors: {
                            'onTimeOptimalEnergyConsumption': DRIVE_COLORS.green_light,
                            'optimalEnergyConsumption': DRIVE_COLORS.green,
                            'actualEnergyConsumption': DRIVE_COLORS.red,
                        }

                    },
                    axis: {
                        x: {
                            type: 'category',

                        },
                        y2: {
                            show: true
                        }
                    },
                    bar: {
                        width: {
                            ratio: 0.2 // this makes bar width 30% of length between ticks
                        }
                    },
                  

                })
            },
            setESchart: function(energySummaries){
                EnergyChart.unload({
                    done: function(){
                        EnergyChart.load({
                            json: energySummaries,
                            keys: {
                                value: ['actualEnergyConsumption', 'onTimeOptimalEnergyConsumption', 'optimalEnergyConsumption']
                            },
                            colors: {
                            'onTimeOptimalEnergyConsumption': DRIVE_COLORS.green_light,
                            'optimalEnergyConsumption': DRIVE_COLORS.green,
                            'actualEnergyConsumption': DRIVE_COLORS.red,
                        }
                        })
                    }
                })
            }


        }
    }
})();

