/**
 * Created by baihuibo on 16/1/27.
 */
import app from 'app';
import webList from 'webList!json';
import webListDefault from 'webListDefault!json';
import './webLogin';
import './capture';

app.config(function ($routeProvider, $mdDateLocaleProvider) {
    //默认路由
    $routeProvider.otherwise('/dashboard');


    //日历本地化
    $mdDateLocaleProvider.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    $mdDateLocaleProvider.shortMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

    $mdDateLocaleProvider.days = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    $mdDateLocaleProvider.shortDays = ['日', '一', '二', '三', '四', '五', '六'];
    // Can change week display to start on Monday.

    $mdDateLocaleProvider.firstDayOfWeek = 1;
});

//dialog方法通用实现
app.factory('dialogImpr', function () {
    return function ($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (ret) {
            $mdDialog.hide(ret);
        };
    }
});

app.filter('dialogOk', function () {
    return function (isCreate) {
        return isCreate ? '确定' : '保存修改';
    }
});

app.factory('webLogs', function () {
    return [];
});

app.filter('reverse', function () {
    return function (arr) {
        if (arr) {
            return arr.reverse();
        }
        return arr;
    }
});

app.factory('webList', function (fs) {

    function saveAsFile() {
        fs.writeFileSync(`${__dirname}/data/webList.json`, angular.toJson(webList, true));
    }

    return {
        restore: function () {
            webList.length = 0;
            webList.push(...webListDefault);
            saveAsFile();
        },

        getList: function () {
            return webList;
        },

        saveAsFile: saveAsFile
    }
});

app.provider('menu', function () {
    var menus = [];
    return {
        register: function (menu) {
            menus.push(menu);
        },
        $get: function () {
            return {
                getMenu: function () {
                    return menus;
                }
            }
        }
    }
});

app.factory('captures', function (webCapture, $q) {
    return {
        dljr: function () {
            var q = $q.defer();

            q.notify();
            q.reject();
            q.resolve();

            return q.promise;
        }
    }
});

app.run(function ($rootScope, menu, webLogin, webLogs, date) {
    //菜单注入
    $rootScope.menus = menu.getMenu();

    $rootScope.webLogs = webLogs;

    var activeRoute = '';
    $rootScope.$on('$routeChangeSuccess', function (e, route) {
        if (route.$$route) {
            activeRoute = route.$$route.originalPath;
        }
    });

    $rootScope.$on('$routeChangeStart', function (e, route) {
        setTitle(null);
    });

    //设置标题
    var setTitle = $rootScope.setTitle = function (title) {
        $rootScope.pageTitle = title;
    };

    //页面是否激活
    $rootScope.isActive = function (route) {
        return activeRoute === route;
    };

    var loginState = {};
    $rootScope.login = function (webInfo, done) {
        if (loginState[webInfo._type]) {//正在登录
            return;
        }

        // http://plserver/rptsearch/splitUrltoReadReport.action?detailFunId=FRL-RPT-02-004&oGlobalFunId=1918&repTypeCd=2&p_srcOrgCd=999999888&p_srcOrgLev=1&p_provCd=99&p_repserverconcd=5&p_rptCyc=0&p_dateDesc=2016year03month06day&p_beginDate=20160306&p_beginMonth=201603&p_endDate=20160306&p_endMonth=201603&p_dateCount=0&rpa_44=2&rpa_281=2&outputFormat=HTML

        loginState[webInfo._type] = 1;

        webLogs.push({message: `[${webInfo.name}] 开始登录`, time: date.nowTime()});

        webLogin(webInfo).then(function () {
            webLogs.push({message: `[${webInfo.name}] 登录成功`, time: date.nowTime()});
            done && done();
            delete loginState[webInfo._type];//登录成功
        }, function (message) {
            delete loginState[webInfo._type];//登录失败
            webLogs.push({message: `[${webInfo.name}] 登录失败 (${message})`, time: date.nowTime()});
        });
    };
});