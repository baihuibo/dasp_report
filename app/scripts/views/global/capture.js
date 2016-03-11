/**
 * Created by baihuibo on 16/3/7.
 */
import app from 'app';

//报表采集
app.factory('webCaptureProxy', function ($q, webLogs, date, $log, downProxy) {
    return function (obj) {
        var q = $.Deferred();

        if (obj.down) {
            downProxy.downName = obj.down;
            downProxy.done = function () {
                view.send('down', obj);
                downProxy.downName = downProxy.done = null;
            };
        }

        var view = document.createElement('webview');

        var wrapper = document.createElement('div');
        wrapper.classList.add('webview-box');

        view.src = `${__dirname}/scripts/views/global/web-capture/${obj.web._type}/proxy.html`;
        view.preload = `${__dirname}/scripts/views/global/web-capture/${obj.web._type}/preload.js`;

        document.body.appendChild(wrapper);
        wrapper.appendChild(view);

        view.addEventListener('dom-ready', function () {
            //view.openDevTools();
            view.send('action', obj);
        });

        view.addEventListener('ipc-message', function (e) {
            if (e.channel === 'result') {
                q.resolve(e.args[0]);
                document.body.removeChild(wrapper);
            } else if (e.channel === 'debug') {
                $log.debug('debug', e.args);
            } else {
                $log.debug('err msg : ', e.args);
                view.reload();
            }
        });

        view.addEventListener('console-message', function (e) {
            console.log('view console-message:', e.message);
        });

        return q.promise();
    }
});