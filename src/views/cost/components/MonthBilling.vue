<template>
    <a-collapse :activeKey="collapseActiveKey" expandIconPosition="right">
        <a-collapse-panel key="1">
            <span slot="header"><a-icon  type="bar-chart"/><span> 月账单统计图</span></span>
            <div id="model-test" style="width: auto;height:18vw;"></div>
        </a-collapse-panel>
        <a-collapse-panel key="2">
            <span slot="header"><a-icon  type="bars" /><span> 月账单统计表</span></span>
            <a-table :columns="columns" :data-source="monthBillingResource"  :pagination="false" rowKey="YunFuWuZhangDan_VISIBLE_NAME" @change="handleChange">
                <span slot="costDate" slot-scope="record">{{record.YunFuWuZhangDan_ZhangDanNianFen}}-{{record.YunFuWuZhangDan_YueFen}}</span>
                <span  slot="currencyType" slot-scope="record">
                    <a-icon type="pay-circle" theme="filled" v-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('人民币')" style="font-size: 18px;"/>
                    <a-icon type="dollar-circle" theme="filled" v-else-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('美元')" style="font-size: 18px;"/>
                    <a-icon type="pound-circle" theme="filled" v-else-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('欧元')" style="font-size: 18px;"/>
                </span>
                <span slot="cloudProvider" slot-scope="record">
                    <span v-if="record.YunFuWuZhangDan_YunTiGongShang.includes('阿里云')"><span class="iconfont icon2-aliyun1 cloudProviderIcon"></span><span>{{record.YunFuWuZhangDan_YunTiGongShang}}</span></span>
                    <span v-else-if="record.YunFuWuZhangDan_YunTiGongShang.includes('aws')"><span class="iconfont icon2-aws cloudProviderIcon"></span><span>{{record.YunFuWuZhangDan_YunTiGongShang}}</span></span>
                    <span v-else-if="record.YunFuWuZhangDan_YunTiGongShang.includes('腾讯')"><span class="iconfont icon2-tengxunyun2 cloudProviderIcon"></span><span>{{record.YunFuWuZhangDan_YunTiGongShang}}</span></span>
                    <span v-else-if="record.YunFuWuZhangDan_YunTiGongShang.includes('azure')"><span class="iconfont icon2-azure cloudProviderIcon"></span><span>{{record.YunFuWuZhangDan_YunTiGongShang}}</span></span>
                </span>
                <span slot="cost" slot-scope="record" style="color:green">
                    <span v-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('人民币')">¥</span>
                    <span v-else-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('美元')">$</span>
                    <span v-else-if="record.YunFuWuZhangDan_HuoBiDanWei.includes('欧元')">€</span>
                    {{record.YunFuWuZhangDan_FeiYong}}
                </span>
            </a-table>
        </a-collapse-panel>
    </a-collapse> 
        
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "MonthBilling",
    props: ["monthBillingResource","year"],
    data(){
        return {
            collapseActiveKey: [1,2],  
            filteredInfo: null,
            monthList: ['01','02','03','04','05','06','07','08','09','10','11','12']
        }
    },
    mounted(){
        this.billingChart()
    },
    computed:{
        columns() {
            let filteredInfo = this.filteredInfo;
            filteredInfo = filteredInfo || {};
            const columns = [
                {
                    dataIndex: 'YunFuWuZhangDan_VISIBLE_NAME',
                    title: '账单',
                },
                {
                    title: '账期',
                    key: 'YunFuWuZhangDan_YueFen',
                    scopedSlots: { customRender: 'costDate' },
                    filters: [],
                    filteredValue: filteredInfo.YunFuWuZhangDan_YueFen || null,
                    onFilter: (value, record) => (record.YunFuWuZhangDan_ZhangDanNianFen+"-"+record.YunFuWuZhangDan_YueFen).includes(value),
                },
                {
                    title: '云服务商',
                    scopedSlots: { customRender: 'cloudProvider' },
                },
                {
                    title: '付款主体',
                    dataIndex: 'YunFuWuZhangDan_FuKuanZhuTi',
                },
                {
                    title: '帀种',
                    scopedSlots: { customRender: 'currencyType' },
                },
                {
                    title: '金额',
                    scopedSlots: { customRender: 'cost' },
                    sorter: (a,b)=>b.YunFuWuZhangDan_FeiYong - a.YunFuWuZhangDan_FeiYong
                }               
            ]
            for(let item of this.monthList){
                columns[1].filters.push({ text: this.year+'-'+item, value: this.year+'-'+item })
            }

            return columns;
        }
    },
    methods:{
        billingChart(){
            let billingData = []
            let currencyType = this.monthBillingResource.length ? '('+this.monthBillingResource[0].YunFuWuZhangDan_HuoBiDanWei.slice(2,10)+')' : ""
            for(let month of this.monthList){
                let billingCount = this.monthBillingResource.reduce((pre,cur)=>{
                    if(cur.YunFuWuZhangDan_YueFen == month){
                        pre += cur.YunFuWuZhangDan_FeiYong
                    }
                    return pre
                },0)
                billingData.push(billingCount)
            }

            var myChart = echarts.init(document.getElementById('model-test'));

            var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                },
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 1,
                textStyle: {
                    color: 'black',
                    fontSize: 12,
                    textShadowBlur: 15,
                },
            },
            grid: {
                left: '2%',
                right: '4%',
                bottom: '3%',
                top: '16%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: this.monthList.map(item=>item+"月"),
                axisTick: {
                    alignWithLabel: true
                }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '总金额'+currencyType,
                    nameTextStyle: {
                        align: 'center'
                    },
                    splitLine:{
                        lineStyle: {  
                            width: 0.6,
                        }
                    },
                    splitNumber: 3,
                }
            ],
            series: [
                {
                name: '账单总金额',
                type: 'bar',
                barWidth: '36%',
                itemStyle: {
                    color: 'skyblue',
                },
                data: billingData
                }
            ]
            };

            myChart.setOption(option);  

            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },
        handleChange(pagination, filters, sorter) {
            this.filteredInfo = filters;
        },
        clearFilters() {
            this.filteredInfo = null;
        },
    },
    watch:{
        monthBillingResource: {
            handler(val){
                this.billingChart()
                this.clearFilters()
            },
            // immediate: true
        }
    }
}
</script>

<style lang="less" scoped>
    ::v-deep .ant-table .ant-table-thead > tr > th{
        background-color: rgba(0,0,0,0.03);
    }
    ::v-deep .ant-table-tbody > tr > td{
        padding: 1px;
        font-size: 13px;
        padding-left: 8px;
    }
    .cloudProviderIcon{
        font-size: 24px;
        margin-right: 3px;
        vertical-align: middle;
    }
</style>