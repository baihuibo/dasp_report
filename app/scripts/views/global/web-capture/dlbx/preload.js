/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, obj) {
    var frame = $('iframe');
    frame.onload = function () {
        if (frame.contentWindow.location.href.indexOf('/download/') > -1) {
            waitFor.t = 0;
            waitFor(frame.contentDocument, function done(doc) {
                ipcRenderer.sendToHost('result', getResult(doc, obj));
            }, function fail(msg) {
                ipcRenderer.sendToHost('err', msg);
            });
        }
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

ipcRenderer.on('down', function (e, obj) {
    var frame = $('iframe');
    frame.src = `${obj.basePath}/download/${obj.down}.html`;
    ipcRenderer.sendToHost('debug', 'downfile', frame.src);
});

function getResult(doc, obj) {
    var tbody = $('table#report > tbody', doc);
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
        if ($('#report', doc)) {
            return done(doc);
        }

        var formText = $('.formText[valign=top]', doc);
        if (formText) {
            return fail(formText.innerText);
        }

        var text = doc.body.innerText;
        if (text.indexOf('/ncpai/logon.do') > -1) {
            ipcRenderer.sendToHost('debug', 'reload', '会话已过期');
            location.reload();
            return;
        }

        if (waitFor.t === 180) {
            return fail('查询超时等待超过三十分钟未出结果');
        }

        waitFor(doc, done, fail);
    }, 5000);
}