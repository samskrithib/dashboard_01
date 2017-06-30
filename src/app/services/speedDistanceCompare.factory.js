(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('speedDistanceCompareFactory', speedDistanceCompareFactory);
    function speedDistanceCompareFactory($log, $window, $filter){
        var link;
        var headcode;
        var actualSpeed;
        var actualSpeedPosition;
        var flatoutSpeed;
        var flatoutSpeedPosition;
        var optimalSpeed;
        var optimalSpeedPosition;
        var scaledElevation;
        var scaledElevationPosition;
        var speedRestrictions;
        var driverAdvice;
        return {
            getSpeedDistanceData: function (speedDistances) {
                var link_Array=[];
                var driverAdvice_Array = [];
                var actualSpeed_Array = [];
                var actualSpeedPosition_Array = [];
                var flatoutSpeed_Array = [];
                var flatoutSpeedPosition_Array = [];
                var optimalSpeed_Array = [];
                var optimalSpeedPosition_Array = [];
                var scaledElevation_Array = [];
                var scaledElevationPosition_Array = [];
                var speedRestrictions_Array =[];
                var speedDistanceData={};
                
                _.each(speedDistances, function (val, key1){
                    link = _.pluck(speedDistances[key1].speedDistanceReportPerJourney, 'link');
                    link_Array.push(link);

                    driverAdvice = _.pluck(speedDistances[key1].speedDistanceReportPerJourney, 'driverAdvice');
                    driverAdvice_Array.push(driverAdvice);

                    var speedDistanceReportPerJourney =speedDistances[key1].speedDistanceReportPerJourney;
                    _.each(speedDistanceReportPerJourney, function(val, key2){
                        actualSpeed = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.actualSpeedAndPositionList,'speed');
                        actualSpeed_Array.push(actualSpeed);

                        actualSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.actualSpeedAndPositionList,'position');
                        actualSpeedPosition_Array.push(actualSpeedPosition);

                        flatoutSpeed = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.flatoutSpeedAndPositionList,'speed');
                        flatoutSpeed_Array.push(flatoutSpeed);

                        flatoutSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.flatoutSpeedAndPositionList,'position');
                        flatoutSpeedPosition_Array.push(flatoutSpeedPosition);

                        optimalSpeed = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositionList,'speed');
                        optimalSpeed_Array.push(optimalSpeed);

                        optimalSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositionList,'position');
                        optimalSpeedPosition_Array.push(optimalSpeedPosition);

                        scaledElevation = _.pluck(speedDistanceReportPerJourney[key2].scaledElevations,'scaledElevation');
                        scaledElevation_Array.push(scaledElevation);

                        scaledElevationPosition = _.pluck(speedDistanceReportPerJourney[key2].scaledElevations,'position');
                        scaledElevationPosition_Array.push(scaledElevationPosition);

                        speedRestrictions = _.pluck(speedDistanceReportPerJourney[key2].speedRestrictions);
                        speedRestrictions_Array.push(speedRestrictions);
                    });  
                });

                speedDistanceData = {
                    'link': link_Array,
                    'driverAdvice': driverAdvice_Array,
                    'actualSpeed': actualSpeed_Array,
                    'actualSpeedPosition' : actualSpeedPosition_Array,
                    'flatoutSpeed' : flatoutSpeed_Array,
                    'flatoutSpeedPosition' : flatoutSpeedPosition_Array,
                    'optimalSpeed' : optimalSpeed_Array,
                    'optimalSpeedPosition' : optimalSpeedPosition_Array,
                    'speedRestriction' : speedRestrictions_Array
                }
                return speedDistanceData;
            }
        }
         
    }


})();