(function () {
    'use strict';
    angular
    .module('dassimFrontendV03')
    .factory('speedDistanceCompareChartFactory', speedDistanceCompareChartFactory)
    
    function speedDistanceCompareChartFactory($log, $window, DRIVE_COLORS, mathUtilsService) {

        var SpeedDistanceCompareChart;
        var formatter, distanceUnits,speedUnits,TooltipTitleformatter;
        var gridOnOff = true;
        function updatexaxisTickFormatter(Mph) {
            distanceUnits = (Mph ? ' Miles': 'm')
            speedUnits = (Mph ? ' Mph': ' Kph')
            formatter = (Mph ? function(num) {return num} :   mathUtilsService.formatNumToSIUnits)
            TooltipTitleformatter = d3.format(Mph ? ',.2f' : '.3s')
        }
        updatexaxisTickFormatter();


        return {
            getSpeedDistanceCompareChart: function(speedDistanceData, graphLabels){
                SpeedDistanceCompareChart = c3.generate({
                    bindto: '#chart33',
                    size: {
                        height: 400
                    },
                    data: speedDistanceData
                        //  xs: {
                        //      'ActualDriving0': 'actualPosition0',
                        //      'FlatoutDriving0': 'flatoutPosition0',
                        //      'EcoDriving0': 'optimalPosition0',
                        //      'SpeedLimit0': 'endPoint0',
                        //      'Elevation0': 'scaledPosition0'
                        //  },
                        //  names:{
                        //      ActualDriving0: 'Actual Driving',
                        //      FlatoutDriving0: 'Optimal Driving (Flatout)',
                        //      EcoDriving0: 'Optimal Driving (Eco)',
                        //      SpeedLimit0: 'Speed Limit'
                        //  },
                        //  columns: [
                        //      speedDistanceData.actualPosition[0],
                        //      speedDistanceData.actualDriving[0],
                        //      speedDistanceData.flatoutDriving[0],
                        //      speedDistanceData.flatoutPosition[0],
                        //      speedDistanceData.ecoDriving[0],
                        //      speedDistanceData.optimalPosition[0],
                        //      speedDistanceData.speedLimit[0],
                        //      speedDistanceData.endPoint[0],
                        //      speedDistanceData.Elevation[0],
                        //      speedDistanceData.scaledPosition[0]
                        //  ],
                        //  axes: {
                        //      Elevation: 'y2'
                        //  },
                        //  xSort: false,
                        //  labels: false,
                         //colors: {
                         //    'ActualDriving': DRIVE_COLORS.blue_dark,
                         //    'FlatoutDriving': DRIVE_COLORS.green,
                         //    'EcoDriving': DRIVE_COLORS.green,
                         //    'SpeedLimit': DRIVE_COLORS.black,
                         //    'Elevation': DRIVE_COLORS.brown,
                         //   'ActualDriving1': DRIVE_COLORS.blue_dark
                         //}
                    ,
                    zoom: {
                        enabled: false
                    },
                    point :{
                        show: true,
                        r: 0
                    },
                    grid:{
                        y: {
                            show: gridOnOff
                        },
                        x: {
                            show: gridOnOff
                        }
                    },
                    tooltip: {
                        format: {
                            title: function (d) { return 'Position : ' + TooltipTitleformatter(d) + distanceUnits; },
                            value: function (value, ratio, id) {
                                var format = d3.format(',.0f');
                                var units = id === 'Elevation' ? ' meters' : speedUnits;
                                return format(value) + units;
                            }
                        }
                    },
                    axis: {
                        y: {
                            min:0,
                            padding: { bottom: 0},
                            label: {
                                text: graphLabels.yAxisLabel,
                                position: 'outer-middle'
                            }
                        },
                        y2: {
                            max: 80,
                            min: -80,
                            label: {
                                text: "Elevation change (m)",
                                position: 'outer-middle'
                            },
                            show: true
                        },
                        x: {
                            label: {
                                text: 'Distance (km)',
                                position: 'outer-center'
                            },
                            height: 50,
                            tick: {
                                format: function (x) { return formatter(x); },
                                fit: false,
                                outer: false,
                                rotate: 0,
                                multiline: false,
                                culling: {
                                    max: 5
                                }
                            }
                           
                        }
                    }


                });
            },
            setGridOnOff: function(value){
                if(value == true){
                    d3.selectAll('.c3-grid line')
                        .style('visibility', 'visible')
                }else{
                    d3.selectAll('.c3-grid line')
                        .style('visibility', 'hidden')
                }
            },
            setSpeedDistanceCompareChart: function (speedDistanceData, selected) {
                SpeedDistanceCompareChart.unload({
                    done: function () {
                        SpeedDistanceCompareChart.load({
                            
                            columns: [
                                speedDistanceData.actualPosition[0],
                                speedDistanceData.actualDriving[0],
                                speedDistanceData.flatoutDriving[0],
                                speedDistanceData.flatoutPosition[0],
                                speedDistanceData.ecoDriving[0],
                                speedDistanceData.optimalPosition[0],
                                speedDistanceData.speedLimit[0],
                                speedDistanceData.endPoint[0],
                                speedDistanceData.Elevation[0],
                                speedDistanceData.scaledPosition[0],
                                speedDistanceData.actualPosition[1],
                                speedDistanceData.actualDriving[1],
                                speedDistanceData.flatoutDriving[1],
                                speedDistanceData.flatoutPosition[1],
                                speedDistanceData.ecoDriving[1],
                                speedDistanceData.optimalPosition[1],
                                speedDistanceData.speedLimit[1],
                                speedDistanceData.endPoint[1],
                                speedDistanceData.Elevation[1],
                                speedDistanceData.scaledPosition[1]
                            ]
                        })
                    }
                })
            },
            setSpeedDistanceCompareKph: function (speedDistanceData, selected) {
                SpeedDistanceCompareChart.axis.labels({
                    y: 'Speed (Kph)',
                    x: 'Distance (Km)'
                })
                updatexaxisTickFormatter(false)
                // SpeedDistanceChart.axis.range({max: {y2: 150}, min: { y2: -150}})
                SpeedDistanceCompareChart.unload({
                    done: function () {
                        SpeedDistanceCompareChart.load(
                            speedDistanceData
                        //    {
                            //columns: [
                            //    speedDistanceData.actualPosition[0],
                            //    speedDistanceData.actualDriving[0],
                            //    speedDistanceData.flatoutDriving[0],
                            //    speedDistanceData.flatoutPosition[0],
                            //    speedDistanceData.ecoDriving[0],
                            //    speedDistanceData.optimalPosition[0],
                            //    speedDistanceData.speedLimit[0],
                            //    speedDistanceData.endPoint[0],
                            //    speedDistanceData.Elevation[0],
                            //    speedDistanceData.scaledPosition[0],
                            //    speedDistanceData.actualPosition[1],
                            //    speedDistanceData.actualDriving[1],
                            //    speedDistanceData.flatoutDriving[1],
                            //    speedDistanceData.flatoutPosition[1],
                            //    speedDistanceData.ecoDriving[1],
                            //    speedDistanceData.optimalPosition[1],
                            //    speedDistanceData.speedLimit[1],
                            //    speedDistanceData.endPoint[1],
                            //    speedDistanceData.Elevation[1],
                            //    speedDistanceData.scaledPosition[1]
                            //]
                        //}
                        )
                    }
                })
            },
            setSpeedDistanceCompareMph: function (speedDistanceData, selected) {
                SpeedDistanceCompareChart.unload({
                    done: function () {
                        SpeedDistanceCompareChart.load(
                            speedDistanceData
                    //    {
                    //    columns: [
                    //        speedDistanceData.actualPosition[0],
                    //        speedDistanceData.flatoutPosition[0],
                    //        speedDistanceData.optimalPosition[0],
                    //        speedDistanceData.endPoint[0],
                    //        speedDistanceData.actualDriving[0],
                    //        speedDistanceData.flatoutDriving[0],
                    //        speedDistanceData.ecoDriving[0],
                    //        speedDistanceData.speedLimit[0],
                    //        speedDistanceData.Elevation[0],
                    //        speedDistanceData.scaledPosition[0],
                    //        speedDistanceData.actualPosition[1],
                    //        speedDistanceData.actualDriving[1]
                    //    ]
                    //}
                    )
                    }
                })
                updatexaxisTickFormatter(true)
                // $log.debug(data.ecoDriving[selected])
                SpeedDistanceCompareChart.axis.labels({
                    y: 'Speed (Mph)',
                    x: 'Distance (Miles)'
                })
            }
        }
    }
        
    
})();