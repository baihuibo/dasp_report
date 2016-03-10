/**
 * Created by baihuibo on 16/3/10.
 */
import app from 'app';

app.factory('kfjjAction', function ($q, webLogs, date, config, actionProxy) {
    return function (obj) {
        var {web,path,time,date:d} = obj;

        webLogs.push({message: `[${web.name}] 开始抓取报表`, time: date.nowTime()});

        var gz = [];//国债
        //GZ04-本年 (今年-01-01  ->  今天)
        actionProxy(path, `${config.kfjj.gz_year}_${time}.csv`, gz, {
            web,
            action: gz_io(null, 0, 1),
            time,
            hds: config.kfjj.gz_hds
        });

        //GZ04-本年同期 (去年01-01  ->  去年的今天)
        actionProxy(path, `${config.kfjj.gz_year_same}_${time}.csv`, gz, {
            web,
            action: gz_io('year', 0, 1),
            time,
            hds: config.kfjj.gz_hds
        });

        //GZ04-本月 (今年-今月-01  -> 今天)
        actionProxy(path, `${config.kfjj.gz_year}_${time}.csv`, gz, {
            web,
            action: gz_io(null, null, 1),
            time,
            hds: config.kfjj.gz_hds
        });

        //GZ04-本月同期 (去年-今月-01  -> 去年-今月-今天)
        actionProxy(path, `${config.kfjj.gz_year_same}_${time}.csv`, gz, {
            web,
            action: gz_io('year', null, 1),
            time,
            hds: config.kfjj.gz_hds
        });

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

        function gz_io(subtract, mon, day) {
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

            var params = {
                paraPayFlag: 'GZ04',
                hidecountry: 11005293,
                hideprovince: -1,
                hidecity: -1,
                hidearea: -1,
                hidebranch: -1,
                olevel: 0,
                rid: 'GZ04',
                province: -1,
                kindtype: -1,
                area: -1,
                city: -1,
                kindCode: -1,
                branch: -1,
                searchlevel: 'provincecode',
                organtype: 2,
                sellchnlno: -1,
                searchkind: -1,
                paraPeriod: 'y',

                //start
                bYear: start.format('YYYY'),
                bMonth: start.format('MM'),
                bDay: start.format('DD'),

                //end
                paraYear: end.format('YYYY'),
                paraMonth: end.format('MM'),
                paraDay: end.format('DD')
            };

            return {
                url: 'http://10.2.3.223/FdimWebApp/Welcome?MainOp=Stat&Stat=GZ04',
                params: params
            };
        }

    }
});