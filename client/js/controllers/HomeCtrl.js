myModule.controller('HomeCtrl', function($scope, $state, $http) {
    console.log("==SOY HOME CONTROLLER==");

    $scope.data = {
        myKeyWord:""
    }

    $scope.myKeyWord = "";

    $scope.searchFormSubmitHndl = function() {
        console.log("SUBMITEASTE EL FORM--", $scope.data.myKeyWord);

        //localhost:8045/meliProxy?q=ipod&limit=2
   /*     $http.get('http://localhost:3030/employee/pepe/lio').then(
            function(resp) {
                console.log("ANGULAR [RESPUESTA-GET]", resp.data);
            }
        );
*/
/*        $http.post('http://localhost:3030/employee',{"name":"mauro","age":"2","id":"mauroid"}).then(
            function(resp) {
                console.log("ANGULAR [RESPUESTA-POST]", resp.data);
            }
        ); */ 

        $http.get('http://localhost:3030/auth?email=mauro@gmail.com&password=mauropass').then(
            function(resp) {
                console.log("ANGULAR [RESPUESTA-POST]", resp.data);
            }
        );
    }
});
