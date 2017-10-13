(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .config(config);

  /** @ngInject */
  function config($logProvider) {
    // Enable log
    $logProvider.debugEnabled(true);


  }

})();
