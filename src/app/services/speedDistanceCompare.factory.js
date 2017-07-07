(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('speedDistanceCompareFactory', speedDistanceCompareFactory);
    function speedDistanceCompareFactory($log, $window, $filter, DRIVE_COLORS) {

        return {
            getSpeedDistanceChart: function (data, graphLabels) {
                SpeedDistanceChart = c3.generate({
                    bindto: '#chart2',
                    size: {
                        height: 400
                    },
                    data: {
                        xs: {
                            'ActualDriving': 'actualPosition',
                           
                        },
                        names: {
                            ActualDriving: 'Actual Driving',
                            
                        },
                        columns: [
                            data.actualPosition[0],
                            data.actualDriving[0],
                        ],
                        axes: {
                            Elevation: 'y2'
                        },
                        xSort: false,
                        labels: false,
                        colors: {
                            'ActualDriving': DRIVE_COLORS.blue_dark,
                            
                        }

                    },
                    zoom: {
                        enabled: false
                    },
                    
                    
                    
                });
            }
        }

    }


})();