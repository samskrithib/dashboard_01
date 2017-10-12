/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('timetableAdherenceModule')
    .controller('TimetableAdherenceInputController', TimetableAdherenceInputController);

  function TimetableAdherenceInputController(httpCallsService, timetableAdherenceUrlGeneratorService, $scope, $location, $log, typeaheadService, UtilityService) {
    var vm = this;
    var defaultStartTime = function () {
      var d = new Date()
      d.setHours(6);
      d.setMinutes(0);
      d.setSeconds(0)
      return d;
    }
    var defaultEndTime = function () {
      var d = new Date()
      d.setHours(23);
      d.setMinutes(0);
      d.setSeconds(0)
      return d;
    }
    vm.dateOptions = {
      // dateDisabled: disabled,
      // formatYear: 'yy',
      maxDate: new Date(),
      // minDate: new Date(),
      startingDay: 1
    }
    vm.todateOptions = {
      // minDate: vm.formData.fromDate,
      maxDate: new Date(),
      startingDay: 1
    }
    vm.templates = [{
        name: 'TTPercentile'
      },
      {
        name: 'TTTrackTrains'
      }
    ];
    vm.RadioButtonModel = vm.templates[0].name;
    vm.template = vm.templates[0]
    $scope.$watch('vm.RadioButtonModel', function (newVal, oldVal) {
      $log.info(" " + newVal)
      if (newVal != oldVal) {
        vm.RadioButtonModel = newVal;
        var index = _.findLastIndex(vm.templates, {
          name: newVal
        })
        vm.template = vm.templates[index];
      }

    })

    vm.selectWeekdayOrWeekend = [{
        name: 'Weekdays'
      },
      {
        name: 'Weekends'
      },
    ]

    vm.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    vm.weekends = ['Saturday', 'Sunday'];

    vm.percentilesList = [
      '10%', '20%', '30%', '40%', '50%',
      '60%', '70%', '75%', '80%', '85%', '90%', '95%', '100%',
    ]

    //order station names with leading character on higher rank
    vm.smartOrder = function (obj) {
      var queryObj = typeaheadService.getQueryObject(),
        key = Object.keys(queryObj)[0],
        query = queryObj[key];
      if (obj[key].toLowerCase().indexOf(query.toLowerCase()) === 0) {
        return ('a' + obj[key]);
      }
      return ('b' + obj[key]);
    };
    vm.getStations = function () {
      httpCallsService.getStations().then(function (data) {
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
        $log.info( /*"controller response: " +*/ response);
      });
    };

    vm.stations = [];
    vm.getStations();
    vm.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    vm.opened = false;
    vm.open1 = function () {
      vm.popup1.opened = true;
    };
    vm.popup1 = {
      opened: false
    };
    vm.open2 = function () {
      vm.popup2.opened = true;
    };
    vm.popup2 = {
      opened: false
    };

    vm.formData = {};
    /* Defaults */
    // vm.formData.fromStation = {
    //   "locationName": "Newcastle",
    //   "tiploc": "NWCSTLE"
    // };
    // vm.formData.toStation = {
    //   "locationName": "Carlisle",
    //   "tiploc": "CARLILE"
    // };
    // vm.formData.fromTiploc = vm.formData.fromStation.tiploc;
    // vm.formData.toTiploc = vm.formData.toStation.tiploc;
    vm.formData.fromDate = new Date();
    vm.formData.toDate = new Date();
    vm.formData.percentileSelected = '80%';
    vm.formData.fromRecord = 0;
    vm.formData.pageSize = 10;


    /* End Defaults */

    vm.formData.startTime = defaultStartTime();
    vm.formData.endTime = defaultEndTime();
    vm.formData.weekdays = vm.weekdays;
    vm.formData.weekends = vm.weekends;
    vm.rollingStockChoices = [];
    vm.serviceCodeChoices = [];
    vm.daysRangeOptionSelected = 'Weekdays';
    vm.formData.daysRange = vm.formData.weekdays;
    $scope.$watchGroup(['vm.daysRangeOptionSelected', 'vm.formData.weekdays', 'vm.formData.weekends'], function (newVal, oldVal) {
      if (newVal != oldVal) {
        $log.info(vm.daysRangeOptionSelected)
        if (vm.daysRangeOptionSelected == 'Weekdays') {
          vm.formData.daysRange = vm.formData.weekdays
        } else if (vm.daysRangeOptionSelected == 'Weekends') {
          vm.formData.daysRange = vm.formData.weekends
        }
      }
    })
    $scope.$watchGroup(['vm.formData.fromDate', 'vm.formData.toDate'], function (newValue, oldValue) {
      if (newValue != oldValue) {
        if (Date.parse(vm.formData.toDate) < Date.parse(vm.formData.fromDate)) {
          vm.formData.toDate = vm.formData.fromDate;
          alert("todate is less than from date")
        }
      }
    })

    httpCallsService.getByUrl('train-graph/service-codes')
      .then(function (response) {
        vm.serviceCodeChoices = response;
      })

    vm.timetableAdherenceSubmit = function (isValid) {
      if (isValid) {
        $log.info(vm.formData)
        UtilityService.addCheckedItems(vm.RadioButtonModel)
        var ttAderenceUrl = getTtAderenceUrl();
        getResponse(ttAderenceUrl)
        // getResponse()
      }
    }

    function getTtAderenceUrl() {
      var ttAdherenceUrl, keyxValue, stinglength;
      var currentPage = 0;
      if (vm.RadioButtonModel === 'TTTrackTrains') {
        ttAdherenceUrl = timetableAdherenceUrlGeneratorService.generateTTAdherenceUrls(vm.formData, currentPage).trackTrains;
        keyxValue = 'unixTime';
        stinglength = 7;
      } else {
        ttAdherenceUrl = timetableAdherenceUrlGeneratorService.generateTTAdherenceUrls(vm.formData, currentPage).percentile;
        keyxValue = 'timeInSeconds';
        stinglength = 9;
      }
      $log.info(ttAdherenceUrl)
      return ttAdherenceUrl;
    }

    function getResponse(ttAderenceUrl) {
      var routesFlag = true;
      var serviceCodes;
      if (vm.formData.serviceCodes) {
        serviceCodes = vm.formData.serviceCodes.toString()
      }
      httpCallsService.getHeaders(ttAderenceUrl, serviceCodes)
        // httpCallsService.getByJson("assets/timetableAdherenceGraph.json")
        // httpCallsService.getByJson("assets/old/timetableRoutes.json")
        .then(function (response) {
          vm.response = response.data;
          // vm.response = response;
          // $log.info(vm.response)
          if (vm.response.timetableRoutes) {
            routesFlag = true;
            vm.timetableRoutes = vm.response.timetableRoutes;
            UtilityService.addCheckedItems([vm.timetableRoutes, vm.RadioButtonModel, routesFlag, vm.response])
            $location.path("/ttAInput2");
          } else {
            routesFlag = false;
            UtilityService.addCheckedItems([vm.RadioButtonModel, ttAderenceUrl, routesFlag])
            $location.path("timetableAdherence")
          }
        }).catch(function (error) {
          vm.error = error;
          $location.path("/timetableAdherenceInput")
        })
    }
  }


})();
