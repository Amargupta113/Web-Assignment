var TwoBytesApp = angular.module('TwoBytesApp', ['ngRoute', 'ngTagsInput']);

TwoBytesApp.run(function ($rootScope) {
    $rootScope.blnShowProfileView = false;
})

TwoBytesApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: "view/home.htm",
            //controller: "homeCtrl"
        })
        .when('/home', {
            templateUrl: "view/home.htm",
            //controller: "homeCtrl"
        })
        .when('/profile', {
            templateUrl: "view/profile.htm",
            controller: "userProfileCtrl"
        })
        .when('/aboutus', {
            templateUrl: "view/aboutus.htm",
            // controller: "aboutusCtrl"
        })
        .when('/jobs', {
            templateUrl: "view/jobs.htm",
            // controller: "jobsCtrl"
        })
        .when('/clients', {
            templateUrl: "view/clients.htm",
            // controller: "clientsCtrl"
        })
        .when('/employers', {
            templateUrl: "view/employers.htm",
            // controller: "employersCtrl"
        })
        .when('/contactus', {
            templateUrl: "view/contactus.htm",
            // controller: "contactusCtrl"
        })
})
TwoBytesApp.service("RegisterUserService", function () {
    this.userInfo = {};
});
TwoBytesApp.controller('headerViewCtrl', function ($scope, $log, $rootScope, $location) {
    $scope.homeRoute = "/home";
    $scope.aboutusRoute = "/aboutus";
    $scope.jobsRoute = "/jobs";
    $scope.clientsRoute = "/clients";
    $scope.employersRoute = "/employers";
    $scope.contactusRoute = "/contactus";
    $scope.activeScreen = "/home";

    function getHomeScreenTag() {
        return $scope.homeRoute;
    }

    function setActiveScreen(pScreen) {
        $scope.activeScreen = pScreen;
    }

    function getActiveScreen() {
        return $scope.activeScreen;
    }

    $scope.checkActiveScreen = function (pScreen) {
        return pScreen == getActiveScreen();
    }
    $scope.onNavigationButtonClick = function (pScreen) {
        setActiveScreen(pScreen);
        $rootScope.blnShowProfileView = (pScreen != getHomeScreenTag());
        $location.path(pScreen);
    }

    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    $scope.onNavigationMenuClick = function () {
        var navPanel = document.getElementById("myTopnav");
        navPanel.className += " responsive";
    };
    $scope.onCloseNavBtnClick = function () {
        var navPanel = document.getElementById("myTopnav");
        navPanel.className = "topnav col-sm-8";
    }
    console.log("header Controller");
});
TwoBytesApp.controller('registerViewCtrl', function ($scope, $log, $location, $rootScope, RegisterUserService) {
    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    $scope.RegistrationInput = {
        "CommonTags": [{
            "text": "cricket"
        }, {
            "text": "football"
        }, {
            "text": "hockey"
        }]
    };
    $scope.onSubmitClick = function (objUserInfo) {
        var fsize = document.getElementById('inputUserImage').files[0];
        if (fsize && fsize.size > 403000) //310*325px image
        {
            alert("Please upload image upto 310*325px");
        } else {
            //Hide Register Window
            $("#RegisterModal").modal("hide");
            $rootScope.blnShowProfileView = true;
            RegisterUserService.userInfo = objUserInfo;

            /** Concat final tag list  **/
            !objUserInfo.Tags && (objUserInfo.Tags = []);
            !objUserInfo.CommonTags && (objUserInfo.CommonTags = []);
            var l_arrFinalTagList = objUserInfo.Tags.concat(objUserInfo.CommonTags);
            var l_tagLen = l_arrFinalTagList.length;
            RegisterUserService.userInfo.TagFinal = "";
            for (var itr in l_arrFinalTagList) {
                RegisterUserService.userInfo.TagFinal += l_arrFinalTagList[itr]["text"];
                if (itr == l_tagLen - 2) {
                    RegisterUserService.userInfo.TagFinal += " and ";
                } else if (itr != l_tagLen - 1) {
                    RegisterUserService.userInfo.TagFinal += ", ";
                }
            }

            $location.path("/profile");
        }
        console.log(RegisterUserService.userInfo);
    };

    console.log("In side Reg");
});
TwoBytesApp.directive("ngFileSelect", function (fileReader, $timeout) {

    return {
        scope: {
            ngModel: "="
        },
        link: function ($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $scope.ngModel = result;
                    });
            };

            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            })

        }

    }

});
TwoBytesApp.factory("fileReader", ["$q", "$log", function ($q, $log) {

    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);

TwoBytesApp.controller('userProfileCtrl', function ($scope, $log, $timeout, $routeParams, $location, $rootScope, RegisterUserService) {
    // $location.path("#/first");
    console.log("------Profile Ctrl -----------");
    console.log(RegisterUserService.userInfo);
    $scope.User = RegisterUserService.userInfo;
    /*$scope.onEditProfileClick = function () {
        $("#RegisterModal").modal("show");
    };*/
    $scope.onAgreeBtnClick = function () {
        var fsize = document.getElementById('inputProfileUserImage').files[0];
        if (fsize && fsize.size > 403000) //310*325px image
        {
            alert("Please upload image upto 310*325px");
        } else {
            $rootScope.blnShowProfileView = false;
            $location.path("/home");
        }
    };
    $scope.onFileSelect = function (files) {

    };
});
