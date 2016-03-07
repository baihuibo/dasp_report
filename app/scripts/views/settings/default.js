/**
 * Created by baihuibo on 16/1/27.
 */
import app from 'app';

let route = '/settings';
let name = '设置';
let icon = 'settings';

app.config(function ($routeProvider, menuProvider) {
    menuProvider.register({
        name: name,
        icon: icon,
        route: route
    });

    $routeProvider.when(route, {
        templateUrl: 'scripts/views/settings/default.html',
        controller: 'SettingsCtrl'
    });
});

app.controller('SettingsCtrl', function ($scope, $mdDialog, toast, webList, dialog, storage) {
    $scope.webList = webList.getList();


    $scope.setInfo = function (ev, src) {
        $mdDialog.show({
                controller: SetInfoDialogController,
                templateUrl: 'scripts/views/settings/setInfo.html',
                targetEvent: ev,
                locals: {
                    web: src
                }
            })
            .then(function (web) {
                _.extendWith(src, web);
                webList.saveAsFile();
            });
    };

    $scope.savePath = storage.getItem('savePath');

    $scope.setSavePath = function ($ev) {
        var path = dialog.showOpenDialog({properties: ['openDirectory']});
        if (path) {
            $scope.savePath = path[0];
            storage.setItem('savePath', path[0]);
        }
    };

    $scope.restore = function (ev) {
        var confirm = $mdDialog.confirm()
            .title('是否还原默认设置?')
            .textContent('此操作将会覆盖当前的设置,并且将它们设为默认值.')
            .targetEvent(ev)
            .cancel('cancel')
            .ok('Please do it!');
        $mdDialog.show(confirm).then(function () {
            webList.restore();
            toast('配置设置成功');
        });
    };

    $scope.setTimer = function (ev, src) {
        $mdDialog.show({
                controller: SetTimerDialogController,
                templateUrl: 'scripts/views/settings/setTimer.html',
                targetEvent: ev,
                locals: {
                    web: src
                }
            })
            .then(function (web) {
                _.extendWith(src, web);
                webList.saveAsFile();
                //save
            });
    };
});

function SetInfoDialogController($scope, $mdDialog, dialogImpr, web) {
    dialogImpr($scope, $mdDialog);
    $scope.checkField = function (val) {
        return typeof val !== 'undefined';
    };
    $scope.web = angular.copy(web);
}

function SetTimerDialogController($scope, $mdDialog, dialogImpr, web) {
    dialogImpr($scope, $mdDialog);
    $scope.web = angular.copy(web);
}