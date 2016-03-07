/**
 * Created by baihuibo on 16/3/7.
 */
import app from 'app';

//网站登录
app.factory('webLogin', function ($q) {
    return function (webInfo) {
        var q = $q.defer();

        var webview = document.createElement('webview');
        webview.src = webInfo.url;
        webview.classList.add('login-box');
        webview.preload = `${__dirname}/scripts/views/global/webLogin-preload/${webInfo._type}.js`;

        document.body.appendChild(webview);

        webview.addEventListener('dom-ready', function () {
            webview.send('auth', webInfo.auth);
        });

        webview.addEventListener('ipc-message', function (e) {
            if (e.channel === 'logon') {
                q.resolve();
            } else {
                q.reject(e.args[0]);
            }
            document.body.removeChild(webview);
        });

        return q.promise;
    }
});