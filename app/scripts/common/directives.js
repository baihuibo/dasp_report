/**
 * Created by baihuibo on 16/2/22.
 */

import 'angular';

var mod = angular.module('directives', []);
mod.directive('cuTimeSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        template: (`<md-select>
                        <md-option>01:00</md-option><md-option>02:00</md-option><md-option>03:00</md-option><md-option>04:00</md-option><md-option>05:00</md-option><md-option>06:00</md-option><md-option>07:00</md-option><md-option>08:00</md-option><md-option>09:00</md-option><md-option>10:00</md-option><md-option>11:00</md-option><md-option>12:00</md-option><md-option>13:00</md-option><md-option>14:00</md-option><md-option>15:00</md-option><md-option>16:00</md-option><md-option>17:00</md-option><md-option>18:00</md-option><md-option>19:00</md-option><md-option>20:00</md-option><md-option>21:00</md-option><md-option>22:00</md-option><md-option>23:00</md-option>
                   </md-select>`)
    }
});

mod.directive('cuTime2Select', function () {
    return {
        restrict: 'E',
        replace: true,
        template: (`<md-select>
                        <md-option value="1">1 小时</md-option><md-option value="2">2 小时</md-option><md-option value="3">3 小时</md-option><md-option value="4">4 小时</md-option><md-option value="5">5 小时</md-option><md-option value="6">6 小时</md-option><md-option value="7">7 小时</md-option><md-option value="8">8 小时</md-option><md-option value="9">9 小时</md-option><md-option value="10">10 小时</md-option><md-option value="11">11 小时</md-option><md-option value="12">12 小时</md-option>
                   </md-select>`)
    }
});

//选择时间间隔
mod.directive('cuTimeSptSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        template: (`<md-select>
                        <md-option value="15">15分钟</md-option>
                        <md-option value="30">30分钟</md-option>
                        <md-option value="60">60分钟</md-option>
                        <md-option value="120">120分钟</md-option>
                   </md-select>`)
    }
});

//选择星期
mod.directive('cuWeekTimeSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        template: (`<md-select>
                        <md-option value="1">周一</md-option>
                        <md-option value="2">周二</md-option>
                        <md-option value="3">周三</md-option>
                        <md-option value="4">周四</md-option>
                        <md-option value="5">周五</md-option>
                        <md-option value="6">周六</md-option>
                        <md-option value="7">周日</md-option>
                   </md-select>`)
    }
});

//选择天
mod.directive('cuDateSelect', function () {
    return {
        restrict: 'E',
        replace: true,
        template: (`<md-select>
                        <md-option value="1">1 号</md-option><md-option value="2">2 号</md-option><md-option value="3">3 号</md-option><md-option value="4">4 号</md-option><md-option value="5">5 号</md-option><md-option value="6">6 号</md-option><md-option value="7">7 号</md-option><md-option value="8">8 号</md-option><md-option value="9">9 号</md-option><md-option value="10">10 号</md-option><md-option value="11">11 号</md-option><md-option value="12">12 号</md-option><md-option value="13">13 号</md-option><md-option value="14">14 号</md-option><md-option value="15">15 号</md-option><md-option value="16">16 号</md-option><md-option value="17">17 号</md-option><md-option value="18">18 号</md-option><md-option value="19">19 号</md-option><md-option value="20">20 号</md-option><md-option value="21">21 号</md-option><md-option value="22">22 号</md-option><md-option value="23">23 号</md-option><md-option value="24">24 号</md-option><md-option value="25">25 号</md-option><md-option value="26">26 号</md-option><md-option value="27">27 号</md-option><md-option value="28">28 号</md-option><md-option value="29">29 号</md-option><md-option value="30">30 号</md-option>
                   </md-select>`)
    }
});