/*** Created by Samskrithi on 10/20/2016.*/
(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsInputController', CompareMyRunsInputController);

  /** @ngInject */
  function CompareMyRunsInputController(UrlGenerator, $scope, $filter, $timeout, $log, $location, httpCallsService, UtilityService) {
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
    vm.runslength = 2;
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
        }
        else {
          vm.state = "SUCCESS";
          vm.statusmessage = "Enter station name";
          vm.stations = data;
        }
      }).catch(function (response) {
        vm.state = "NORESULTS";
        vm.statusmessage = "No Results";
        $log.debug(/*"controller response: " +*/response);
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
          $log.debug(" null values" + newValues);
          return ''
        } else {
          $log.debug("newValues" + newValues);
          vm.tstate = "LOADING";
          vm.timePlaceholder = "Loading.."
          vm.url = UrlGenerator.generateTrainTimesUrl(vm.inputDate, vm.originTiploc, vm.destinationTiploc);
          $log.info(vm.url);
          httpCallsService.getByUrl(vm.url)
          //httpCallsService.getByJson("assets/old/times.json")
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
              vm.DepartureTimeNotFoundMsg ="There are no departure times for the selected date.";
              alert(response.status);
              $log.debug("controller response: " + response.status);
            })
        }
      }

    });
    vm.fromStation = function (value) {
      if (arguments.length) {
        _selectedFrom = value;
        vm.compareRunsFormdata.origin = _selectedFrom;
        vm.originTiploc = _selectedFrom.tiploc;
        $log.debug(_selectedFrom)
      } else {
        return _selectedFrom;
      }
    };
    vm.toStation = function (value) {
      if (arguments.length) {
        _selectedTo = value;
        vm.compareRunsFormdata.destination = _selectedTo;
        vm.destinationTiploc = _selectedTo.tiploc
        $log.debug(vm.compareRunsFormdata.destination)
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

    vm.checkNumberOfRuns = function () {
      if ( vm.allRuns.length >= 2){
        return false;
      }else {
        //alert("hello false");
        return true;
      }
    };

    vm.checkExceededNumberOfRuns = function () {
      if (vm.ExceededNumberOfRunsStatus=="true") {
        vm.inputRunsExceeded="You can only add 3 input runs.";
        return false;
      } else {
        return true;
      };
    };

    vm.checkDepartureTime = function () {
      if (vm.DepartureTimesFound == "false") {
        return false;
      }else {
        return true;
      }
    };

    vm.checkDuplicateRuns = function () {
      if(vm.duplicatedData ==true){
        vm.duplicateRunMessage="You cannot have any duplicate runs.";
        return false;
      }else {
        return true;
      };
    };

    vm.checkThereAreRunsInArray = function () {
      if (vm.allRuns.length == 0){
        return false;
      }else {
        return true;
      };
    };

    vm.submit = function (isValid) {
      if (isValid) {
        UtilityService.addCheckedItems(vm.checkedItems);
        UrlGenerator.generateReportsUrl(vm.inputDate, vm.compareRunsFormdata.departureTime, _selectedFrom, _selectedTo);
        $location.path("/comparemyruns");
      }
    };

    vm.reset = function (form) {
      _selectedTo = ''
      _selectedFrom = ''
      
      vm.times = []
      vm.originTiploc=''
      vm.destinationTiploc=''
      vm.compareRunsFormdata.origin = ''
      vm.compareRunsFormdata.destination = ''
      vm.compareRunsFormdata.departureTime = ''
      vm.compareRunsFormdata.date = ''
      vm.allRuns = [];
      vm.tstate = "Loading";
      vm.tstate="loading";
      vm.state="success";
      vm.timePlaceholder = ''
      form.$setUntouched();
      form.$setPristine();
      vm.duplicatedData=false;
      vm.ExceededNumberOfRunsStatus="false";
      vm.DepartureTimesFound="true";
    }


    vm.allRuns = [];

    vm.remove = function(allRuns, index){
      vm.ExceededNumberOfRunsStatus="false";
      vm.duplicatedData=false;
      vm.inputRunsExceeded="";
      vm.allRuns.splice(index, 1);
    };

    vm.pushDataToArray = function (form){
      vm.allRuns.push({
              'date': vm.compareRunsFormdata.date,
              'origin': vm.compareRunsFormdata.origin,
              'destination': vm.compareRunsFormdata.destination,
              'departureTime': vm.compareRunsFormdata.departureTime
            });
            vm.compareRunsFormdata.date = undefined;
            // vm.fromStation = undefined;
            // vm.toStation = undefined;
            if(vm.allRuns.length>0){
              vm.state = "LOADING";
              $log.debug(vm.state);
            }
            vm.compareRunsFormdata.departureTime = undefined;
            vm.tstate = "Loading";
            vm.timePlaceholder = ''
            //  vm.times = undefined;
            form.$setUntouched();
            form.$setPristine();
           
            // $log.info(vm.allRuns)
    };

    vm.addRun = function (form, isValid) {
      vm.ExceededNumberOfRunsStatus="false";
      vm.DepartureTimesFound="true";
      vm.duplicatedData = false;
      if (form.$valid) {
        $log.debug(vm.allRuns.length)
        if(vm.allRuns.length <= vm.runslength){
          
          if (vm.allRuns.length == 0) {
            vm.pushDataToArray(form);
          }else{
            var duplicatedData=false;
            for (var i=0; i<vm.allRuns.length; i++){
              if (  vm.allRuns[i].date.getTime() === vm.compareRunsFormdata.date.getTime() &&
                      vm.allRuns[i].origin === vm.compareRunsFormdata.origin &&
                        vm.allRuns[i].destination === vm.compareRunsFormdata.destination &&
                          vm.allRuns[i].departureTime === vm.compareRunsFormdata.departureTime){
                vm.duplicatedData=true;
                {break}
              }
            }

            if (vm.duplicatedData == false) {
              vm.pushDataToArray(form);
            } 
          }        
        } else {
          vm.ExceededNumberOfRunsStatus="true";
        }
        
      }
      
    };


  }
})();
