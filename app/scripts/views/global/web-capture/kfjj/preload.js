/**
 * Created by baihuibo on 16/3/7.
 */
var ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('auth', function (ev, auth) {

});


function $(selector) {
    return document.querySelector(selector);
}