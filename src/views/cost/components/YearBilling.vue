<template>
    <div style="border: 1px solid #D8D8D8">
        <a-row :gutter="0">
            <a-col :span="16">
                <div id="yearBilling" style="height: 31vw;"></div>
            </a-col>
            <a-col :span="8">  
                <a-row>
                    <div>
                        <YearBillingCloudProvicer id="one" :yearPieData="currentYearPieData" :year="yearList[0]"></YearBillingCloudProvicer>
                    </div>
                </a-row>
                <div style="border-top: 1px solid #E8E8E8;margin-right: 50px;margin-left:50px;margin-top: -1px;"></div>
                <a-row>
                    <div>
                        <YearBillingCloudProvicer id="two" :yearPieData="lastYearPieData" :year="yearList[1]"></YearBillingCloudProvicer>
                    </div>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import YearBillingCloudProvicer from './YearBillingCloudProvicer.vue'
export default {
    name: "YearBilling",
    components: {YearBillingCloudProvicer},
    props: ["yearBillingResource","yearList","billingTypeClicked"],
    data(){
        return {
            currentYearPieData: [],
            lastYearPieData: [],
        }
    },
    mounted(){
        if(this.billingTypeClicked){
            this.billingChart()   
        }            
    },
    methods:{
        getYearBillingData(){
            let yearBillingData = []
            for(let year of [...this.yearList].sort((a,b)=>a-b)){
                let billingCount = 0
                for(let item of this.yearBillingResource){
                    if(item.YunFuWuZhangDan_ZhangDanNianFen == year){
                        billingCount += item.YunFuWuZhangDan_FeiYong
                    }
                }
                yearBillingData.push(this.formatNumber(billingCount))
            }

            return yearBillingData
        },
        getYearPieData(year){
            let yearPieData = []
            let yearData = this.yearBillingResource.filter(item=>item.YunFuWuZhangDan_ZhangDanNianFen == year)
            let cloudProvicer = new Set(yearData.map(item=>item.YunFuWuZhangDan_YunTiGongShang))

            for(let item of cloudProvicer){
                let billing = 0
                for(let item2 of yearData){
                    if(item2.YunFuWuZhangDan_YunTiGongShang == item){
                        billing += item2.YunFuWuZhangDan_FeiYong
                    }
                }
                yearPieData.push({name: item,value: this.formatNumber(billing)})
            }
            return yearPieData
        },
        billingChart(){
            this.currentYearPieData = this.getYearPieData(this.yearList[0])
            this.lastYearPieData = this.getYearPieData(this.yearList[1])
            this.getYearBillingData()
            let currencyType = this.yearBillingResource.length ? '('+this.yearBillingResource[0].YunFuWuZhangDan_HuoBiDanWei.slice(2,10)+')' : ""

            var myChart = echarts.init(document.getElementById('yearBilling'));

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
                left: '4%',
                right: '0%',
                bottom: '10%',
                top: '16%',
                containLabel: true,
            },
            xAxis: [
                {
                type: 'category',
                data: this.yearList.map(item=> item+"年").sort(),
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
                    axisLabel:{
                    formatter: function(value) {
                        if (value >= 10000) {
                            return value/10000+"万";
                        } else {
                            return value;
                        }
                    }},
                }
            ],
            series: [
                {
                name: '账单总金额',
                type: 'bar',
                barWidth: '22%',
                itemStyle: {
                    color: 'skyblue',
                },
                data: this.getYearBillingData()
                }
            ]
            };

            myChart.setOption(option); 
            
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },
        formatNumber(num) {
            if (Number.isInteger(num)) {
                return num;
            } else {
                return Number(num.toFixed(2));
            }
        }, 
    },
    watch:{
        yearBillingResource: {
            handler(val){
                this.billingChart()                           
            },     
        },
    }
}
</script>

<style>

</style>