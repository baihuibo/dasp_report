/**
 * Created by baihuibo on 16/1/27.
 */
export default {
    dljr: {
        //中国邮政储蓄存款余额增长情况统计表-日报
        bank: 'CUST_BANK_DAY',
        proxy: 'CUST_PROXY_DAY',
        bank_same: 'CUST_BANK_DAY_SAME',
        proxy_same: 'CUST_PROXY_DAY_SAME',
        hds1: [4, 6],

        //中国邮政储蓄存款余额分种类统计表-日报
        div_bank: 'CUST_DIV_DAY_BANK',
        div_total: 'CUST_DIV_DAY_TOTAL',
        div_bank_same: 'CUST_DIV_DAY_BANK_SAME',
        div_total_same: 'CUST_DIV_DAY_TOTAL_SAME',
        hds2: [4, 9],

        //邮政储蓄银行网点
        rpa1: 1,
        //邮政储蓄代理网点
        rpa2: 2
    },
    kfjj: {
        //国债
        gz_year: 'FUND_GZ_YEAR',
        gz_year_same: 'FUND_GZ_YEAR_SAME',
        gz_mon: 'FUND_GZ_MON',
        gz_mon_same: 'FUND_GZ_MON_SAME',
        gz_hds: [0, 1],

        //基金
        jj_year: 'FUND_JJ_YEAR',
        jj_year_same: 'FUND_JJ_YEAR_SAME',
        jj_day: 'FUND_JJ_DAY',
        jj_day_same: 'FUND_JJ_DAY_SAME',
        jj_mon: 'FUND_JJ_MON',
        jj_mon_same: 'FUND_JJ_MON_SAME',
        jj_hds: [0, 2],

        //理财
        lc_day: 'FUND_LC_DAY',
        lc_day_same: 'FUND_LC_DAY_SAME',
        lc_day_total: 'FUND_LC_DAY_TOTAL',
        lc_hds: [0, 2]
    },
    dlbx: {
        insu_day: 'INSU_DAY',//代理-本日
        insu_day_same: 'INSU_DAY_SAME',//代理-本日同期
        insu_month: 'INSU_MONTH',//代理-本月
        insu_month_same: 'INSU_MONTH_SAME',//代理-本月同期

        insu_per_mon: 'INSU_PER_MON',//期缴-本月
        insu_per_mon_same: 'INSU_PER_MON_SAME',//期缴-本月同期
        insu_per_total_mon: 'INSU_PER_TOTAL_MON',//期缴-邮银本月
        insu_per_total_mon_same: 'INSU_PER_TOTAL_MON_SAME',//期缴-邮银本月同期

        insu_total_mon: 'INSU_TOTAL_MON',//邮银-本月
        insu_total_mon_same: 'INSU_TOTAL_MON_SAME',//邮银-本月同期

        insu_dev_base_data: 'INSU_DEV_BASE_DATA',//中邮保险业务发展情况基础数据
        hds_dl: [0, 4], //代理表头
        hds_qj: [0, 3], //期缴表头
        hds_yy: [0, 4] //邮银表头
    },
    logDebugEnabled: true
};