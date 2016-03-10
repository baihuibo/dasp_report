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

        //基金
        jj_year: 'FUND_JJ_YEAR',
        jj_year_same: 'FUND_JJ_YEAR_SAME',
        jj_day: 'FUND_JJ_DAY',
        jj_day_same: 'FUND_JJ_DAY_SAME',
        jj_mon: 'FUND_JJ_MON',
        jj_mon_same: 'FUND_JJ_MON_SAME',

        //理财
        lc_day: 'FUND_LC_DAY',
        lc_day_same: 'FUND_LC_DAY_SAME',
        lc_day_total: 'FUND_LC_DAY_TOTAL'
    },
    logDebugEnabled: true
};