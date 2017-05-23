/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('chartColors', chartColors)
    function chartColors(DRIVE_COLORS, $log) {

        return {
            colors: function (performanceIndicator, d, other) {
                var performanceIndicatorVariables = ['GOOD_DRIVING', 'AVERAGE_DRIVING', 'POOR_DRIVING'];
                var OtherIndicatorVariables = ['GOOD', 'AVERAGE', 'POOR'];
                var IndicatorVariable;
                if (other === 'performance') {
                    IndicatorVariable = performanceIndicatorVariables
                } else {
                    IndicatorVariable = OtherIndicatorVariables;
                }
                $log.info(performanceIndicator)
                var indicator;
                switch (performanceIndicator[d.x]) {
                    case IndicatorVariable[0]: {
                        indicator = DRIVE_COLORS.green_actual;
                        break;
                    }
                    case IndicatorVariable[1]: {
                        indicator = DRIVE_COLORS.orange;
                        break;
                    }
                    case IndicatorVariable[2]: {
                        indicator = DRIVE_COLORS.red;
                        break;
                    }

                }
                return indicator;
            },
        }
    }

})();

