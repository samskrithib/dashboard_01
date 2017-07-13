/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('trainGraphFactory', trainGraphFactory);
  function trainGraphFactory($log, UtilityService, DRIVE_COLORS) {
    var timetableAdherenceChart;

    // OVERLAP FIXING
    var fixOverlaps = function (data) {
      // sort from highest to smallest
      data = _.sortBy(data, 'value').reverse(); // using underscore.js here
      // get y-axis distance within which is considered 'overlap'
      // taken as a factor of highest value in series.. so it scales
      var tooClose = data[0].value / 35;
      // loop, find overlappers and write offset values into them
      _.each(data, function (val, key) {
        data[key].class = 'grid' + data[key].tiploc
      })
      for (var i = 1; i < data.length; i++) {
        var prev = data[i - 1];
        var curr = data[i];
        if (prev.value - curr.value <= tooClose) {
          // set the offset based on the length of the previous item's name (cumulative) ..add 2 for padding
          curr.offset = ((!prev.offset) ? prev.text.length : prev.offset + prev.text.length) + 2;
        }
      }
      return data;
    };

    function dataLoop(data, xvalue, newnames, scheduledSeriesNames, ActualRunSeriesNames, xs, columns) {
      _.each(data, function (val, key) {
        var array = data[key].scheduledAndActualTimetables;

        _.each(array, function (val, index) {
          var timeDistanceArray = array[index].timeAndDistanceList
          var identifier = d3.keys(timeDistanceArray[0].identifierAndDistance)
          var seriesName = identifier;
          var splitIdentifier = _.rest(identifier.toString().split(" "), [1]);
          newnames[seriesName] = splitIdentifier.join(" ")
          // allNames[allNames.length] = seriesName;
          if (array[index].timetableType === 'SCHEDULED') {
            scheduledSeriesNames[scheduledSeriesNames.length] = seriesName.toString();
          } else {
            ActualRunSeriesNames.push(seriesName)
            // $log.info(ActualRunSeriesNames)
          }

          var distances = _.pluck(_.pluck(timeDistanceArray, 'identifierAndDistance'), identifier)
          var distancesArray = _.map(distances, function (num) { return num == -1 ? null : num })
          var seriesDistances = identifier.concat(distancesArray)
          var timesArray = _.pluck(timeDistanceArray, xvalue)
          var seriesTimesArrayName = [];
          seriesTimesArrayName.push(identifier + "_time")
          var seriesTimes = seriesTimesArrayName.concat(timesArray)
          xs[identifier] = seriesTimesArrayName[0]
          columns.push(seriesDistances)
          columns.push(seriesTimes)
        })
      })

      return {
        newnames: newnames,
        ActualRunSeriesNames: ActualRunSeriesNames,
        scheduledSeriesNames: scheduledSeriesNames,
        columns: columns,
        xs: xs
      }
    }

    function customTrainGraphLegend(ActualRunSeriesNames, newnames, scheduledSeriesNames) {
      d3.select('#legendItems').remove();
      d3.select('#toggle').remove();
      d3.select('#index0')
        .insert('div')
        .attr('class', 'container-fluid')
        .append('button').attr('type', 'button')
        .attr("id", "toggle")
        .attr("class", "btn btn-primary ")
        .text("Hide Trains")
        .on("click", function (d) {
          var active = legendItems.active ? false : true,
            visibility = active ? 'none' : 'block',
            text = active ? 'Show Trains' : 'Hide Trains'
          d3.select('#legendItems').style("display", visibility)
          d3.select('#toggle').text(text)
          $log.info(active)
          legendItems.active = active;
        })

      d3.select('#index0')
        .insert('div')
        .attr('id', 'legendItems')
        .attr('class', 'container-fluid')
        .insert('div')
        .attr('class', 'legend')
        .insert('ul').attr('class', 'list-group list-group-horizontal')
        .selectAll('span')
        .data(ActualRunSeriesNames)
        .enter().append('li').attr('class', 'list-group-item')
        .attr('data-id', function (id) { return id; })
        .append('div', '.legend-label')
        .html(function (id) { return newnames[id]; })
        .on('mouseover', function (id) {
          var fields = _.rest(id.toString().split(" "), [1]);
          $log.info(fields.join(" "))
          var string = fields.join(" ");
          var newArray = [];
          var index_of_matchedString = UtilityService._findStringinArray(string, scheduledSeriesNames)
          newArray.push(scheduledSeriesNames[index_of_matchedString])
          newArray.push(id)
          $log.info(index_of_matchedString)
          d3.select(this).style("cursor", "pointer");
          timetableAdherenceChart.focus(newArray);
        })
        .on('mouseout', function (id) {
          d3.select(this).style("cursor", "pointer");
          timetableAdherenceChart.revert();
        })
        .on('click', function (id) {
          var fields = _.rest(id.toString().split(" "), [1]);
          $log.info(fields.join(" "))
          var string = fields.join(" ");
          var newArray = [];
          var index_of_matchedString = UtilityService._findStringinArray(string, scheduledSeriesNames)
          newArray.push(scheduledSeriesNames[index_of_matchedString])
          newArray.push(id.toString())
          $(this).toggleClass("c3-legend-item-hidden")
          timetableAdherenceChart.toggle(newArray);
        })
        .insert('span', '.legend-label').attr('class', 'badge-pill')
        .each(function (id) {
          d3.select(this).style('background-color', timetableAdherenceChart.color(id));
        })
        .html(function (id) {
          return '&nbsp&nbsp&nbsp&nbsp&nbsp'
        })
    }
    return {
      getDataFormat: function (data, xvalue) {
        var columns = [];
        var xs = {};
        var newnames = {};
        // var allNames = [];
        var ActualRunSeriesNames = [];
        var scheduledSeriesNames = [];
        var modifiedData;
        dataLoop(data, xvalue, newnames, scheduledSeriesNames, ActualRunSeriesNames, xs, columns)
        modifiedData = {
          xs: xs,
          columns: columns
        }
        $log.info(modifiedData)
        return {
          modifiedData: modifiedData,
          newnames: newnames,
          ActualRunSeriesNames: ActualRunSeriesNames,
          scheduledSeriesNames: scheduledSeriesNames
        };

      },
      getTrainGraphChart: function (modifiedData, tickFormat, tooltipFormat, gridlines) {
        timetableAdherenceChart = c3.generate({
          bindto: '#trainGraph',
          size: {
            height: 500
          },
          padding: {
            right: 50
          },
          data: modifiedData.modifiedData,
          color: {
            pattern: DRIVE_COLORS.twoRunsColorPattern
          },
          legend: {
            show: false
          },
          axis: {
            y: {
              label: {
                text: 'Distance(km)',
                position: 'outer-middle'
              },
              min: 0,
              padding: { bottom: 0 }
            },
            x: {
              type: "timeseries",
              tick: {
                format: tickFormat,
                centered: true,
                fit: false,
                rotate: 45,
                culling: {
                  max: 5
                }
              }
            }
          },
          zoom: {
            enabled: true,
            rescale: true,
            extent: [1, 5000]
          },
          point: {
            r: 1
          },
          subchart: {
            show: true
          },
          grid: {
            lines: {
              front: false
            }
          },
          tooltip: {
            grouped: false,

            format: {
              title: tooltipFormat,

              value: function (d) {
                var obj = _.where(gridlines, { "value": d })
                // $log.info(obj[0].text)
                return obj[0].text + " " + d;
              }
            }
          }

        })
        // draw plotlines/gridlines
        fixOverlaps(gridlines).forEach(function (station) {
          timetableAdherenceChart.ygrids.add({
            value: station.value,
            text: station.text,
            class: station.class
          });
          var selector = ".c3-ygrid-line." + station.class;
          d3.select(selector).select('text')
            .attr('dx', function (id) {
              if (station.offset) {
                // $log.debug(id)
                return -station.offset * 4.5;
              }
            })
        })
        customTrainGraphLegend(modifiedData.ActualRunSeriesNames, modifiedData.newnames, modifiedData.scheduledSeriesNames)
      },


      LoadTrainGraphData: function (data, gridlines, xvalue) {
        var columns = [];
        var xs = {}
        var newnames = {};
        var allNames = [];
        var ActualRunSeriesNames = [];
        var scheduledSeriesNames = [];
        timetableAdherenceChart.unload({
          done: function () {
            $log.info(data.length)
            dataLoop(data, xvalue, newnames, scheduledSeriesNames, ActualRunSeriesNames, xs, columns)
            timetableAdherenceChart.flow({
              columns: columns,
              xs: xs
            })
            customTrainGraphLegend(ActualRunSeriesNames, newnames, scheduledSeriesNames)
          }
        })

      }
    }
  }
})();

