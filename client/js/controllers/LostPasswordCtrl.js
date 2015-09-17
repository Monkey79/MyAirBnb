myModule.controller('LostPasswordCtrl', function($scope, $state, $http) {
    console.log("==SOY LOST-PASSWORD CONTROLLER==");

    $scope.data = {
    	myEmail:""
    }

    $scope.lostPassFormSubmitHnd = function() {
        console.log("SUBMITEASTE EL FORM--", $scope.data.myEmail);
    }

});
