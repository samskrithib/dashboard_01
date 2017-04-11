/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .service('onTimeRunningFactory', onTimeRunningFactory);
  function onTimeRunningFactory($log, $window) {
    var onTimeChart;
    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function legendFollowMouse(e) {
      var x = e[0];
      var y = e[1];
      return {
        x: x - 50 + 'px',
        y: y - 70 + 'px'
      }
    }

    function createLegendTooltip() {
      var svg = this.svg[0][0];
      var frag = document.createDocumentFragment();
      var div = document.createElement('div');
      var span = document.createElement('span');
      div.className = 'c3-legend-tooltip-container';
      span.className = 'c3-legend-tooltip';

      div.appendChild(span);
      frag.appendChild(div);
      insertAfter(svg, frag);

      this.legendHoverNode = span;
    }

    function generateLegendHoverLabels(labels) {
      createLegendTooltip.call(this);
      var obj = {};
      this.data.targets.map(function (data, i) {
        if (typeof labels[i] !== 'undefined') {
          obj[data.id] = labels[i];
        }
      })
      return obj;
    }
    var debug = document.querySelector('#debug');
    return {
      getOnTimeData: function (response) {
        var actualLateness = d3.values([(response.actualLatenessPercentages)][0]);
        var optimalLateness = d3.values([(response.optimalLatenessPercentages)][0]);
        var seriesNames = [
          "Actual Driving Style",
          "Improved Driving Style"
        ];

        actualLateness.splice(0, 0, seriesNames[0]);
        optimalLateness.splice(0, 0, seriesNames[1]);
        return {
          actualLateness: actualLateness,
          optimalLateness: optimalLateness
        };
      },
      // Labels for on-time running report
      getonTimeGraphLabels: function (data) {
        var graphLabelsAndTitles = {
          "xAxisLabels": d3.keys([(data.actualLatenessPercentages)][0]),
          "yAxisLabel": "%",
          "graphTitle": "Actual vs Achievable On-Time Running",
          "seriesLabels": [
            "Actual Driving Style",
            "Improved Driving Style"
          ]
        };
        return graphLabelsAndTitles;
      },

      //------------------------Generate OnTimeRunning chart -----------------------------------------//
      getOnTimeChart: function (data, graphLabels) {

        onTimeChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 400
          },
          data: {
            columns: [
              data.actualLateness,
              data.optimalLateness
            ],
            colors:{
              'Actual Driving Style': '#1f77b4',
              'Improved Driving Style' : '#2ca02c'

            },
            type: 'bar',
            labels: {
              format: function (v, id, i, j) {
                var screenWidth = $window.innerWidth;
                if (screenWidth < 768) {
                  if (v == 0) {
                    return v + "%";
                  } else { return ""; }
                } else if (screenWidth >= 768) {
                  return v + "%";
                }
              }
            },
            
          },
          title: {
            text: graphLabels.graphTitle,
            position: 'top-center'
          },
          oninit: function () {
            // declare your extra long labels here
            var legendLongLabels = [
              '% of trains arriving in this lateness range',
              '% of trains which could arrive in this lateness range with best practice driving assuming actual departure time from previous station stop'
            ];
            this.legendHoverContent = generateLegendHoverLabels.call(this, legendLongLabels);
          },
          legend: {
            item: {
              onmouseover: function (id) {
                // keep default behavior as well as our tooltip
                d3.select(this.svg[0][0]).classed('c3-legend-item-focused', true);

                if (!this.transiting && this.isTargetToShow(id)) {
                  this.api.focus(id);
                }

                // if we defined the long labels, display them
                if (this.legendHoverContent.hasOwnProperty(id)) {
                  var coords = legendFollowMouse(d3.mouse(this.svg[0][0]))
                  this.legendHoverNode.parentNode.style.display = 'block';
                  this.legendHoverNode.parentNode.style.top = coords.y;
                  this.legendHoverNode.parentNode.style.left = coords.x;
                  this.legendHoverNode.innerHTML = this.legendHoverContent[id];
                }
              },
              onmouseout: function (id) {
                // keep default behavior as well
                d3.select(this.svg[0][0]).classed('c3-legend-item-focused', false);
                this.api.revert();

                // just hide the tooltips
                this.legendHoverNode.parentNode.style.display = 'none';
              }
            }
          },
          axis: {
            y: {

              tick: {
                format: function (d) { return d + '%'; }
              }
            },
            x: {
              type: 'category',
              categories: graphLabels.xAxisLabels,
              height: 70

            }
          },
          regions: [
            { axis: 'x', start: 0.5, end: 1.5, class: 'regionX', opacity:0.3 },
          ],
          bar: {
            width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
          },
          grid: {
            y: {
              show: false
            }
            /*x: {
             show : true,
           }*/
          }
        });
      }

    }
  }
})();

