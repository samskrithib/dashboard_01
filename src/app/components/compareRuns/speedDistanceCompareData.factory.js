/** Created by Samskrithi on 24/11/2016. */
(function () {
  'use strict';
  angular
    .module('compareRunsModule')
    .factory('speedDistanceCompareDataFactory', speedDistanceCompareDataFactory);

  function speedDistanceCompareDataFactory($log, $filter, mathUtilsService, UtilityService, DRIVE_COLORS) {
    var seriesNameMatchers = [
      "Actual Driving", "actualPosition",
      "Optimal Driving(Flatout)", "flatoutPosition",
      "Optimal Driving(Eco)", "optimalPosition",
      "Speed Limit", "endPoint", "beginPoint",
      "scaledPosition", "Elevation"
    ];
    var link_Array = [];
    var driverAdvices_Array = [];
    var actualSpeed_Kph_AllRuns = [];
    var actualSpeedPosition_Kph_AllRuns = [],
      actualSpeed_Mph_AllRuns = [],
      actualSpeedPosition_Mph_AllRuns = [];

    var flatoutSpeed_Kph_AllRuns = [];
    var flatoutSpeedPosition_Kph_AllRuns = [],
      flatoutSpeed_Mph_AllRuns = [],
      flatoutSpeedPosition_Mph_AllRuns = [];

    var optimalSpeed_Kph_AllRuns = [];
    var optimalSpeedPosition_Kph_AllRuns = [],
      optimalSpeed_Mph_AllRuns = [],
      optimalSpeedPosition_Mph_AllRuns = [];

    var scaledElevation_Array = [],
      scaledElevationPosition_Array = [],
      scaledElevationPositionM_Array = [];

    var speedRestrictionsValues_Array = [];
    var speedRestrictionsPoints_Array = [],
      speedRestrictionsValuesMph_Array = [],
      speedRestrictionsPointsM_Array = [];
    return {
      getSpeedDistanceGraphLabels: function () {
        var graphLabelsAndTitles = {
          "yAxisLabel": "Speed (Kph)",
          "graphTitle": "Speed Distance Graph",
          "seriesLabels": null
        }
        return graphLabelsAndTitles;
      },

      getDataFormat: function (speedDistances, linkIndex, graphLinks, trainIdentifiers) {
        $log.info("speedDistances.actualDriving", speedDistances.actualDriving.length)
        var columns = [];
        var colors = {};
        var xs = {};
        var names = {};
        var hideLegendArray = [];
        var allLegendsArray = [];

        _.each(speedDistances.actualDriving, function (value, key) {
          var actualDriving = speedDistances.actualDriving[key][linkIndex]
          var actualPosition = speedDistances.actualPosition[key][linkIndex]
          var flatoutDriving = speedDistances.flatoutDriving[key][linkIndex]
          var flatoutPosition = speedDistances.flatoutPosition[key][linkIndex]

          var optimalDriving = speedDistances.optimalDriving[key][linkIndex]
          var optimalPosition = speedDistances.optimalPosition[key][linkIndex]

          columns.push(actualDriving, actualPosition, flatoutDriving, flatoutPosition, optimalDriving, optimalPosition)
          hideLegendArray.push(flatoutDriving[0], optimalDriving[0])
          allLegendsArray.push(actualDriving[0], flatoutDriving[0], optimalDriving[0])

          xs[actualDriving[0]] = actualPosition[0]
          xs[flatoutDriving[0]] = flatoutPosition[0]
          xs[optimalDriving[0]] = optimalPosition[0]
          colors[actualDriving[0]] = DRIVE_COLORS.blue_dark
          colors[flatoutDriving[0]] = DRIVE_COLORS.orange
          colors[optimalDriving[0]] = DRIVE_COLORS.green
          //For names
          if (trainIdentifiers) {
            // data[key].name = name;
            $log.info(_.initial(actualDriving[0].split(" "), [1]).join(" "))
            names[actualDriving[0]] = _.initial(actualDriving[0].split(" "), [1]).join(" ") + " " + trainIdentifiers[key]
            names[flatoutDriving[0]] = _.initial(flatoutDriving[0].split(" "), [1]).join(" ") + " " + trainIdentifiers[key]
            names[optimalDriving[0]] = _.initial(optimalDriving[0].split(" "), [1]).join(" ") + " " + trainIdentifiers[key]
          }

        })
        $log.info("names", names)
        var scaledElevation = speedDistances.Elevation[linkIndex];
        var scaledPosition = speedDistances.scaledPosition[linkIndex];

        var speedLimit = speedDistances.speedLimit[linkIndex]
        var endPoint = speedDistances.endPoint[linkIndex]

        columns.push(scaledElevation, scaledPosition, speedLimit, endPoint)
        xs[scaledElevation[0]] = scaledPosition[0]
        xs[speedLimit[0]] = endPoint[0]
        colors[scaledElevation[0]] = DRIVE_COLORS.brown;
        colors[speedLimit[0]] = DRIVE_COLORS.black;

        return {
          data: {
            xs: xs,
            colors: colors,
            columns: columns,
            names: names,
            axes: {
              Elevation: 'y2'
            },
            xSort: false,
            // labels: false
          },
          hideLegendArray: hideLegendArray,
          allLegendsArray: allLegendsArray
        }
      },


      getDriverAdvice: function (speedDistances) {
        var driverAdvice = [];
        driverAdvices_Array = [];
        _.each(speedDistances, function (val, key) {
          var newArray = []
          var speedDistanceReportPerJourney = speedDistances[key];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            driverAdvice = speedDistanceReportPerJourney[key2].driverAdvice;
            newArray.push(driverAdvice);
          })
          driverAdvices_Array.push(newArray)
        })
        // UtilityService.addCheckedItems(driverAdvices_Array)
        return driverAdvices_Array;
      },
      getAllDriveradvices: function () {
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
        actualSpeed_Kph_AllRuns = [];
        actualSpeedPosition_Kph_AllRuns = [];
        actualSpeed_Mph_AllRuns = [];
        actualSpeedPosition_Mph_AllRuns = [];

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

            actualSpeed_Kph.splice(0, 0, seriesNameMatchers[0] + " " + key);
            actualSpeed_Array.push(actualSpeed_Kph);

            actualSpeedPosition.splice(0, 0, seriesNameMatchers[1] + " " + key);
            actualSpeedPosition_Array.push(actualSpeedPosition);

            actualSpeedMph.splice(0, 0, seriesNameMatchers[0] + " " + key);
            actualSpeedMph_Array.push(actualSpeedMph);

            actualSpeedPositionM.splice(0, 0, seriesNameMatchers[1] + " " + key);
            actualSpeedPositionM_Array.push(actualSpeedPositionM);

          })
          actualSpeed_Kph_AllRuns.push(actualSpeed_Array)
          actualSpeedPosition_Kph_AllRuns.push(actualSpeedPosition_Array)
          actualSpeed_Mph_AllRuns.push(actualSpeedMph_Array)
          actualSpeedPosition_Mph_AllRuns.push(actualSpeedPositionM_Array)

          // $log.info(actualSpeedPosition_Kph_AllRuns)

        })
      },

      getFlatoutSpeedDistance: function (speedDistances) {
        flatoutSpeed_Kph_AllRuns = [];
        flatoutSpeedPosition_Kph_AllRuns = []
        flatoutSpeed_Mph_AllRuns = []
        flatoutSpeedPosition_Mph_AllRuns = [];
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

            flatoutSpeed_Kph.splice(0, 0, seriesNameMatchers[2] + " " + key);
            flatoutSpeed_Array.push(flatoutSpeed_Kph);

            flatoutSpeedPosition.splice(0, 0, seriesNameMatchers[3] + " " + key);
            flatoutSpeedPosition_Array.push(flatoutSpeedPosition);

            flatoutSpeedMph.splice(0, 0, seriesNameMatchers[2] + " " + key);
            flatoutSpeedMph_Array.push(flatoutSpeedMph);

            flatoutSpeedPositionM.splice(0, 0, seriesNameMatchers[3] + " " + key);
            flatoutSpeedPositionM_Array.push(flatoutSpeedPositionM);

          })
          flatoutSpeed_Kph_AllRuns.push(flatoutSpeed_Array)
          flatoutSpeedPosition_Kph_AllRuns.push(flatoutSpeedPosition_Array)
          flatoutSpeed_Mph_AllRuns.push(flatoutSpeedMph_Array)
          flatoutSpeedPosition_Mph_AllRuns.push(flatoutSpeedPositionM_Array)

          // $log.info(flatoutSpeedPosition_Kph_AllRuns)

        })
      },

      getOptimalSpeedDistance: function (speedDistances) {
        optimalSpeed_Kph_AllRuns = [];
        optimalSpeedPosition_Kph_AllRuns = []
        optimalSpeed_Mph_AllRuns = []
        optimalSpeedPosition_Mph_AllRuns = [];
        _.each(speedDistances, function (val, key) {
          var speedDistanceReportPerJourney = speedDistances[key],
            optimalSpeedPosition_Array = [],
            optimalSpeed_Array = [],
            optimalSpeedMph_Array = [],
            optimalSpeedPositionM_Array = [];
          _.each(speedDistanceReportPerJourney, function (val, key2) {
            var optimalSpeed_Kph = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositions, 'speed');
            var optimalSpeedPosition = _.pluck(speedDistanceReportPerJourney[key2].speedDistanceProfiles.optimalSpeedAndPositions, 'position');

            var optimalSpeedPositionM = [];
            var optimalSpeedMph = [];

            mathUtilsService.convertMetersToMiles(optimalSpeedPosition, optimalSpeedPositionM);
            mathUtilsService.convertKphtoMph(optimalSpeed_Kph, optimalSpeedMph);

            optimalSpeed_Kph.splice(0, 0, seriesNameMatchers[4] + " " + key);
            optimalSpeed_Array.push(optimalSpeed_Kph);

            optimalSpeedPosition.splice(0, 0, seriesNameMatchers[5] + " " + key);
            optimalSpeedPosition_Array.push(optimalSpeedPosition);

            optimalSpeedMph.splice(0, 0, seriesNameMatchers[4] + " " + key);
            optimalSpeedMph_Array.push(optimalSpeedMph);

            optimalSpeedPositionM.splice(0, 0, seriesNameMatchers[5] + " " + key);
            optimalSpeedPositionM_Array.push(optimalSpeedPositionM);

          })
          optimalSpeed_Kph_AllRuns.push(optimalSpeed_Array)
          optimalSpeedPosition_Kph_AllRuns.push(optimalSpeedPosition_Array)
          optimalSpeed_Mph_AllRuns.push(optimalSpeedMph_Array)
          optimalSpeedPosition_Mph_AllRuns.push(optimalSpeedPositionM_Array)

          // $log.info(flatoutSpeedPosition_Kph_AllRuns)

        })
      },

      getSpeedRestrictions: function (trackInfo) {
        speedRestrictionsValues_Array = [];
        speedRestrictionsPoints_Array = [];
        speedRestrictionsValuesMph_Array = [];
        speedRestrictionsPointsM_Array = [];

        _.each(trackInfo, function (val, key) {
          var speedRestrictionsPerLink = trackInfo[key].speedRestrictions;
          // _.each(speedRestrictionsPerLink, function (val, key2) {
          var speedRestrictionsValue = _.pluck(speedRestrictionsPerLink, 'value');
          var speedRestrictionsPoint = _.pluck(speedRestrictionsPerLink, 'point');

          var speedRestrictionsValueMph = [];
          var speedRestrictionsPointM = [];


          mathUtilsService.convertKphtoMph(speedRestrictionsValue, speedRestrictionsValueMph);
          mathUtilsService.convertMetersToMiles(speedRestrictionsPoint, speedRestrictionsPointM);

          speedRestrictionsValue.splice(0, 0, seriesNameMatchers[6]);
          speedRestrictionsValues_Array.push(speedRestrictionsValue);

          speedRestrictionsPoint.splice(0, 0, seriesNameMatchers[7]);
          speedRestrictionsPoints_Array.push(speedRestrictionsPoint);

          speedRestrictionsValueMph.splice(0, 0, seriesNameMatchers[6]);
          speedRestrictionsValuesMph_Array.push(speedRestrictionsValueMph);

          speedRestrictionsPointM.splice(0, 0, seriesNameMatchers[7]);
          speedRestrictionsPointsM_Array.push(speedRestrictionsPointM);
          // })

        })
      },

      getElevation: function (trackInfo) {
        scaledElevation_Array = [];
        scaledElevationPosition_Array = [];
        scaledElevationPositionM_Array = [];


        _.each(trackInfo, function (val, key) {
          var scaledElevationPerLink = trackInfo[key].scaledElevations;
          var scaledElevationPosition = _.pluck(scaledElevationPerLink, 'position');
          var scaledElevation = _.pluck(scaledElevationPerLink, 'scaledElevation');

          var scaledElevationPositionM = [];
          mathUtilsService.convertMetersToMiles(scaledElevationPosition, scaledElevationPositionM);

          scaledElevationPosition.splice(0, 0, seriesNameMatchers[9]);
          scaledElevationPosition_Array.push(scaledElevationPosition);

          scaledElevation.splice(0, 0, seriesNameMatchers[10]);
          scaledElevation_Array.push(scaledElevation);

          scaledElevationPositionM.splice(0, 0, seriesNameMatchers[9]);
          scaledElevationPositionM_Array.push(scaledElevationPositionM);

        })
      },

      getSpeedDistanceData_Kph: function () {
        return {
          links: link_Array,
          actualDriving: actualSpeed_Kph_AllRuns,
          actualPosition: actualSpeedPosition_Kph_AllRuns,
          flatoutDriving: flatoutSpeed_Kph_AllRuns,
          flatoutPosition: flatoutSpeedPosition_Kph_AllRuns,
          optimalDriving: optimalSpeed_Kph_AllRuns,
          optimalPosition: optimalSpeedPosition_Kph_AllRuns,
          speedLimit: speedRestrictionsValues_Array,
          endPoint: speedRestrictionsPoints_Array,
          scaledPosition: scaledElevationPosition_Array,
          Elevation: scaledElevation_Array
        }
      },

      getSpeedDistanceData_Mph: function () {
        return {
          links: link_Array,
          actualDriving: actualSpeed_Mph_AllRuns,
          actualPosition: actualSpeedPosition_Mph_AllRuns,
          flatoutDriving: flatoutSpeed_Mph_AllRuns,
          flatoutPosition: flatoutSpeedPosition_Mph_AllRuns,
          optimalDriving: optimalSpeed_Mph_AllRuns,
          optimalPosition: optimalSpeedPosition_Mph_AllRuns,
          speedLimit: speedRestrictionsValuesMph_Array,
          endPoint: speedRestrictionsPointsM_Array,
          scaledPosition: scaledElevationPositionM_Array,
          Elevation: scaledElevation_Array
        }
      }
    }

  }


})();
