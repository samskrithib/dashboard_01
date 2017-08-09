/** Created by Samskrithi on 24/11/2016. */
(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('speedDistanceCompareDataFactory', speedDistanceCompareDataFactory);

  function speedDistanceCompareDataFactory($log, $filter, mathUtilsService, DRIVE_COLORS) {
    var seriesNameMatchers = [
      "ActualDriving", "actualPosition",
      "FlatoutDriving", "flatoutPosition",
      "EcoDriving", "optimalPosition",
      "SpeedLimit", "endPoint", "beginPoint",
      "scaledPosition", "Elevation"
    ];
    var link_Array = [];

    var actualSpeed_Kph_AllRuns = [];
    var actualSpeedPosition_Kph_AllRuns = [],
      actualSpeed_Mph_AllRuns = [],
      actualSpeedPosition_Mph_AllRuns = [];

    var flatoutSpeed_Kph_AllRuns = [];
    var flatoutSpeedPosition_Kph_AllRuns = [],
      flatoutSpeed_Mph_AllRuns = [],
      flatoutSpeedPosition_Mph_AllRuns = [];

    return {
      getSpeedDistanceGraphLabels: function () {
        var graphLabelsAndTitles = {
          "yAxisLabel": "Speed (Kph)",
          "graphTitle": "Speed Distance Graph",
          "seriesLabels": null
        }
        return graphLabelsAndTitles;
      },

      getDataFormat: function (speedDistances, linkIndex, graphLinks) {
        var columns = [];
        var colors = {};
        var xs = {};
        var hideLegendArray=[];
        var allLegendsArray=[];

        _.each(speedDistances.actualDriving, function (value, key) {
          var actualDriving = speedDistances.actualDriving[key][linkIndex]
          var actualPosition = speedDistances.actualPosition[key][linkIndex]
          var flatoutDriving = speedDistances.flatoutDriving[key][linkIndex]
          var flatoutPosition = speedDistances.flatoutPosition[key][linkIndex]

          columns.push(actualDriving, actualPosition, flatoutDriving, flatoutPosition)
          hideLegendArray.push(flatoutDriving[0])
          allLegendsArray.push(actualDriving[0], flatoutDriving[0])

          xs[flatoutDriving[0]] = flatoutPosition[0]
          xs[actualDriving[0]] = actualPosition[0]
          colors[actualDriving[0]] = DRIVE_COLORS.SingleShadeColorPattern[key]
          colors[flatoutDriving[0]] = DRIVE_COLORS.SingleShadeColorPattern[key]
        })
        $log.info(colors)

        return {
          data: {
            xs: xs,
            colors: colors,
            columns: columns,
            // axes: {
            //     Elevation: 'y2'
            // },
            xSort: false,
            // labels: false
          },
          hideLegendArray: hideLegendArray,
          allLegendsArray: allLegendsArray
        }
      },


      getDriverAdvice: function (speedDistances) {
        var driverAdvice = [];
        var driverAdvices_Array = [];
        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            driverAdvice = speedDistanceReportPerJourney[key2].driverAdvice;
            driverAdvices_Array.push(driverAdvice);
          })
        })
        // $log.info(driverAdvices_Array)
        return driverAdvices_Array;
      },

      getSpeedDistanceLinks: function (speedDistances) {
        link_Array = [];
        _.each(speedDistances, function (val, key) {
          var link = _.pluck(speedDistances[key].speedDistanceReportPerJourney, 'link');
          link_Array.push(link.stations);
        })
        return link_Array;
      },
      getActualSpeedDistance: function (speedDistances) {
        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key],
            actualSpeedPosition_Array = [],
            actualSpeed_Array = [],
            actualSpeedMph_Array = [],
            actualSpeedPositionM_Array = [];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            var actualSpeed_Kph = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.actualSpeedAndPositions, 'speed');
            var actualSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.actualSpeedAndPositions, 'position');

            var actualSpeedPositionM = [];
            var actualSpeedMph = [];

            mathUtilsService.convertMetersToMiles(actualSpeedPosition, actualSpeedPositionM);
            mathUtilsService.convertKphtoMph(actualSpeed_Kph, actualSpeedMph);

            actualSpeed_Kph.splice(0, 0, seriesNameMatchers[0] + " Run_" + key);
            actualSpeed_Array.push(actualSpeed_Kph);

            actualSpeedPosition.splice(0, 0, seriesNameMatchers[1] + " Run_" + key);
            actualSpeedPosition_Array.push(actualSpeedPosition);

            actualSpeedMph.splice(0, 0, seriesNameMatchers[0] + " Run_" + key);
            actualSpeedMph_Array.push(actualSpeedMph);

            actualSpeedPositionM.splice(0, 0, seriesNameMatchers[1] + " Run_" + key);
            actualSpeedPositionM_Array.push(actualSpeedPositionM);

          })
          actualSpeed_Kph_AllRuns.push(actualSpeed_Array)
          actualSpeedPosition_Kph_AllRuns.push(actualSpeedPosition_Array)
          actualSpeed_Mph_AllRuns.push(actualSpeedMph_Array)
          actualSpeedPosition_Mph_AllRuns.push(actualSpeedPositionM_Array)

          $log.info(actualSpeedPosition_Kph_AllRuns)

        })
      },

      getFlatoutSpeedDistance: function (speedDistances) {
        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key],
            flatoutSpeedPosition_Array = [],
            flatoutSpeed_Array = [],
            flatoutSpeedMph_Array = [],
            flatoutSpeedPositionM_Array = [];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            var flatoutSpeed_Kph = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.flatoutSpeedAndPositions, 'speed');
            var flatoutSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.flatoutSpeedAndPositions, 'position');

            var flatoutSpeedPositionM = [];
            var flatoutSpeedMph = [];

            mathUtilsService.convertMetersToMiles(flatoutSpeedPosition, flatoutSpeedPositionM);
            mathUtilsService.convertKphtoMph(flatoutSpeed_Kph, flatoutSpeedMph);

            flatoutSpeed_Kph.splice(0, 0, seriesNameMatchers[2] + " Run_" + key);
            flatoutSpeed_Array.push(flatoutSpeed_Kph);

            flatoutSpeedPosition.splice(0, 0, seriesNameMatchers[3] + " Run_" + key);
            flatoutSpeedPosition_Array.push(flatoutSpeedPosition);

            flatoutSpeedMph.splice(0, 0, seriesNameMatchers[2] + " Run_" + key);
            flatoutSpeedMph_Array.push(flatoutSpeedMph);

            flatoutSpeedPositionM.splice(0, 0, seriesNameMatchers[3] + " Run_" + key);
            flatoutSpeedPositionM_Array.push(flatoutSpeedPositionM);

          })
          flatoutSpeed_Kph_AllRuns.push(flatoutSpeed_Array)
          flatoutSpeedPosition_Kph_AllRuns.push(flatoutSpeedPosition_Array)
          flatoutSpeed_Mph_AllRuns.push(flatoutSpeedMph_Array)
          flatoutSpeedPosition_Mph_AllRuns.push(flatoutSpeedPositionM_Array)

          $log.info(flatoutSpeedPosition_Kph_AllRuns)

        })
      },

      getOptimalSpeedDistance: function (speedDistances) {
        optimalSpeed_Array = [];
        optimalSpeedPosition_Array = [];
        optimalSpeedMph_Array = [];
        optimalSpeedPositionM_Array = [];
        dataEntryIterativeCount = 0;
        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            optimalSpeed = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositions, 'speed');
            optimalSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositions, 'position');

            optimalSpeedPositionM = [];
            optimalSpeedMph = [];

            mathUtilsService.convertMetersToMiles(optimalSpeedPosition, optimalSpeedPositionM);
            mathUtilsService.convertKphtoMph(optimalSpeed, optimalSpeedMph);

            optimalSpeed.splice(0, 0, seriesNameMatchers[4] + dataEntryIterativeCount);
            optimalSpeed_Array.push(optimalSpeed);

            optimalSpeedPosition.splice(0, 0, seriesNameMatchers[5] + dataEntryIterativeCount);
            optimalSpeedPosition_Array.push(optimalSpeedPosition);

            optimalSpeedMph.splice(0, 0, seriesNameMatchers[4] + dataEntryIterativeCount);
            optimalSpeedMph_Array.push(optimalSpeedMph);

            optimalSpeedPositionM.splice(0, 0, seriesNameMatchers[5] + dataEntryIterativeCount);
            optimalSpeedPositionM_Array.push(optimalSpeedPositionM);

            dataEntryIterativeCount = dataEntryIterativeCount + 1;
          })

        })
      },

      getSpeedRestrictions: function (speedDistances) {
        speedRestrictionsValues_Array = [];
        speedRestrictionsPoints_Array = [];

        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key].speedDistanceReportPerJourney;
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            speedRestrictionsValue = _.pluck(speedDistanceReportPerJourney[key2].speedRestrictions, 'value');
            speedRestrictionsPoint = _.pluck(speedDistanceReportPerJourney[key2].speedRestrictions, 'point');

            speedRestrictionsValueMph = [];
            speedRestrictionsPointM = [];

            mathUtilsService.convertKphtoMph(speedRestrictionsValue, speedRestrictionsValueMph);
            mathUtilsService.convertMetersToMiles(speedRestrictionsPoint, speedRestrictionsPointM);

            speedRestrictionsValue.splice(0, 0, seriesNameMatchers[6] + key2);
            speedRestrictionsValues_Array.push(speedRestrictionsValue);

            speedRestrictionsPoint.splice(0, 0, seriesNameMatchers[7] + key2);
            speedRestrictionsPoints_Array.push(speedRestrictionsPoint);

            speedRestrictionsValueMph.splice(0, 0, seriesNameMatchers[6] + key2);
            speedRestrictionsValuesMph_Array.push(speedRestrictionsValueMph);

            speedRestrictionsPointM.splice(0, 0, seriesNameMatchers[7] + key2);
            speedRestrictionsPointsM_Array.push(speedRestrictionsPointM);
          })

        })
      },

      getElevation: function (speedDistances) {
        scaledElevation_Array = [];
        scaledElevationPosition_Array = [];
        scaledElevationPositionM_Array = [];

        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key].speedDistanceReportPerJourney;
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            scaledElevationPosition = _.pluck(speedDistanceReportPerJourney[key2].scaledElevations, 'position');
            scaledElevation = _.pluck(speedDistanceReportPerJourney[key2].scaledElevations, 'scaledElevation');

            scaledElevationPositionM = [];
            mathUtilsService.convertMetersToMiles(scaledElevationPosition, scaledElevationPositionM);

            scaledElevationPosition.splice(0, 0, seriesNameMatchers[9] + key2);
            scaledElevationPosition_Array.push(scaledElevationPosition);

            scaledElevation.splice(0, 0, seriesNameMatchers[10] + key2);
            scaledElevation_Array.push(scaledElevation);

            scaledElevationPositionM.splice(0, 0, seriesNameMatchers[9] + key2);
            scaledElevationPositionM_Array.push(scaledElevationPositionM);
          })

        })
      },

      getSpeedDistanceData_Kph: function () {
        return {
          links: link_Array,
          actualDriving: actualSpeed_Kph_AllRuns,
          actualPosition: actualSpeedPosition_Kph_AllRuns,
          flatoutDriving: flatoutSpeed_Kph_AllRuns,
          flatoutPosition: flatoutSpeedPosition_Kph_AllRuns,
          //   ecoDriving: optimalSpeed_Array,
          //   optimalPosition: optimalSpeedPosition_Array,
          // speedLimit :  speedRestrictionsValues_Array,
          // endPoint : speedRestrictionsPoints_Array,
          // scaledPosition : scaledElevationPosition_Array,
          // Elevation: scaledElevation_Array
        }
      },

      getSpeedDistanceData_Mph: function () {
        return {
          links: link_Array,
          actualDriving: actualSpeed_Mph_AllRuns,
          actualPosition: actualSpeedPosition_Mph_AllRuns,
          //   flatoutDriving: flatoutSpeedMph_Array,
          //   flatoutPosition: flatoutSpeedPositionM_Array,
          //   ecoDriving: optimalSpeedMph_Array,
          //   optimalPosition: optimalSpeedPositionM_Array,
          //   speedLimit: speedRestrictionsValuesMph_Array,
          //   endPoint: speedRestrictionsPointsM_Array,
          //   scaledPosition: scaledElevationPositionM_Array,
          //   Elevation: scaledElevation_Array
        }
      }
    }

  }


})();
