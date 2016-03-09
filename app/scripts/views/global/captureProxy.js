/**
 * Created by baihuibo on 16/3/8.
 */
import app from 'app';

app.factory('captures', function (webCaptureProxy, $q, webLogs, date, writeFile, fs) {

    function dljrAction(date, type, funId, subtract) {
        var action = 'http://plserver/rptsearch/splitUrltoReadReport.action';
        var m = moment(date);
        if (subtract) {
            m.subtract(1, 'year');
        }
        var params = ['detailFunId=FRL-RPT-02-004',
            `oGlobalFunId=${funId}`,
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

    function proxy(webInfo, action, path, fileName, promises, type) {
        if (!fs.existsSync(path + '/' + fileName)) {
            var promise = webCaptureProxy(webInfo, action, type);
            writeFile(promise, fileName, path);
            promises.push(promise);
        }
    }

    return {
        dljr: function (webInfo, d, name, path) {
            webLogs.push({message: `[${webInfo.name}] 开始抓取报表`, time: date.nowTime()});

            var ps = [];

            //邮政储蓄银行网点
            proxy(webInfo, dljrAction(d, 1, 1918), path, `CUST_BANK_DAY_${name}.csv`, ps);
            //邮政储蓄代理网点
            proxy(webInfo, dljrAction(d, 2, 1918), path, `CUST_PROXY_DAY_${name}.csv`, ps);

            //去年
            //邮政储蓄银行网点
            proxy(webInfo, dljrAction(d, 1, 1918, true), path, `CUST_BANK_DAY_SAME_${name}.csv`, ps);
            //邮政储蓄代理网点
            proxy(webInfo, dljrAction(d, 2, 1918, true), path, `CUST_PROXY_DAY_SAME_${name}.csv`, ps);

            return $q.all(ps).then(function () {
                var ps2 = [];
                //proxy(webInfo, dljrAction(d, 1), path, `CUST_BANK_DAY_${name}.csv`, promise2);
                //proxy(webInfo, dljrAction(d, 2), path, `CUST_PROXY_DAY_${name}.csv`, promise2);

                return $q.all(ps2);
            });
        }
    }
});

