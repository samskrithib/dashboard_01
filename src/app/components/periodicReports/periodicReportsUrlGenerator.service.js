(function () {
  angular
    .module('periodicReportsModule')
    .factory('periodicReportsUrlGeneratorService', periodicReportsUrlGeneratorService);

  function periodicReportsUrlGeneratorService() {
    return {
      console: function () {
        console.log("periodicReportsUrlGeneratorService")
      }
    }
  }
})();
