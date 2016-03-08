/**
 * Created by baihuibo on 16/3/7.
 */
import app from 'app';

//报表采集
app.factory('webCaptureProxy', function ($q, webLogs, date, $log) {
    return function (webInfo, action) {
        var q = $.Deferred();

        var view = document.createElement('webview');

        var wrapper = document.createElement('div');
        wrapper.classList.add('webview-box');

        view.src = `${__dirname}/scripts/views/global/web-capture/${webInfo._type}/proxy.html`;
        view.preload = `${__dirname}/scripts/views/global/web-capture/${webInfo._type}/preload.js`;

        document.body.appendChild(wrapper);
        wrapper.appendChild(view);

        view.addEventListener('dom-ready', function () {
            view.send('action', action);
        });

        view.addEventListener('ipc-message', function (e) {
            if (e.channel === 'result') {
                q.resolve(e.args[0]);
                q.notify(webInfo, e.args[0]);
                document.body.removeChild(wrapper);
            } else if (e.channel === 'debug') {
                $log.debug('debug', e.args);
            } else {
                $log.debug('err msg : ', e.args);
                view.reload();
            }
        });

        return q.promise();
    }
});