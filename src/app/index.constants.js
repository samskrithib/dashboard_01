/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('DRIVE_COLORS', {
      blue: '#7cb5ec',
      blue_dark: '#1f77b4',
      // red : '#D2527F',
      red: '#c96768',
      orange : '#FF7F0E',
      green : '#2ca02c',
      green_actual : '#5FD35F',
      green_light : '#CCCC00',
      black : '#000000',
      brown : '#8c564b',
      twoRunsColorPattern: ['#aec7e8', '#1f77b4', '#ffbb78', '#ff7f0e', '#98df8a', '#2ca02c', '#ff9896', '#d62728', '#c5b0d5', '#9467bd', '#c49c94', '#8c564b', '#f7b6d2', '#e377c2', '#c7c7c7', '#7f7f7f', '#dbdb8d', '#bcbd22', '#9edae5', '#17becf'],
      SingleShadeColorPattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2','#7f7f7f', '#bcbd22', '#17becf'],

    })
  
})();
