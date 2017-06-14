/** Created by Samskrithi on 10/27/2016. */
(function () {
    'use strict';

    angular
        .module('dassimFrontendV03')
        .controller('TimetableAdherenceInputController', TimetableAdherenceInputController)
        .controller('TimetableAdherenceInput_2_Controller', TimetableAdherenceInput_2_Controller);

    function TimetableAdherenceInputController(httpCallsService, UrlGenerator, $scope, $location, $log, typeaheadService, UtilityService) {
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
            d.setHours(12);
            d.setMinutes(0);
            d.setSeconds(0)
            return d;
        }
        vm.templates = [
            { name: 'TTPercentile', url: 'views/trainGraph/ttadherencePercentileInput.tmpl.html' },
            { name: 'TTTrackTrains', url: 'views/trainGraph/ttadherenceTrackTrainsInput.tmpl.html' }
        ];
        vm.RadioButtonModel = vm.templates[0].name;
        vm.template = vm.templates[0]
        $scope.$watch('vm.RadioButtonModel', function (newVal, oldVal) {
            $log.debug(" " + newVal)
            if (newVal != oldVal) {
                vm.RadioButtonModel = newVal;
                var index = _.findLastIndex(vm.templates, { name: newVal })
                vm.template = vm.templates[index];
            }

        })

        vm.selectWeekdayOrWeekend = [
            { name: 'Weekdays' },
            { name: 'Weekends' },
        ]

        vm.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        vm.weekends = ['Saturday', 'Sunday'];

        vm.percentilesList = [
            '10%', '20%', '30%', '40%', '50%',
            '60%', '70%', '80%', '90%', '100%',
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


        vm.formData.startTime = defaultStartTime();
        vm.formData.endTime = defaultEndTime();
        vm.formData.weekdays = vm.weekdays;
        vm.formData.weekends = vm.weekends;
        vm.rollingStockChoices = [];
        vm.serviceCodeChoices = [];
        vm.daysRangeOptionSelected = '';
        $scope.$watchGroup(['vm.daysRangeOptionSelected', 'vm.formData.weekdays', 'vm.formData.weekends'], function (newVal, oldVal) {
            // $log.debug(vm.daysRangeOptionSelected)
            if (newVal != oldVal) {
                if (vm.daysRangeOptionSelected == 'Weekdays') {
                    vm.formData.daysRange = vm.formData.weekdays
                } else if (vm.daysRangeOptionSelected == 'Weekends') {
                    vm.formData.daysRange = vm.formData.weekends
                }
                // $log.debug(vm.formData)
            }
        })

        httpCallsService.getByUrl('servicecodes')
            .then(function (response) {
                vm.serviceCodeChoices = response;
                vm.formData.serviceCode = vm.serviceCodeChoices;
            })

        vm.timetableAdherenceSubmit = function (isValid) {
            if (isValid) {
                $log.debug(vm.formData)
                UtilityService.addCheckedItems(vm.RadioButtonModel)
                var ttAderenceUrl = getTtAderenceUrl();
                // $log.info(ttAderenceUrl)
                getResponse(ttAderenceUrl)
                // getResponse()
            }
        }

        function getTtAderenceUrl() {
            var ttAdherenceUrl, keyxValue, stinglength;
           
            if (vm.RadioButtonModel === 'TTTrackTrains') {
                ttAdherenceUrl = UrlGenerator.generateTTAdherenceUrls(vm.formData).trackTrains;
                keyxValue = 'unixTime';
                stinglength = 7;
            } else {
                ttAdherenceUrl = UrlGenerator.generateTTAdherenceUrls(vm.formData).percentile;
                keyxValue = 'timeInSeconds';
                stinglength = 9;
            }
            return ttAdherenceUrl;
        }

        function getResponse(ttAderenceUrl) {
            var routesFlag= true;
            // httpCallsService.getByUrl(TTAdherenceTrackTrainsUrl)
            // httpCallsService.getByJson("assets/timetableAdherenceGraph.json")
            httpCallsService.getByJson("assets/timetableRoutes.json")
                .then(function (response) {
                    vm.response = response;
                    if (vm.response.timetableRoutes) {
                        // $log.info("fdjksfjdklsf" + vm.response.timetableRoutes)
                        routesFlag = true;
                        vm.timetableRoutes = vm.response.timetableRoutes;
                        UtilityService.addCheckedItems([vm.timetableRoutes, vm.RadioButtonModel, routesFlag])
                        $location.path("/ttAInput2");
                    } else {
                        $log.info(response)
                        routesFlag = false;
                        UtilityService.addCheckedItems([vm.RadioButtonModel, ttAderenceUrl, routesFlag])
                        $location.path("timetableAdherence")
                    }
                }).catch(function (error) {
                    vm.error = error;
                })
        }
    }




    function TimetableAdherenceInput_2_Controller(httpCallsService, UrlGenerator, $scope, $location, $log, typeaheadService, UtilityService, trainGraphFactory) {
        var vm = this;
        vm.timetableRoutes = UtilityService.getCheckedItems()[0];
        vm.getTabs = UtilityService.getCheckedItems()[1]
        vm.routesFlag = UtilityService.getCheckedItems()[2]
        $log.info(vm.getTabs)
        vm.tableRowExpanded = false;
        vm.tableRowIndexCurrExpanded = "";
        vm.tableRowIndexPrevExpanded = "";
        vm.dayDataCollapse = [];
        _.each(vm.timetableRoutes, function (val, key) {
            vm.dayDataCollapse.push(true)
        })
        $log.info(vm.dayDataCollapse, vm.dayDataCollapse.length)
        vm.selectTableRow = function (index) {
            if (vm.dayDataCollapse === 'undefined') {
                vm.dayDataCollapse = vm.dayDataCollapseFn();
            } else {

                if (vm.tableRowExpanded === false && vm.tableRowIndexCurrExpanded === "") {
                    vm.tableRowIndexPrevExpanded = "";
                    vm.tableRowExpanded = true;
                    vm.tableRowIndexCurrExpanded = index;
                    vm.dayDataCollapse[index] = false;
                } else if (vm.tableRowExpanded === true) {
                    if (vm.tableRowIndexCurrExpanded === index) {
                        vm.tableRowExpanded = false;
                        vm.tableRowIndexCurrExpanded = "";
                        vm.dayDataCollapse[index] = true;
                    } else {
                        vm.tableRowIndexPrevExpanded = vm.tableRowIndexCurrExpanded;
                        vm.tableRowIndexCurrExpanded = index;
                        vm.dayDataCollapse[vm.tableRowIndexPrevExpanded] = true;
                        vm.dayDataCollapse[vm.tableRowIndexCurrExpanded] = false;
                    }
                }
            }
        };
        vm.dayDataCollapseFn = function () {
            for (var i = 0; vm.response.timetableRoutes.length - 1; i += 1) {
                vm.dayDataCollapse.append('true');
            }
        };

        vm.routeIdSelected = function ($valid) {
            var routeIdUrl = UrlGenerator.generateRouteIdUrl(vm.selectRoute)
            $log.info(routeIdUrl)
            UtilityService.addCheckedItems([vm.getTabs, routeIdUrl, vm.routesFlag])
            $location.path("timetableAdherence")

        }

    }
})();