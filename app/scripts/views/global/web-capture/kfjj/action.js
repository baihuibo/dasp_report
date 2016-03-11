/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('kfjjAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        var action = 'http://10.2.3.223/FdimWebApp/Welcome?MainOp=Stat&Stat=';

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});
        var kfjj = config.kfjj;

        //国债
        var maps = {
            [kfjj.gz_year]: gz_io(null, 0, 1),//GZ04-本年
            [kfjj.gz_year_same]: gz_io('year', 0, 1),//GZ04-本年同期
            [kfjj.gz_mon]: gz_io(null, null, 1),//GZ04-本月
            [kfjj.gz_mon_same]: gz_io('year', null, 1)//GZ04-本月同期
        };

        return $q.all(getReports(maps, kfjj.gz_hds))
            .then(function () {
                //基金
                var maps = {
                    [kfjj.jj_year]: jj_io(null, 0, 1),//JJ03-本年
                    [kfjj.jj_year_same]: jj_io('year', 0, 1),//JJ03-本年同期
                    [kfjj.jj_day]: jj_io(),//JJ03-本日
                    [kfjj.jj_day_same]: jj_io('year'),//JJ03-本日同期
                    [kfjj.jj_mon]: jj_io(null, null, 1),//JJ03-本月
                    [kfjj.jj_mon_same]: jj_io('year', null, 1)//JJ03-本月同期
                };

                return $q.all(getReports(maps, kfjj.jj_hds));
            })
            .then(function () {
                //理财
                var maps = {
                    [kfjj.lc_day]: lc_io(),//LC05-本日
                    [kfjj.lc_day_same]: lc_io('day'),//LC05-上日
                    [kfjj.lc_day_total]: lc_io(null, null, null, -1)//LC05-邮银合计
                };

                return $q.all(getReports(maps, kfjj.lc_hds));
            });

        function getReports(maps, hds) {
            var promises = [];
            _.each(maps, function (action, name) {
                actionProxy(path, `${name}_${time}.csv`, promises, {web, action, time, hds});
            });
            return promises;
        }

        //理财
        function lc_io(subtract, mon, day, organtype) {
            var name = 'LC05';
            return {
                url: action + name,
                params: _def({
                    paraPayFlag: name,
                    setupflag: 0,
                    organtype: organtype || 2
                }, dt(subtract, mon, day))
            };
        }

        //基金
        function jj_io(subtract, mon, day) {
            var name = 'JJ03';
            return {
                url: action + name,
                params: _def({
                    olevel: 0,
                    agentCorpCode: -1,
                    organtype: 2,
                    risklevel: -1,
                    chargerate: -1,
                    reporttType: 1
                }, dt(subtract, mon, day), name)
            };
        }

        //国债
        function gz_io(subtract, mon, day) {
            var name = 'GZ04';
            return {
                url: action + name,
                params: _def({
                    olevel: 0,
                    kindtype: -1,
                    organtype: 2
                }, dt(subtract, mon, day), name)
            };
        }

        function dt(subtract, mon, day) {
            var start = moment(d);
            var end = moment(d);
            if (subtract) {
                start.subtract(1, subtract);
                end.subtract(1, subtract);
            }
            if (_.isNumber(day)) {
                start.date(day);
            }
            if (_.isNumber(mon)) {
                start.month(mon);
            }

            return [start, end];
        }

        function _def(param, ds, rid) {
            var [start , end] = ds;
            var params = {
                paraPayFlag: rid,
                rid: rid,
                hidecountry: 11005293,
                hideprovince: -1,
                hidecity: -1,
                hidearea: -1,
                hidebranch: -1,
                province: -1,
                area: -1,
                city: -1,
                kindCode: -1,
                branch: -1,
                searchlevel: 'provincecode',
                sellchnlno: -1,
                searchkind: -1,
                paraPeriod: 'y',

                bYear: start.format('YYYY'),
                bMonth: start.format('MM'),
                bDay: start.format('DD'),

                //end
                paraYear: end.format('YYYY'),
                paraMonth: end.format('MM'),
                paraDay: end.format('DD')
            };

            return _.extend(params, param);
        }
    }
});