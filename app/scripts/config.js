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
        hds1 : [4, 6],

        //中国邮政储蓄存款余额分种类统计表-日报
        div_bank: 'CUST_DIV_DAY_BANK',
        div_total: 'CUST_DIV_DAY_TOTAL',
        div_bank_same: 'CUST_DIV_DAY_BANK_SAME',
        div_total_same: 'CUST_DIV_DAY_TOTAL_SAME',
        hds2 : [4, 9],

        //邮政储蓄银行网点
        rpa1 : 1,
        //邮政储蓄代理网点
        rpa2 : 2
    },
    logDebugEnabled: true
};