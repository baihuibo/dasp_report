/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, action, type) {
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
                ipcRenderer.sendToHost('result', getResult(doc, type));
            }, function fail(msg) {
                ipcRenderer.sendToHost('err', msg);
            });
        }
    };

    var form = $('form');
    form.action = action;
    form.submit();
});

function getResult(doc, type) {
    var table = $('#rt_NS_ > tbody > tr:nth-child(2) table:nth-child(1)', doc);
    ipcRenderer.sendToHost('debug', 'table', table);
    if (table) {
        var result = util.dljrResult(table, type);
        ipcRenderer.sendToHost('debug', 'result', result);
        return result;
    }
    return [];
}

function $(selector, context) {
    return (context || document).querySelector(selector);
}

function waitFor(doc, done, fail) {
    if ($('#rt_NS_', doc) && $('#RVContent_NS_', doc)) {
        return done(doc);
    }

    var formText = $('.formText[valign=top]', doc);
    if (formText) {
        return fail(formText.innerText);
    }

    ipcRenderer.sendToHost('debug', 'waitFor', waitFor.t);

    waitFor.t++;

    setTimeout(function () {
        if (waitFor.t === 360) {
            return fail('查询超时等待超过三十分钟未出结果');
        }
        waitFor(doc, done, fail);
    }, 5000);
}