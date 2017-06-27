(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment, $log) {
      var vm = this;
      vm.loginDate = moment().subtract({'days': 1, 'hours': 1, 'minutes': 39}).calendar();
      // "vm.creationDate" is available by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
      vm.isCollapsed = true;
      angular.element(document).ready(function() {
        angular.element("#menu-toggle").click(function(e) {
          $log.info("clciked")
            e.preventDefault();
            angular.element("#wrapper").toggleClass("toggled");
            angular.element("#wrapper.toggled").find("#sidebar-wrapper").find(".collapse").collapse("hide");
        });
    });
    }
  }

})();
