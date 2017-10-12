/*** Created by Samskrithi on 10/20/2016.*/
(function () {
  'use strict';
  angular
    .module('compareRunsModule')
    .controller('CompareMyRunsInputController', CompareMyRunsInputController);

  /** @ngInject */
  function CompareMyRunsInputController(compareRunsUrlGeneratorService, $q, $scope, $filter, $timeout, $log, $location, httpCallsService, UtilityService) {
    var vm = this;
    var _selectedFrom, _selectedTo, _selectedTime;
    vm.opened = false;
    vm.state = "LOADING";
    vm.statusmessage = "Loading...";
    vm.datePickerPopup = {};
    vm.compareRunsFormdata = [];
    vm.formData = [];
    vm.open = function () {
      vm.datePickerPopup.opened = true
    };

    httpCallsService.getByUrl('driver-runs/multiple-run-maximum')
      .then(function (response) {
        vm.runslength = response - 1;
        // $log.info(vm.runslength)
      }).catch(function (error) {
      vm.runslength = 2;
      $log.info(error)
    })
    vm.dateOptions = {
      // dateDisabled: disabled, check https://angular-ui.github.io/bootstrap/#!#datepickerPopup
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(2015, 1, 1),
      startingDay: 1
    };

    vm.getStations = function () {
      //httpCallsService.getByUrl('locationnamesandtiplocs')
      httpCallsService.getStations()
        .then(function (data) {
          if (data.length <= 0) {
            vm.state = "NORESULTS";
            vm.statusmessage = "No results";
          } else {
            vm.state = "SUCCESS";
            vm.statusmessage = "Enter station name";
            vm.stations = data;
          }
        }).catch(function (response) {
        vm.state = "NORESULTS";
        vm.statusmessage = "No Results";
        $log.info(/*"controller response: " +*/ response);
      });
    };

    vm.stations = [];
    vm.getStations();

    //order station names with leading character on higher rank
    vm.smartOrder = UtilityService.searchBySmartOrder;

    //check if the from-station and to-station inputs are filled
    //call function if both stations are filled and valid
    // $log.debug(vm.date);
    $scope.$watchGroup(['vm.compareRunsFormdata.date', 'vm.originTiploc', 'vm.destinationTiploc'], function (newValues, oldValues) {
      vm.inputDate = $filter('date')(vm.compareRunsFormdata.date, 'yyyy-MM-dd');
      if (newValues != oldValues) {
        if (typeof newValues[0] === 'undefined' || typeof newValues[1] === 'undefined' || typeof newValues[2] === 'undefined') {
          return ''
        } else if (newValues[0] === '' || newValues[1] === '' || newValues[2] === '') {
          $log.info(" null values" + newValues);
          return ''
        } else {
          $log.info("newValues" + newValues);
          vm.tstate = "LOADING";
          vm.timePlaceholder = "Loading.."
          vm.url = compareRunsUrlGeneratorService.generateTrainTimesUrl(vm.inputDate, vm.originTiploc, vm.destinationTiploc);
          $log.info(vm.url);
          httpCallsService.getByUrl(vm.url)
          // httpCallsService.getByJson("assets/old/times.json")
            .then(function (data) {
              vm.tstate = "SUCCESS";
              vm.compareRunsFormdata.departureTime = '';
              vm.timePlaceholder = "Enter scheduled time of train";
              vm.DepartureTimesFound = "true";
              if (data.length <= 0) {
                vm.tstate = "NORESULTS";
                vm.timePlaceholder = "No results";
                vm.compareRunsFormdata.departureTime = '';
              } else {
                vm.times = $filter('orderBy')(data, data.value);
              }
            }).catch(function (response) {
            vm.tstate = "NORESULTS";
            vm.timePlaceholder = "No results";
            vm.DepartureTimesFound = "false";
            vm.compareRunsFormdata.date = ''
            vm.DepartureTimeNotFoundMsg = "There are no departure times for the selected date.";
            // alert(response.status);
            $log.info("controller response: " + response.status);
          })
        }
      }

    });
    vm.fromStation = function (value) {
      if (arguments.length) {
        _selectedFrom = value;
        vm.compareRunsFormdata.origin = _selectedFrom;
        vm.originTiploc = _selectedFrom.tiploc;
        $log.info(_selectedFrom)
      } else {
        return _selectedFrom;
      }
    };
    vm.toStation = function (value) {
      if (arguments.length) {
        _selectedTo = value;
        vm.compareRunsFormdata.destination = _selectedTo;
        vm.destinationTiploc = _selectedTo.tiploc
        $log.info(vm.compareRunsFormdata.destination)
      } else {
        return _selectedTo;
      }
    }
    vm.compareRunsFormdata.departureTime = function (value) {
      if (arguments.length) {
        _selectedTime = value;
        vm.time = _selectedTime;
      } else {
        return _selectedTime;
      }
    }
    vm.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };
    /* ------------ USED IN HTML--------------------------------*/
    vm.checkNumberOfRuns = function () {
      /* should have atleast 2 runs to compare, hence 2 while comparing */
      if (vm.allRuns.length >= 2) {
        return false;
      } else {
        return true;
      }
    };

    vm.checkExceededNumberOfRuns = function () {
      if (vm.ExceededNumberOfRunsStatus == "true") {
        vm.inputRunsExceeded = "You can only compare upto " + (vm.runslength + 1) + " runs.";
        return false;
      } else {
        return true;
      }
      ;
    };
    vm.remove = function (allRuns, index) {
      vm.ExceededNumberOfRunsStatus = "false";
      vm.duplicatedData = false;
      vm.inputRunsExceeded = "";
      vm.allRuns.splice(index, 1);
    };
    /* --------------------------------------------*/
    vm.checkDepartureTime = function () {
      if (vm.DepartureTimesFound == "false") {
        return false;
      } else {
        return true;
      }
    };
    vm.duplicateRunMessage = "You cannot compare duplicate runs.";
    vm.allRuns = [];

    vm._hasSameStoppingPatterns = true;

    vm.addRun = function (form, isValid) {
      vm.duplicatedData = false;
      vm.ExceededNumberOfRunsStatus = "false";
      vm.DepartureTimesFound = "true";

      if (form.$valid) {
        if (vm.allRuns.length <= vm.runslength) {
          if (vm.allRuns.length == 0) {
            pushDataToArray(form);
          } else {
            checkDuplicateRuns(vm.allRuns, form)
            if (vm.duplicatedData == false) {
              checkStoppingPatterns(vm.allRuns, form)
            }
          }
        } else {
          vm.ExceededNumberOfRunsStatus = "true";
        }

      }
      form.$setPristine();

    };
    vm.submit = function (isValid) {
      if (isValid) {
        $log.info(vm.allRuns)
        var compareRunsUrl = compareRunsUrlGeneratorService.generateCompareRunsUrl(vm.allRuns)
        $log.info(compareRunsUrl)
        UtilityService.addCheckedItems(compareRunsUrl);
        $location.path("/comparemyruns");
      }
    };
    vm.reset = function (form) {
      _selectedTo = ''
      _selectedFrom = ''
      vm.times = []
      vm.originTiploc = ''
      vm.destinationTiploc = ''
      vm.compareRunsFormdata.origin = ''
      vm.compareRunsFormdata.destination = ''
      vm.compareRunsFormdata.departureTime = ''
      vm.compareRunsFormdata.date = ''
      vm.allRuns = [];
      vm.tstate = "Loading";
      vm.tstate = "loading";
      vm.state = "success";
      vm.timePlaceholder = ''
      form.$setUntouched();
      form.$setPristine();
      vm.duplicatedData = false;
      vm.ExceededNumberOfRunsStatus = "false";
      vm.DepartureTimesFound = "true";
    }

    function checkStoppingPatterns(allRuns, form) {
      // $log.info(allRuns, vm.compareRunsFormdata.date, vm._hasSameStoppingPatterns)
      var obj = {
        'date': vm.compareRunsFormdata.date,
        'origin': vm.compareRunsFormdata.origin,
        'destination': vm.compareRunsFormdata.destination,
        'departureTime': vm.compareRunsFormdata.departureTime
      }
      var data = [];
      data.push(allRuns[allRuns.length - 1], obj)
      var stoppingPatternUrl = compareRunsUrlGeneratorService.generateCompareStoppingPatternUrl(data)
      httpCallsService.getByUrl(stoppingPatternUrl)
      // httpCallsService.getByJson("assets/patterns.json")
        .then(function (response) {
          vm._hasSameStoppingPatterns = true;
          $log.info(response)
          pushDataToArray(form)
          vm._hasSameStoppingPatternsMessage = response.message
        }).catch(function (error) {
        vm._hasSameStoppingPatterns = false;
        vm._hasSameStoppingPatternsMessage = error.data.message
        // $log.info($q.reject(error.data))
      })

      return vm._hasSameStoppingPatterns;
    }

    function checkDuplicateRuns(allRuns, form) {
      _.each(allRuns, function (val, i) {
        if (allRuns[i].date.getTime() === vm.compareRunsFormdata.date.getTime() &&
          allRuns[i].origin === vm.compareRunsFormdata.origin &&
          allRuns[i].destination === vm.compareRunsFormdata.destination &&
          allRuns[i].departureTime === vm.compareRunsFormdata.departureTime) {
          vm.duplicatedData = true;
          return;
        }
      })


    };

    function pushDataToArray(form) {
      vm.allRuns.push({
        'date': vm.compareRunsFormdata.date,
        'origin': vm.compareRunsFormdata.origin,
        'destination': vm.compareRunsFormdata.destination,
        'departureTime': vm.compareRunsFormdata.departureTime
      });
      vm.compareRunsFormdata.date = undefined;
      if (vm.allRuns.length > 0) {
        vm.state = "LOADING";
      }
      vm.compareRunsFormdata.departureTime = undefined;
      vm.tstate = "Loading";
      vm.timePlaceholder = ''
      form.$setUntouched();
      form.$setPristine();

    };
    vm.closeAlert = function (data) {
      vm._hasSameStoppingPatterns = true;
    }
  }
})();
