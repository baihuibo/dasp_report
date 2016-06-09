/**
 * Created by baihuibo on 16/2/2.
 */
var pack = require('electron-packager');

pack({
    arch: 'ia32', //ia32 , x64 , all
    platform: 'win32', //linux , win32 , darwin , all
    dir: '.',
    //asar: true,
    //icon : '',
    ignore: /(\.idea|output|examples|tests)/i,
    name: 'dasp_report',
    out: 'output',
    overwrite: true,
    version: '0.36.9'
}, function done(err, appPath) {
    if (err) {
        console.log('err : ', err);
    }

    console.log('appPath : ', appPath);
});

