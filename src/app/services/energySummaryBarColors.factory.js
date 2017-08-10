/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('energySummaryBarColors', energySummaryBarColors)

  function energySummaryBarColors(DRIVE_COLORS, $log) {
    return {
      barColors_JsonInput: function (graphIndicator) {
        return {
          'actualEnergyConsumption': function (color, d) {
            $log.info(graphIndicator)
            return DRIVE_COLORS.blue_dark;
          },
          'optimalEnergyConsumption': function (d) {
            return DRIVE_COLORS.green
          },
          'onTimeOptimalEnergyConsumption': function (d) {
            return DRIVE_COLORS.green_light
          }
        }
      },
      barColors: function (graphIndicator) {
        return {
          'Fuel': function (d) {
            // $log.debug(d)
            switch (d.x) {
              case 0:
                {
                  if (graphIndicator === 'GOODDRIVING') {
                    return DRIVE_COLORS.green;
                  } else if (graphIndicator === 'AVERAGEDRIVING') {
                    return DRIVE_COLORS.orange;
                  } else if (graphIndicator === 'POORDRIVING') {
                    return DRIVE_COLORS.red;
                  } else {
                    return DRIVE_COLORS.blue_dark;
                  }
                  break;
                }
              case 1:
                {
                  return DRIVE_COLORS.green;
                  break;
                }
              case 2:
                {
                  return DRIVE_COLORS.green_light;
                  // return d3.rgb(green).darker(d.value / 150);
                  break;
                }
              default:
                {
                  return DRIVE_COLORS.green;
                  break;
                }
            }
          }
        }
      }
    }
  }

})();
