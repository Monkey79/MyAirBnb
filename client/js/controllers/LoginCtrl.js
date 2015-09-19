myModule.controller('LoginCtrl', function($scope, $state, $http) {
    console.log("==SOY LOGIN CONTROLLER==");

    $scope.data = {
        myEmail: '',
        myPassword: '',
        message:'',
    }

    $scope.loginFormSubmitHndl = function() {
        console.log("SUBMITEASTE EL FORM--", $scope.data.myEmail);
        console.log("SUBMITEASTE EL FORM--", $scope.data.myPassword);

        $http.get('http://localhost:3030/auth?email=' + $scope.data.myEmail + '&password=' + $scope.data.myPassword).then(
            function(resp) {
                console.log("ANGULAR-OK [RESP-DATA]", resp.data);
            }
        ).catch(function(err) {
        	console.log("ANGULAR-ERROR [RESP-STATUS-TEXT]", err.data.toString());
            $scope.data.message = err.data.toString();
            console.log("ENVIANDO A CREATE ESTO ", $scope.data.message);
        	$state.go('CreateAccountState',{email:$scope.data.myEmail, message:$scope.data.message});
            //throw err;
        });
    }
});
