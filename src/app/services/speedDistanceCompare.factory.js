(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('speedDistanceCompareChartFactory', speedDistanceCompareChartFactory)

  function speedDistanceCompareChartFactory($log, $window, DRIVE_COLORS, mathUtilsService, UtilityService) {

    var SpeedDistanceCompareChart;
    var formatter, distanceUnits, speedUnits, TooltipTitleformatter;
    var gridOnOff = true;

    function updatexaxisTickFormatter(Mph) {
      distanceUnits = (Mph ? ' Miles' : 'm')
      speedUnits = (Mph ? ' Mph' : ' Kph')
      formatter = (Mph ? function (num) {
        return num
      } : mathUtilsService.formatNumToSIUnits)
      TooltipTitleformatter = d3.format(Mph ? ',.2f' : '.3s')
    }

    updatexaxisTickFormatter();
    return {
      getSpeedDistanceCompareChart: function (speedDistanceData, graphLabels) {
        SpeedDistanceCompareChart = c3.generate({
          bindto: '#chart2',
          size: {
            height: 400
          },
          data: speedDistanceData.data,
          zoom: {
            enabled: false
          },
          legend: {
            // hide: speedDistanceData.hideLegendArray,
            item: {
              onmouseover: function (id) {
                if (id == 'Speed Limit' || id == 'Elevation') {
                  SpeedDistanceCompareChart.focus(id)
                } else {
                  var string = (_.rest(id.toString().split(" "), [2])).join();
                  //added advices to Utitlityservice in ComparemyRuns Controller
                  var advices = UtilityService.getCheckedItems()
                  var valuesOfDriverAdviceObjects = d3.entries(advices[string])
                  d3.select("#col-md-8")
                    .selectAll("div")
                    .data(valuesOfDriverAdviceObjects)
                    .enter()
                    .append("div")
                    .attr("class", "driverAdvice")
                    .attr("class", function (d) {
                      return d.key;
                    })
                    .attr("id", "driverAdvice")
                    .text(function (d) {
                      return d.value
                    })

                  var newArray = [];
                  // search and push id related optimal profile
                  speedDistanceData.allLegendsArray.filter(function (val, key) {
                    if (val.indexOf(string) != -1) {
                      newArray.push(speedDistanceData.allLegendsArray[key])
                    }
                  })
                  newArray.push('Elevation', 'Speed Limit')
                  SpeedDistanceCompareChart.focus(newArray)
                }
              },
              onmouseout: function (id) {
                d3.selectAll("#driverAdvice").remove()
                SpeedDistanceCompareChart.revert()
              },
              onclick: function (id) {
                var string = (_.rest(id.toString().split(" "), [2])).join();
                var newArray = [];
                var index_of_matchedString = UtilityService._findStringinArray(string, speedDistanceData.hideLegendArray)
                newArray.push(speedDistanceData.hideLegendArray[index_of_matchedString], id)
                SpeedDistanceCompareChart.toggle(newArray)
              }
            }
          },
          point: {
            show: true,
            r: 0
          },
          grid: {
            y: {
              show: gridOnOff
            },
            x: {
              show: gridOnOff
            }
          },
          tooltip: {
            format: {
              title: function (d) {
                return 'Position : ' + TooltipTitleformatter(d) + distanceUnits;
              },
              value: function (value, ratio, id) {
                var format = d3.format(',.0f');
                var units = id === 'Elevation' ? ' meters' : speedUnits;
                return format(value) + units;
              }
            }
          },
          axis: {
            y: {
              min: 0,
              padding: {
                bottom: 0
              },
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
                format: function (x) {
                  return formatter(x);
                },
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
      setGridOnOff: function (value) {
        if (value == true) {
          d3.selectAll('.c3-grid line')
            .style('visibility', 'visible')
        } else {
          d3.selectAll('.c3-grid line')
            .style('visibility', 'hidden')
        }
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
              speedDistanceData.data
            )
          }
        })

      },
      setSpeedDistanceCompareMph: function (speedDistanceData, selected) {
        // $log.info(speedDistanceData)
        SpeedDistanceCompareChart.unload({
          done: function () {
            SpeedDistanceCompareChart.load(
              speedDistanceData.data
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
