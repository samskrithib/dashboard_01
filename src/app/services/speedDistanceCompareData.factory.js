/** Created by Samskrithi on 24/11/2016. */
(function() {
  'use strict';
  angular
  .module('dassimFrontendV03')
  .factory('speedDistanceCompareDataFactory', speedDistanceCompareDataFactory);

  function speedDistanceCompareDataFactory($log, $filter, mathUtilsService) {
        var seriesNameMatchers = [
            "ActualDriving", "actualPosition",  
            "FlatoutDriving", "flatoutPosition", 
            "EcoDriving", "optimalPosition",
            "SpeedLimit", "endPoint", "beginPoint",
            "scaledPosition", "Elevation"
        ];

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

        var link_Array=[];
        var driverAdvice_Array = [];
        var actualSpeed_Array = [];
        var actualSpeedMph_Array = [];
        var actualSpeedPosition_Array = [];
        var actualPositionM_Array = [];
        var flatoutSpeed_Array = [];
        var flatoutSpeedPosition_Array = [];
        var optimalSpeed_Array = [];
        var optimalSpeedPosition_Array = [];
        var scaledElevation_Array = [];
        var scaledElevationPosition_Array = [];
        var speedRestrictions_Array =[];
        var speedDistanceData={};

        return {
            getSpeedDistanceLinks: function (speedDistances) {
                link_Array=[];
                _.each(speedDistances, function (val, key){
                    link = _.pluck(speedDistances[key].speedDistanceReportPerJourney, 'link'); 
                    link_Array.push(link);
                })
                return link_Array;
            },


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