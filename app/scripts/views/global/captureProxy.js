/**
 * Created by baihuibo on 16/3/8.
 */
import app from 'app';
import './web-capture/dljr/action';
import './web-capture/dlbx/action';
import './web-capture/kfjj/action';

app.factory('actionProxy', function (webCaptureProxy, writeFile, fs) {
    return function proxy(path, file, promises, obj) {
        // XXX 这里取消了文件是否存在的校验,使抓取程序可以覆盖采集到的文件
        var promise = webCaptureProxy(obj);//webInfo, action, date, type,down
        writeFile(promise, file, path);
        promises.push(promise);
    };
});

app.factory('captures', function (dljrAction, kfjjAction, dlbxAction) {
    return {
        dljr: dljrAction,
        kfjj: kfjjAction,
        dlbx: dlbxAction 
    }
});

