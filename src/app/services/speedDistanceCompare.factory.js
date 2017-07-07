(function () {
    'use strict';
    angular
    .module('dassimFrontendV03')
    .factory('speedDistanceCompareChartFactory', speedDistanceCompareChartFactory);
    function speedDistanceCompareChartFactory($log, $window, DRIVE_COLORS, mathUtilsService) {
        var SpeedDistanceCompareChart;
        var formatter, distanceUnits,speedUnits,TooltipTitleformatter;
        var gridOnOff = true;
  
        return {
            getSpeedDistanceCompareChart: function(){
                SpeedDistanceCompareChart = c3.generate({
                    bindto: 'chart33',
                    size:{
                        height: 400
                    },
                    data:{
                        columns: [
                            ['data1', 30, 200, 100, 400, 150, 250],
                            ['data2', 50, 20, 10, 40, 15, 25]
                        ]
                    }
                })
            }
        }
    }
})();