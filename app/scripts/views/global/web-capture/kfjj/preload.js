/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
var util = require('../util.js');
ipcRenderer.on('action', function (ev, obj) {
    var frame = $('iframe');
    frame.onload = function () {

    };

    var form = $('form');
    form.action = obj.action;
    form.submit();
});

function getResult(doc, obj) {
    var tbody = $('.pb > table > tbody', doc);
    if (tbody) {
        var result = util(tbody.childNodes, obj);
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

        if (waitFor.t === 180) {
            return fail('查询超时等待超过三十分钟未出结果');
        }

        waitFor(doc, done, fail);
    }, 5000);
}