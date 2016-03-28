/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, obj) {
    var frame = $('iframe');
    frame.onload = function () {
        clearTimeout(timer);
        valid(frame.contentDocument);

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

    var timer = setTimeout(function () {
        ipcRenderer.sendToHost('debug', 'reload', 'timeout 30s 未响应');
        location.reload();
    }, 30 * 1000);
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

function valid(doc) {
    var formText = $('.formText[valign=top]', doc);
    if (formText) {
        ipcRenderer.sendToHost('debug', 'reload', formText.innerText);
        location.reload();
        return;
    }

    var text = doc.body.innerText;
    if (text.indexOf('错误信息') > -1) {
        ipcRenderer.sendToHost('debug', 'reload', text);
        location.reload();
    } else if (text.indexOf('签退') > -1) {
        ipcRenderer.sendToHost('relogin', text);
    }
}

function waitFor(doc, done, fail) {
    waitFor.t++;
    ipcRenderer.sendToHost('debug', 'waitFor', waitFor.t);

    if (waitFor.t == 10) {
        ipcRenderer.sendToHost('debug', '超时重新启动');
        return location.reload();
    }

    setTimeout(function () {
        if ($('#report', doc)) {
            return done(doc);
        } else {
            valid(doc);
        }
        waitFor(doc, done, fail);
    }, 3000);
}