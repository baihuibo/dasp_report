/**
 * Created by baihuibo on 16/3/8.
 */
import app from 'app';
import './web-capture/dljr/action';

app.factory('actionProxy', function (webCaptureProxy, writeFile, fs) {
    return function proxy(path, file, promises, obj) {
        if (!fs.existsSync(path + '/' + file)) {
            var promise = webCaptureProxy(obj);//webInfo, action, date, type
            writeFile(promise, file, path);
            promises.push(promise);
        }
    };
});

app.factory('captures', function (dljrAction, kfjjAction, dlbxAction) {
    return {
        dljr: dljrAction,
        kfjj: kfjjAction,
        dlbx: dlbxAction
    }
});

