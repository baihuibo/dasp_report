/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('auth', function (ev, auth) {
    var organCode = $('[name="organCode"]');
    if (organCode) {
        organCode.value = auth.org;
    }

    var userCode = $('[name="userCode"]');
    if (userCode) {
        userCode.value = auth.name;
    }

    var passWord = $('[name="passWord"]');
    if (passWord) {
        passWord.value = auth.pwd;
    }

    if (organCode && userCode && passWord) {
        $('table.common_table a img').click();
        return;
    }

    if (location.pathname.indexOf('index.jsp') > -1) {
        ipcRenderer.sendToHost('logon');
    }
});

function $(selector) {
    return document.querySelector(selector);
}

window.alert = function (msg) {
    ipcRenderer.sendToHost('logerr', msg);
};