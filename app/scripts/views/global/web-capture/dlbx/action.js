/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('dlbxAction', function ($q, webLogs, date, config, actionProxy, basePath, $log) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var dlbx = config.dlbx,
            hds_dl = dlbx.hds_dl,
            hds_qj = dlbx.hds_qj,
            hds_yy = dlbx.hds_yy;

        return $q.all()//代理-本日
            .then(getReport(dlbx.insu_day, dl_fn(), hds_dl))//代理-本日
            .then(getReport(dlbx.insu_day_same, dl_fn('year'), hds_dl))//代理-本日同期
            .then(getReport(dlbx.insu_month, dl_fn(null, 1), hds_dl))//代理-本月
            .then(getReport(dlbx.insu_month_same, dl_fn('year', 1), hds_dl))//代理-本月同期

            .then(getReport(dlbx.insu_per_mon, qj_fn(null, 1, 2), hds_qj))//期缴-本月
            .then(getReport(dlbx.insu_per_mon_same, qj_fn('year', 1, 2), hds_qj))//期缴-本月同期
            .then(getReport(dlbx.insu_per_total_mon, qj_fn(null, 1, 9), hds_qj))//期缴-邮银本月
            .then(getReport(dlbx.insu_per_total_mon_same, qj_fn('year', 1, 9), hds_qj))//期缴-邮银本月同期


            .then(getReport(dlbx.insu_total_mon, yy_fn(null, 1), hds_yy))//邮银-本月
            .then(getReport(dlbx.insu_total_mon_same, yy_fn('year', 1), hds_yy))//邮银-本月同期
            ;

        function getReport(name, action, hds, first) {
            return function () {
                var promises = [];
                actionProxy(path, `${name}_${time}.csv`, promises, {web, action, time, hds, down: name, basePath});
                if (first) {
                    return promises;
                }
                return $q.all(promises);
            }
        }

        function dl_fn(subtract, day) {
            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581711_0.do',
                params: _def({
                    'org.apache.struts.taglib.html.TOKEN': '912d19e7dc734989ecd8dc40f3f9c3c1',
                    g_i_unit_property: 2
                }, _ds(subtract, day))
            };
        }

        function qj_fn(subtract, day, unit) {
            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581717.do',
                params: _def({
                    'org.apache.struts.taglib.html.TOKEN': 'a393cc6ad3bc59d89dea8d9dbfa022e4',
                    g_i_unit_property: unit
                }, _ds(subtract, day))
            };
        }

        function yy_fn(subtract, day) {
            return {
                url: 'http://10.2.3.237:7001/ncpai/report_581711_0.do',
                params: _def({
                    'org.apache.struts.taglib.html.TOKEN': '912d19e7dc734989ecd8dc40f3f9c3c1',
                    g_i_unit_property: 9
                }, _ds(subtract, day))
            };
        }

        function _ds(subtract, day) {
            var start = moment(d);
            var end = moment(d);
            if (subtract) {
                start.subtract(1, subtract);
                end.subtract(1, subtract);
            }

            if (_.isNumber(day)) {
                start.startOf('month');
            }
            return [start, end, moment()];
        }

        function _def(param, ds) {
            return _.extend({
                g_i_start_date: ds[0].format('YYYYMMDD'),
                g_i_stop_date: ds[1].format('YYYYMMDD'),
                s_inst_id: '11005293', //orgId
                sys_dt: ds[2].format('YYYYMMDD')
            }, param);
        }

    }
});