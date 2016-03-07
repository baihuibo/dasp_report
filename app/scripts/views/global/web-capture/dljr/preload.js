/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('action', function (ev, action) {
    var proxyWebpage = $('proxy-webpage');
    proxyWebpage.onload = function () {
        alert('onload');
    };

    var form = $('form');
    form.action = action;
    form.submit();
});

function $(selector) {
    return document.querySelector(selector);
}