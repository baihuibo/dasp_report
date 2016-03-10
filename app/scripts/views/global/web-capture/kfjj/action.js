/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('kfjjAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var gz = [];//国债
        //国债

        //GZ04-本年 (今年-01-01  ->  今天)
        //GZ04-本年同期 (去年01-01  ->  去年的今天)
        //GZ04-本月 (今年-今月-01  -> 今天)
        //GZ04-本月同期 (去年-同月-01  -> 去年-同月-今天)


        return $q.all(gz).then(function () {
            var jj = [];//基金

            //JJ03-本年
            //JJ03-本年同期
            //JJ03-本日
            //JJ03-本日同期
            //JJ03-本月
            //JJ03-本月同期

            return $q.all(jj);
        }).then(function () {
            var lc = [];//理财

            //LC05-本日
            //LC05-上日
            //LC05-邮银合计

            return $q.all(lc);
        });

        function gz(rpa, subtract) {
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

    }
});