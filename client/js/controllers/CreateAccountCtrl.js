myModule.controller('CreateAccountCtrl', function($scope, $state, $stateParams, $http) {
    console.log("==SOY CREATE-ACCOUNT CONTROLLER==");
    $scope.data = {email: (typeof $stateParams.email !== 'undefined') ? $stateParams.email : 'please, write an email'};

});
