/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('auth', function (ev, auth) {
    var oUser = $('#ouserId');
    if (oUser) {
        oUser.value = auth.name;
    }

    var pwd = $('#userPwd');
    if (pwd) {
        pwd.value = auth.pwd;
    }

    if (oUser && pwd) {
        outSendErrMsg();
        $('#Image1').click();
        return;
    }

    if (location.pathname.indexOf('logon.action') > -1) {
        //登录成功
        ipcRenderer.sendToHost('logon');
    }
});


function outSendErrMsg() {
    setTimeout(function () {
        var oUserErrMsg = $('#ouserIdTap').innerText.trim();
        var pwdErrMsg = $('#userPwdTap').innerText.trim();

        if (oUserErrMsg || pwdErrMsg) {
            ipcRenderer.sendToHost('logerr', oUserErrMsg || pwdErrMsg);
        }
    }, 3 * 1000);
}
function $(selector) {
    return document.querySelector(selector);
}