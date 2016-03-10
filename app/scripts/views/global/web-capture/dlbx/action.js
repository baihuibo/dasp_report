/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('dlbxAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var ps1 = [];

        //代理-本日
        actionProxy(path, `${config.dlbx.insu_day}_${time}.csv`, ps1, {
            web,
            action: dl_fn(),
            time,
            hds: config.dlbx.hds_dl
        });

        //代理-本日同期
        actionProxy(path, `${config.dlbx.insu_day_same}_${time}.csv`, ps1, {
            web,
            action: dl_fn('year'),
            time,
            hds: config.dlbx.hds_dl
        });

        //代理-本月
        actionProxy(path, `${config.dlbx.insu_month}_${time}.csv`, ps1, {
            web,
            action: dl_fn(null, 1),
            time,
            hds: config.dlbx.hds_dl
        });

        //代理-本月同期
        actionProxy(path, `${config.dlbx.insu_month_same}_${time}.csv`, ps1, {
            web,
            action: dl_fn('year', 1),
            time,
            hds: config.dlbx.hds_dl
        });

        return $q.all(ps1).then(function () {
            var ps2 = [];
            //期缴-本月
            actionProxy(path, `${config.dlbx.insu_per_mon}_${time}.csv`, ps2, {
                web,
                action: qj_fn(null, 1, 2),
                time,
                hds: config.dlbx.hds_qj
            });

            //期缴-本月同期
            actionProxy(path, `${config.dlbx.insu_per_mon_same}_${time}.csv`, ps2, {
                web,
                action: qj_fn('year', 1, 2),
                time,
                hds: config.dlbx.hds_qj
            });

            //期缴-邮银本月
            actionProxy(path, `${config.dlbx.insu_per_total_mon}_${time}.csv`, ps2, {
                web,
                action: qj_fn(null, 1, 9),
                time,
                hds: config.dlbx.hds_qj
            });

            //期缴-邮银本月同期
            actionProxy(path, `${config.dlbx.insu_per_total_mon_same}_${time}.csv`, ps2, {
                web,
                action: qj_fn('year', 1, 9),
                time,
                hds: config.dlbx.hds_qj
            });


            return $q.all(ps2).then(function () {
                var ps3 = [];

                //邮银-本月
                actionProxy(path, `${config.dlbx.insu_total_mon}_${time}.csv`, ps3, {
                    web,
                    action: yy_fn(null, 1),
                    time,
                    hds: config.dlbx.hds_yy
                });

                //邮银-本月同期
                actionProxy(path, `${config.dlbx.insu_total_mon_same}_${time}.csv`, ps3, {
                    web,
                    action: yy_fn('year', 1),
                    time,
                    hds: config.dlbx.hds_yy
                });

                return $q.all(ps3);

            });
        });

        function dl_fn(subtract, day) {
            var start = moment(d);
            var end = moment(d);
            var nowtime = moment();
            if (subtract) {
                start.subtract(1, subtract);
                end.subtract(1, subtract);
            }

            if (_.isNumber(day)) {
                start.day(day);
            }

            var params = {
                g_i_start_date: start.format('YYYYMMDD'),
                g_i_stop_date: end.format('YYYYMMDD'),
                s_inst_id: '11005293', //orgId
                sys_dt: nowtime.format('YYYYMMDD'),
                'org.apache.struts.taglib.html.TOKEN': '912d19e7dc734989ecd8dc40f3f9c3c1',
                g_i_unit_property: 2
            };

            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581711_0.do',
                params: params
            };

        }

        function qj_fn(subtract, day, unit) {
            var start = moment(d);
            var end = moment(d);
            var nowtime = moment();
            if (subtract) {
                start.subtract(1, subtract);
                end.subtract(1, subtract);
            }

            if (_.isNumber(day)) {
                start.day(day);
            }

            var params = {
                g_i_start_date: start.format('YYYYMMDD'),
                g_i_stop_date: end.format('YYYYMMDD'),
                s_inst_id: '11005293', //orgId
                sys_dt: nowtime.format('YYYYMMDD'),
                'org.apache.struts.taglib.html.TOKEN': 'a393cc6ad3bc59d89dea8d9dbfa022e4',
                g_i_unit_property: unit
            };

            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581717.do',
                params: params
            };
        }

        function yy_fn(subtract, day) {
            var start = moment(d);
            var end = moment(d);
            var nowtime = moment();
            if (subtract) {
                start.subtract(1, subtract);
                end.subtract(1, subtract);
            }

            if (_.isNumber(day)) {
                start.day(day);
            }

            var params = {
                g_i_start_date: start.format('YYYYMMDD'),
                g_i_stop_date: end.format('YYYYMMDD'),
                s_inst_id: '11005293', //orgId
                sys_dt: nowtime.format('YYYYMMDD'),
                'org.apache.struts.taglib.html.TOKEN': '912d19e7dc734989ecd8dc40f3f9c3c1',
                g_i_unit_property: 9
            };

            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581717.do',
                params: params
            };
        }

    }
});