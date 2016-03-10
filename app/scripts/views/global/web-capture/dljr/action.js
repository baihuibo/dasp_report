/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('dljrAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var ps1 = [];

        //中国邮政储蓄存款余额增长情况统计表-日报
        //邮政储蓄银行网点
        actionProxy(path, `${config.dljr.bank}_${time}.csv`, ps1, {
            web,
            action: dljr(config.dljr.rpa1),
            time,
            hds: config.dljr.hds1
        });
        //邮政储蓄代理网点
        actionProxy(path, `${config.dljr.proxy}_${time}.csv`, ps1, {
            web,
            action: dljr(config.dljr.rpa2),
            time,
            hds: config.dljr.hds1
        });

        //去年
        //邮政储蓄银行网点
        actionProxy(path, `${config.dljr.bank_same}_${time}.csv`, ps1, {
            web,
            action: dljr(config.dljr.rpa1, 1),
            time,
            hds: config.dljr.hds1
        });
        //邮政储蓄代理网点
        actionProxy(path, `${config.dljr.proxy_same}_${time}.csv`, ps1, {
            web,
            action: dljr(config.dljr.rpa2, 1),
            time,
            hds: config.dljr.hds1
        });

        return $q.all(ps1).then(function () {
            //中国邮政储蓄存款余额分种类统计表-日报
            var ps2 = [];
            actionProxy(path, `${config.dljr.div_bank}_${time}.csv`, ps2, {
                web,
                action: dljr2(config.dljr.rpa1),
                time,
                hds: config.dljr.hds2
            });
            actionProxy(path, `${config.dljr.div_total}_${time}.csv`, ps2, {
                web,
                action: dljr2(config.dljr.rpa2),
                time,
                hds: config.dljr.hds2
            });

            //去年
            actionProxy(path, `${config.dljr.div_bank_same}_${time}.csv`, ps2, {
                web,
                action: dljr2(config.dljr.rpa1, 1),
                time,
                hds: config.dljr.hds2
            });
            actionProxy(path, `${config.dljr.div_total_same}_${time}.csv`, ps2, {
                web,
                action: dljr2(config.dljr.rpa2, 1),
                time,
                hds: config.dljr.hds2
            });
            return $q.all(ps2);
        });

        function dljr(rpa, subtract) {
            var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';
            var m = moment(d);
            if (subtract) {
                m.subtract(1, 'year');
            }
            var params = [
                'detailFunId=FRL-RPT-02-004',
                `oGlobalFunId=1918`,
                'repTypeCd=2',
                'p_srcOrgCd=999999888',
                'p_srcOrgLev=1',
                'p_provCd=99',
                'p_repserverconcd=5',
                'p_rptCyc=0',
                `p_dateDesc=${m.format('YYYY')}year${m.format('MM')}month${m.format('DD')}day`,
                `p_beginDate=${m.format('YYYYMMDD')}`,
                `p_beginMonth=${m.format('YYYYMM')}`,
                `p_endDate=${m.format('YYYYMMDD')}`,
                `p_endMonth=${m.format('YYYYMM')}`,
                'p_dateCount=0',
                `rpa_44=${rpa}`,
                'rpa_281=2',
                'outputFormat=HTML'
            ];
            return action + '?' + params.join('&');
        }

        function dljr2(rpa, subtract) {
            var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';
            var m = moment(d);
            if (subtract) {
                m.subtract(1, 'year');
            }
            var params = [
                `detailFunId=FRL-RPT-02-003`,
                `oGlobalFunId=1915`,
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
                `p_dateCount=0`,
                `rpa_44=${rpa}`,
                'outputFormat=HTML'
            ];
            return action + '?' + params.join('&');
        }
    }
});