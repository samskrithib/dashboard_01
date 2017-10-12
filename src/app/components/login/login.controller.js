/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('loginModule')
    .controller('loginController',loginController);

  function loginController($log) {
    var vm = this;
    $log.info("login")
  }
})();
