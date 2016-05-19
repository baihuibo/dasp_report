/**
 * Created by baihuibo on 16/1/27.
 */
import app from 'app';

let route = '/dashboard';
let name = '仪表盘';
let icon = 'dashboard';

app.config(function ($routeProvider, menuProvider) {
    menuProvider.register({
        name: name,
        icon: icon,
        route: route
    });

    $routeProvider.when(route, {
        templateUrl: 'scripts/views/dashboard/default.html',
        controller: 'DashboardCtrl'
    });
});

app.controller('DashboardCtrl', function ($scope, webList, captures, webLogs, date, storage, $mdDialog, timer) {
    var COLORS = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#e53935', '#d32f2f', '#c62828', '#b71c1c', '#ff8a80', '#ff5252', '#ff1744', '#d50000', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f', '#ff80ab', '#ff4081', '#f50057', '#c51162', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#4a148c', '#ea80fc', '#e040fb', '#d500f9', '#aa00ff', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#4527a0', '#311b92', '#b388ff', '#7c4dff', '#651fff', '#6200ea', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e', '#8c9eff', '#536dfe', '#3d5afe', '#304ffe', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1', '#82b1ff', '#448aff', '#2979ff', '#2962ff', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b', '#80d8ff', '#40c4ff', '#00b0ff', '#0091ea', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064', '#84ffff', '#18ffff', '#00e5ff', '#00b8d4', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#a7ffeb', '#64ffda', '#1de9b6', '#00bfa5', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20', '#b9f6ca', '#69f0ae', '#00e676', '#00c853', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e', '#ccff90', '#b2ff59', '#76ff03', '#64dd17', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#cddc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717', '#f4ff81', '#eeff41', '#c6ff00', '#aeea00', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17', '#ffff8d', '#ffff00', '#ffea00', '#ffd600', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00', '#ffe57f', '#ffd740', '#ffc400', '#ffab00', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100', '#ffd180', '#ffab40', '#ff9100', '#ff6d00', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c', '#ff9e80', '#ff6e40', '#ff3d00', '#dd2c00', '#d7ccc8', '#bcaaa4', '#795548', '#d7ccc8', '#bcaaa4', '#8d6e63', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#607d8b', '#546e7a', '#cfd8dc', '#b0bec5', '#78909c'];

    function randomColor() {
        return COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    $scope.captureDay = (+storage.getItem('captureDay')) || 1;

    $scope.maxDate = moment().subtract(1, 'day').toDate();
    function setDate() {
        $scope.date = moment().subtract($scope.captureDay, 'day').toDate();
    }

    setDate();

    $scope.saveCaptureDay = function () {
        storage.setItem('captureDay', $scope.captureDay || 1);
        setDate();
    };

    $scope.tiles = webList.getList();

    _.each($scope.tiles, function (tile) {
        tile.color = randomColor();
    });

    $scope.start = function (web) {
        var time = moment($scope.date).format('YYYYMMDD');
        var path = storage.savePath + '/' + time;

        $scope.login(web, function () {//登录成功
            //采集表表
            var q = captures[web._type]({path, time, web, date: $scope.date});

            q.then(function done() {
                webLogs.push({
                    message: `[${web.name}] 抓取成功`,
                    time: date.nowTime()
                });
            }, function fail(msg) {
                webLogs.push({
                    message: `[${web.name}] 抓取失败 (${msg || ''})`,
                    time: date.nowTime()
                });
            });
        });
    };

    $scope.startAll = function () {
        if (!storage.savePath) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent('#container')
                    .clickOutsideToClose(true)
                    .title('警告')
                    .textContent('请设置存储路径.')
                    .ok('Got it!')
            ).then(function () {
                location.href = '#/settings?savePath=1';
            });
            return;
        }

        $scope.tiles.forEach(function (tile) {
            $scope.start(tile);
        });
    };

    $scope.timerTooltip = '设置定时器';
    var timConfig = localStorage.getItem('timerConfig');
    if (timConfig) {
        timConfig = normalTimer(JSON.parse(timConfig));
        $scope.timerTooltip = getMsg(timConfig);
        timer.setTask(timConfig, $scope.startAll);
    }

    $scope.setTimer = function (ev) {
        $mdDialog.show({
                controller: SetTimerDialogController,
                templateUrl: 'scripts/views/dashboard/setTimer.html',
                targetEvent: ev,
                locals: {
                    opt: timConfig || {}
                }
            })
            .then(function (opt) {
                if (opt) {
                    if (opt.enable == 1) {//启用
                        $scope.timerTooltip = getMsg(opt);
                    } else {//关闭
                        $scope.timerTooltip = '设置定时器';
                    }
                    localStorage.setItem('timerConfig', JSON.stringify(opt));
                    timConfig = opt;
                    timer.setTask(opt, $scope.startAll);
                }
            });
    };

    function normalTimer(opt) {
        if (_.isString(opt.date)) {
            opt.date = moment(opt.date).toDate();
        }
        if (_.isString(opt.startDate)) {
            opt.startDate = moment(opt.startDate).toDate();
        }
        if (_.isString(opt.endDate)) {
            opt.endDate = moment(opt.endDate).toDate();
        }
        return opt;
    }
});

function SetTimerDialogController($scope, $mdDialog, dialogImpr, opt) {
    dialogImpr($scope, $mdDialog);
    $scope.opt = angular.copy(opt);
    if (!$scope.opt.date) {
        $scope.opt.date = new Date();
    }
    if (!$scope.opt.startDate) {
        $scope.opt.startDate = new Date();
    }
    if (!$scope.opt.endDate) {
        $scope.opt.endDate = new Date();
    }
    if (!$scope.opt.enable) {
        $scope.opt.enable = 0;
    }

    $scope.$watch('opt.enable', function (enable) {
        $scope.enabled = +enable == 1;
    });

    $scope.getMsg = getMsg;
}

function getMsg(opt) {
    if (opt.enable == 0) {
        return '定时器已关闭';
    }

    var pre = '定时器将在', msg;
    var st = opt.startTime || '',
        sd = opt.startDate,
        ed = opt.endDate;
    switch (opt.type) {
        case '0'://一次
            msg = `${pre} ${formatDate(opt.date)} (${st}) 启动`;
            break;
        case '1'://每天
            msg = `每天 (${st}) 启动,此计划持续时间从 ${formatDate(sd)}  开始 到 ${formatDate(ed)} 结束`;
            break;
        case '2'://每周
            msg = `每周 (${getWeek(opt.week)} ${st}) 启动,此计划持续时间从 ${formatDate(sd)}  开始 到 ${formatDate(ed)} 结束`;
            break;
        case '3'://每月
            msg = `每月 (${getDays(opt.days)} ${st}) 启动,此计划持续时间从 ${formatDate(sd)}  开始 到 ${formatDate(ed)} 结束`;
            break;
    }
    return msg;
}

function getDays(days) {
    if (days) {
        return days.map(function (day) {
                return day + '号'
            }).join('、') + ' 的 ';
    }
    return '';
}

function formatDate(d) {
    return moment(d).format('YYYY-MM-DD')
}

var Week = {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
};
function getWeek(week) {
    if (week) {
        return week.map(function (v) {
            return Week[v];
            }).join(',') + ' 的 ';
    }
    return '';
}