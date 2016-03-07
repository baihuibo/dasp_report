/**
 * Created by baihuibo on 16/3/7.
 */

var ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('auth', function (ev, auth) {
    var g_i_in_unit_cd = $('[name="g_i_in_unit_cd"]');
    if (g_i_in_unit_cd) {
        g_i_in_unit_cd.value = auth.org;
    }
    var g_i_prin_nm = $('[name="g_i_prin_nm"]');
    if (g_i_prin_nm) {
        g_i_prin_nm.value = auth.num;
    }
    var g_i_oper_pwd = $('[name="g_i_oper_pwd"]');
    if (g_i_oper_pwd) {
        g_i_oper_pwd.value = auth.pwd;
    }

    if (g_i_in_unit_cd && g_i_oper_pwd && g_i_prin_nm) {
        $('[name="imageField"]').click();
        return;
    }

    if ($('.dataTable')) {
        var msg = $('.dataTable td[align=left] div[style]').innerText;
        ipcRenderer.sendToHost('logerr', msg);
        return;
    }

    if (location.pathname.indexOf('logon.do') > -1) {
        ipcRenderer.sendToHost('logon');
    }
});

function $(selector) {
    return document.querySelector(selector);
}