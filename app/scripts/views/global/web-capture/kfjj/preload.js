/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, obj) {
    var frame = $('iframe');
    frame.onload = function () {
        ipcRenderer.sendToHost('debug', 'loaded', frame.contentWindow.location.href);

        waitFor.t = 0;
        waitFor(frame.contentDocument, function (doc) {
            ipcRenderer.sendToHost('result', getResult(doc, obj));
        }, function (msg) {
            ipcRenderer.sendToHost('err', msg);
        });
    };

    var form = $('form');

    for (var name in obj.action.params) {
        var input = document.createElement('input');
        input.name = name;
        input.value = obj.action.params[name];
        form.appendChild(input);
    }

    form.action = obj.action.url;
    form.submit();
});

function getResult(doc, obj) {
    var table = $$('table', doc)[3];
    if (table.tBodies[0]) {
        var result = util(table.tBodies[0].children, obj);
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
        if ($$('table', doc).length === 5) {
            return done(doc);
        }

        var formText = $('.formText[valign=top]', doc);
        if (formText) {
            return fail(formText.innerText);
        }

        if (waitFor.t === 180) {
            return fail('查询超时等待超过三十分钟未出结果');
        }

        waitFor(doc, done, fail);
    }, 5000);
}