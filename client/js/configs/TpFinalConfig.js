var myModule = angular.module("FinalApp", ['ui.router']);

myModule.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('HomeState', {
        url: "/",
        templateUrl: 'pages/home.html',
        controller: 'HomeCtrl'
    });

    $stateProvider.state('ResultadoState', {
        url: "/Resultado",
        templateUrl: 'pages/resultado.html',
        controller: 'ResultadoCtrl'
    });

    $stateProvider.state('LoginState', {
        url: "/Login",
        templateUrl: 'pages/login.html',
        controller: 'LoginCtrl'
    });

    $stateProvider.state('LostPasswordState', {
        url: "/LostPassword",
        templateUrl: 'pages/lost_pass.html',
        controller: 'LostPasswordCtrl'
    });

    $stateProvider.state('CreateAccountState', {
        url: "/CreateAccount/?email",
        templateUrl: 'pages/create_account.html',
        controller: 'CreateAccountCtrl'
    });

    $urlRouterProvider.otherwise("/");
});
