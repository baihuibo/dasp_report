/**
 * Created by baihuibo on 16/3/7.
 */
import app from 'app';

//报表采集
app.factory('webCapture', function ($q) {
    return function (webInfo, action) {
        var q = $q.defer();

        var webview = document.createElement('webview');
        webview.src = `${__dirname}/scripts/views/global/web-capture/${webInfo._type}/proxy.html`;
        webview.classList.add('capture-box');
        webview.width = 300;
        webview.height = 100;
        webview.preload = `${__dirname}/scripts/views/global/web-capture/${webInfo._type}/preload.js`;

        document.body.appendChild(webview);

        webview.addEventListener('dom-ready', function () {
            webview.send('action', action);
        });

        webview.addEventListener('ipc-message', function (e) {
            if (e.channel === 'result') {
                q.resolve(e.args[0]);
            } else {
                q.reject(e.args[0]);
            }
            document.body.removeChild(webview);
        });

        return q.promise;
    }
});