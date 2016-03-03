/**
 * Created by baihuibo on 16/1/26.
 */
import app from 'app';
import './views/all';

app.config(function ($logProvider) {
    //$logProvider.debugEnabled(false);
});

app.run(function ($rootScope, currentWebContents, currentWindow) {

    currentWindow.show();

    //最小化
    $rootScope.minimize = function () {
        currentWindow.minimize();
    };

    //全屏幕
    $rootScope.maximize = function () {
        currentWindow.setFullScreen(!currentWindow.isFullScreen());
    };

    //开发者工具
    $rootScope.devTools = function () {
        currentWebContents.openDevTools();
    };

    //退出
    $rootScope.closeWindow = function () {
        currentWindow.close();
    };
});

angular.bootstrap(document, ['app']);