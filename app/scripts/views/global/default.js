/**
 * Created by baihuibo on 16/1/27.
 */
import app from 'app';
import webList from 'webList!json';
import webListDefault from 'webListDefault!json';

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

app.run(function ($rootScope, menu) {
    //菜单注入
    $rootScope.menus = menu.getMenu();

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
});