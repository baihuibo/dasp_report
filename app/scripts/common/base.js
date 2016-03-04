/**
 * Created by baihuibo on 16/1/26.
 */
import 'angular-material';
import 'angular-electron';
import 'angular-route';
import 'angular-resource';
import 'co';
import 'lodash';
import 'moment';
import './directives';
import config from 'config';

var base = angular.module('base', ['directives', 'ngMaterial', 'angular-electron', 'ngRoute', 'ngResource']);

base.constant('config', config);

base.config(function (remoteProvider) {
    remoteProvider.register('EasyZip', function (remote) {
        return remote.require('easy-zip');
    });

    remoteProvider.register('nodemailer');
});
base.factory('toast', function ($mdToast) {
    return function (message, delay, position) {
        $mdToast.show(
            $mdToast.simple()
                .parent($('#container'))
                .textContent(message)
                .position(position || 'top right')
                .hideDelay(delay || 2000)
        );
    }
});
base.factory('co', function () {
    return function (gen, ...args) {
        return new Promise(function (resolve, reject) {
            co(gen)(...args, function (err, ret) {
                if (err) {
                    reject(err);
                } else {
                    resolve(ret);
                }
            });
        });
    };
});
base.factory('timer', function ($log) {
    var calls = {};

    setInterval(function () {
        var d = moment().toArray();
        //d = [yyyy,MM,dd,hh,mm,ss]
        var time = d[3] + ':' + d[4];

        $log.debug('timer : ', time + ':' + d[5]);

        try {
            if (calls[time] && !calls[time].called) {
                calls[time].called = true;
                calls[time](time);
            }
        } catch (e) {
        }
    }, 5 * 1000);

    return {
        reg: function (time, msg, call) {
            if (arguments.length === 3) {
                $log.log('定时器注册.', time, msg);
            } else {
                call = msg;
            }
            calls[time] = call;
        },

        unReg: function (time, call) {
            delete calls[time];
        }
    };
});
base.factory('ZipFile', function (EasyZip) {
    return function (files, writePath, done) {
        var ez = new EasyZip();

        console.time('文件打包用时');
        ez.batchAdd(files, function () {
            ez.writeToFile(writePath);
            console.timeEnd('文件打包用时');
            done && done(writePath);
        });
    }
});
base.factory('sendMail', function (nodemailer) {
    return function (options, done) {
        var transporter = nodemailer.createTransport({
            host: 'smtp.mxhichina.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'baihuibo@ideadata.com.cn',
                pass: '1234a!@#$'
            }
        });

        // setup e-mail data with unicode symbols
        if (!options || _.isString(options)) {
            options = {
                from: 'baihuibo <baihuibo@ideadata.com.cn>', // sender address
                to: options, // list of receivers
                subject: 'Hello ✔', // Subject line
                text: 'Hello world ', // plaintext body
                html: '<b>Hello world 王哲亲</b>' // html body
            };
        } else {
            options.from = 'baihuibo <baihuibo@ideadata.com.cn>';
        }

        console.time('邮件发送用时');
        // send mail with defined transport object
        transporter.sendMail(options, function (error, info) {
            if (error) {
                return console.log(error);
            }

            console.timeEnd('邮件发送用时');
            console.log('Message sent: ' + info.response);
            done && done(info);
        });
    }
});
base.factory('date', function () {
    return {
        time: function (format) {
            return moment().format(format || 'YYYY-MM-DD_HHmmss');
        }
    }
});
base.factory('csv', function () {
    function format(str) {
        if (!str)return '';
        return str.replace(/"/g, "'").replace(/\s+/g, ' ');
    }

    var csv = {
        csv: function (datas, cols) {
            var content = csv.title(cols) + '\n' + csv.bodys(datas, cols);
            return "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(content);
        },

        title: function (cols) {
            return '"' + cols.join('","') + '"';
        },

        body: function (data, cols) {
            return '"' + cols.map(function (key) {
                    return format(data[key]);
                }).join('","') + '"';
        },

        bodys: function (datas, cols) {
            return datas.map(function (item) {
                return csv.body(item, cols);
            }).join('\n');
        }
    };

    return csv;
});