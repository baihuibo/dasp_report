/**
 * Created by baihuibo on 16/1/26.
 */
import app from 'app';
import './views/all';
import config from 'config';

app.config(function ($logProvider) {
    $logProvider.debugEnabled(config.logDebugEnabled);
});

app.factory('downProxy', function () {
    return {};
});

app.factory('basePath', function () {
    return __dirname;
});

app.run(function ($rootScope, currentWebContents, currentWindow, fs, iconvLite, request, downProxy, $log, timer) {

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

    var filter = {
        urls: ["http://10.2.3.237:7001/ncpai/print/*.html"]
    };

    currentWebContents.session.webRequest.onHeadersReceived(filter, function (details, callback) {
        if (downProxy.downName) {
            request(details.url)
                .pipe(iconvLite.decodeStream('gbk'))
                .pipe(iconvLite.encodeStream('utf-8'))
                .pipe(fs.createWriteStream(`./app/download/${downProxy.downName}.html`))
                .on('finish', function () {
                    downProxy.done && downProxy.done();
                });

            $log.log('取消原请求访问');
            callback({cancel: true});
        }
    });

    timer.registry('23:59', function () {
        location.reload();//重启系统
    });
});

angular.bootstrap(document, ['app']);