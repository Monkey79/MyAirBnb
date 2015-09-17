myModule.controller('LoginCtrl', function($scope, $state, $http) {
    console.log("==SOY LOGIN CONTROLLER==");

    $scope.data = {
        myEmail: "",
        myPassword: ""
    }

    $scope.loginFormSubmitHndl = function() {
        console.log("SUBMITEASTE EL FORM--", $scope.data.myEmail);
        console.log("SUBMITEASTE EL FORM--", $scope.data.myPassword);

        $http.get('http://localhost:3030/auth?email=' + $scope.data.myEmail + '&password=' + $scope.data.myPassword).then(
            function(resp) {
                console.log("ANGULAR-OK [RESP-DATA]", resp.data);
            }
        ).catch(function(e) {
        	console.log("ANGULAR-ERROR [RESP-STATUS-TEXT]", e);
        	$state.go('CreateAccountState',{email:$scope.data.myEmail});
        	throw e;
        });
    }
});
