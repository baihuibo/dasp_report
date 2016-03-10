/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, obj) {
    var frame = $('iframe');
    frame.onload = function () {
        if (frame.contentDocument.title === 'Error') {
            return setTimeout(function () {
                ipcRenderer.sendToHost('debug', 'reload');
                frame.contentWindow.location.reload();
            }, 3000);
        }
        ipcRenderer.sendToHost('debug', 'loaded', frame.contentWindow.location.href);
        if (frame.contentWindow.location.href.indexOf('cognos.cgi') > -1) {
            waitFor.t = 0;
            waitFor(frame.contentDocument, function done(doc) {
                ipcRenderer.sendToHost('result', getResult(doc, obj));
            }, function fail(msg) {
                ipcRenderer.sendToHost('err', msg);
            });
        }
    };

    var form = $('form');
    form.action = obj.action;
    form.submit();
});

function getResult(doc, obj) {
    var tbody = $('.pb > table > tbody', doc);
    if (tbody) {
        var result = util(tbody.children, obj);
        ipcRenderer.sendToHost('debug', 'result', result);
        return result;
    }
    return [];
}

function $(selector, context) {
    return (context || document).querySelector(selector);
}

function $$(selector, context) {
    return (context || document).querySelectorAll(selector);
}

function waitFor(doc, done, fail) {

    waitFor.t++;

    ipcRenderer.sendToHost('debug', 'waitFor', waitFor.t);

    setTimeout(function () {
        if ($('#rt_NS_', doc) && $('#RVContent_NS_', doc)) {
            return done(doc);
        }

        var formText = $('.formText[valign=top]', doc);
        if (formText) {
            return fail(formText.innerText);
        }

        var text = doc.body.innerText;
        if (text.indexOf('会话已过期') > -1) {
            ipcRenderer.sendToHost('debug', 'reload', '会话已过期');
            location.reload();
            return;
        }

        if (text.indexOf('报表正在运行') === -1) {
            ipcRenderer.sendToHost('debug', 'reload', '报表未正常运行');
            location.reload();
            return;
        }

        if (waitFor.t === 180) {
            return fail('查询超时等待超过三十分钟未出结果');
        }

        waitFor(doc, done, fail);
    }, 5000);
}