myModule.controller('CreateAccountCtrl', function($scope, $state, $stateParams, $http) {
    console.log("==SOY CREATE-ACCOUNT CONTROLLER==", $stateParams.message);
    console.log("==SOY CREATE-ACCOUNT CONTROLLER==", $stateParams.email);

    $scope.data = {
        email: (typeof $stateParams.email !== 'undefined') ? $stateParams.email : 'please, write an email',
        password: '',
        confPassword: '',
        message: (typeof $stateParams.message !== 'undefined') ? $stateParams.message : '',
    };

    $scope.accountFormSubmHndl = function() {
        console.log("CREATE ACCUNT SUBM FORM");
        console.log("--EMAIL--", $scope.data.email);
        console.log("--PASS--", $scope.data.password);
        console.log("--CONF-PASS--", $scope.data.confPassword);

        function callCreateAccountService() {
            if ($scope.data.password === $scope.data.confPassword) {
            	var req={
            		method:'POST',
            		url:'http://localhost:3030/user',
            		data:{"email": $scope.data.email,"password": $scope.data.password},
            		headers:{
            			'Authorization':'abc12'
            		}
            	}

            	$http(req).then(function(resp){
            		console.log("ANGULAR [RESPUESTA-POST]", resp.data);
            		$state.go('ResultadoState');
            	});
       			/*$http.put('http://localhost:3030/user', {"email": $scope.data.email,"password": $scope.data.password}).then(
                    function(resp) {
                        console.log("ANGULAR [RESPUESTA-POST]", resp.data);
                    }
                ); */
            }
        }

        callCreateAccountService();
    }

});
