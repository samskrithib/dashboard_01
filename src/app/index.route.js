(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login/login.html',
        controller: 'loginController',
        controllerAs: 'vm'
      })
      .state('view', {
        url: '/view',
        templateUrl: 'app/components/viewMyRuns/partials/view-my-runs-input.html',
        controller: 'ViewMyRunsInputController',
        controllerAs: 'vm'
      })
      .state('view-my-runs', {
        url: '/view-my-runs',
        templateUrl: 'app/components/viewMyRuns/partials/view-my-runs.html',
        controller: 'ViewMyRunsController',
        controllerAs: 'vm'
      })
      .state('periodicInput', {
        url: '/periodicInput',
        templateUrl: 'views/periodicReports/periodicReportsInput.html',
        controller: 'PeriodicReportsInputController',
        controllerAs: 'vm'
      })
      .state('periodicReports', {
        url: '/periodicReports',
        templateUrl: 'views/periodicReports/periodicReports.html',
        controller: 'PeriodicReportsController',
        controllerAs: 'vm'
      })
      .state('timetableAdherenceInput', {
        url: '/timetableAdherenceInput',
        templateUrl: 'app/components/timetableAdherence/partials/trainGraphInput.html',
        controller: 'TimetableAdherenceInputController',
        controllerAs: 'vm'
      })
      .state('timetableAdherenceInputScreen2', {
        url: '/ttAInput2',
        templateUrl: 'app/components/timetableAdherence/partials/trainGraphInputScreen2.html',
        controller: 'TimetableAdherenceInput_2_Controller',
        controllerAs: 'vm'
      })
      .state('timetableAdherence', {
        url: '/timetableAdherence',
        templateUrl: 'app/components/timetableAdherence/partials/trainGraph.html',
        controller: 'TrainGraphController',
        controllerAs: 'vm'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'views/test.html',
        controller: 'testController',
        controllerAs: 'vm'
      })
      .state('dwellTimesInput',{
         url: '/dwellTimesInput',
        templateUrl: 'views/dwellTimes/dwellTimesPerJourneyInput.html',
        controller: 'dwellTimesInputController',
        controllerAs: 'vm'
      })
      .state('dwellTimes',{
         url: '/dwellTimes',
        templateUrl: 'views/dwellTimes/dwellTimesPerJourney.html',
        controller: 'dwellTimesController',
        controllerAs: 'vm'
      })
      .state('comparemyrunsInput', {
        url: '/comparemyrunsInput',
        templateUrl: 'views/compare-my-runs/compare-my-runs-input.html',
        controller: 'CompareMyRunsInputController',
        controllerAs: 'vm'
      })
      .state('comparemyruns', {
        url: '/comparemyruns',
        templateUrl: 'views/compare-my-runs/compare-my-runs.html',
        controller: 'CompareMyRunsController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
