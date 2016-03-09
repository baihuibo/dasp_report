/**
 * Created by baihuibo on 16/3/8.
 */
import app from 'app';

app.factory('captures', function (webCaptureProxy, $q, webLogs, date, writeFile, fs) {

    function proxy(path, file, promises, ...args) {
        if (!fs.existsSync(path + '/' + file)) {
            var promise = webCaptureProxy(...args);//webInfo, action, date, type
            writeFile(promise, file, path);
            promises.push(promise);
        }
    }

    return {
        dljr: function (info, d, time, path) {
            webLogs.push({message: `[${info.name}] 开始抓取报表`, time: date.nowTime()});

            function dljr(date, type, subtract) {
                var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';
                var m = moment(date);
                if (subtract) {
                    m.subtract(1, 'year');
                }
                var params = ['detailFunId=FRL-RPT-02-004',
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
                    `rpa_44=${type}`,
                    'rpa_281=2',
                    'outputFormat=HTML'
                ];
                return action + '?' + params.join('&');
            }

            function dljr2(date, type, subtract) {
                var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';
                var m = moment(date);
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
                    `rpa_44=${type}`,
                    'outputFormat=HTML'
                ];
                return action + '?' + params.join('&');
            }

            var ps1 = [];

            var type = 1; //邮政储蓄银行网点
            var type2 = 2;//邮政储蓄代理网点

            //中国邮政储蓄存款余额增长情况统计表-日报
            //邮政储蓄银行网点
            proxy(path, `CUST_BANK_DAY_${time}.csv`, ps1, info, dljr(d, type), time);
            //邮政储蓄代理网点
            proxy(path, `CUST_PROXY_DAY_${time}.csv`, ps1, info, dljr(d, type2), time);

            //去年
            //邮政储蓄银行网点
            proxy(path, `CUST_BANK_DAY_SAME_${time}.csv`, ps1, info, dljr(d, type, 1), time);
            //邮政储蓄代理网点
            proxy(path, `CUST_PROXY_DAY_SAME_${time}.csv`, ps1, info, dljr(d, type2, 1), time);

            return $q.all(ps1).then(function () {
                //中国邮政储蓄存款余额分种类统计表-日报
                var ps2 = [];
                proxy(path, `CUST_DIV_DAY_BANK_${time}.csv`, ps2, info, dljr2(d, type), time, 1);
                proxy(path, `CUST_DIV_DAY_TOTAL_${time}.csv`, ps2, info, dljr(d, type2), time, 1);

                //去年
                proxy(path, `CUST_DIV_DAY_BANK_SAME_${time}.csv`, ps2, info, dljr(d, type, 1), time, 1);
                proxy(path, `CUST_DIV_DAY_TOTAL_SAME_${time}.csv`, ps2, info, dljr(d, type2, 1), time, 1);
                return $q.all(ps2);
            });
        }
    }
});

