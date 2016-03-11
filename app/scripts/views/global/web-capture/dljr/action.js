/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('dljrAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var dljrc = config.dljr;

        var maps = {
            [dljrc.bank]: dljr(dljrc.rpa1),
            [dljrc.proxy]: dljr(dljrc.rpa2),
            [dljrc.bank_same]: dljr(dljrc.rpa1, 1),
            [dljrc.proxy_same]: dljr(dljrc.rpa2, 1)
        };

        return $q.all(getReports(maps, config.dljr.hds1))
            .then(function () {
                //中国邮政储蓄存款余额分种类统计表-日报
                var maps = {
                    [dljrc.div_bank]: dljr2(dljrc.rpa1),
                    [dljrc.div_total]: dljr2(dljrc.rpa2),
                    [dljrc.div_bank_same]: dljr2(dljrc.rpa1, 1),
                    [dljrc.div_total_same]: dljr2(dljrc.rpa2, 1)
                };

                return $q.all(getReports(maps, dljrc.hds2));
            });

        function getReports(maps, hds) {
            var promises = [];
            _.each(maps, function (action, name) {
                actionProxy(path, `${name}_${time}.csv`, promises, {web, action, time, hds});
            });
            return promises;
        }

        function dljr(rpa, subtract) {
            var params = [
                'detailFunId=FRL-RPT-02-004',
                `oGlobalFunId=1918`,
                `rpa_44=${rpa}`,
                'rpa_281=2'
            ];
            return action + '?' + _def(params, dt(subtract)).join('&');
        }

        function dljr2(rpa, subtract) {
            var params = [
                `detailFunId=FRL-RPT-02-003`,
                `oGlobalFunId=1915`,
                `rpa_44=${rpa}`
            ];
            return action + '?' + _def(params, dt(subtract)).join('&');
        }

        function dt(subtract) {
            var m = moment(d);
            if (subtract) {
                m.subtract(1, 'year');
            }
            return m;
        }

        function _def(param, m) {
            return [
                `repTypeCd=2`,
                `p_srcOrgCd=999999888`,
                `p_srcOrgLev=1`,
                `p_provCd=99`,
                `p_repserverconcd=5`,
                `p_rptCyc=0`,
                `p_dateDesc=${m.format('YYYY')}year${m.format('MM')}month${m.format('DD')}day`,
                `p_beginDate=${m.format('YYYYMMDD')}`,
                `p_beginMonth=${m.format('YYYYMM')}`,
                `p_endDate=${m.format('YYYYMMDD')}`,
                `p_endMonth=${m.format('YYYYMM')}`,
                'p_dateCount=0',
                'outputFormat=HTML'
            ].concat(param);
        }
    }
});