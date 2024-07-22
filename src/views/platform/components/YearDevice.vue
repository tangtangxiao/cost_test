<template>
    <div id="year-device" style="width: auto;height:8.2vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "YearDevice",
    props: ["yearDevice"],
    methods: {
        deviceLine(){
            var myChart = echarts.init(document.getElementById('year-device'));
            var option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 1,
                formatter: '{a0}：{c0}<br/>{a1}：{c1}',
                textStyle: {
                    color: 'black',
                    fontSize: 10,
                    textShadowBlur: 15,
                },
                axisPointer: {
                    type: 'none'
                }
            },
            legend: {
                show: true,
                itemWidth:12,
                itemHeight:2,
                top: '4%',
                data: [
                    {name:'在线设备',icon: 'roundRect',itemHeight:2},
                    {name:'总设备', icon: 'roundRect',itemHeight:2}
                ],
                textStyle: {
                    fontSize: 9
                }
            },
            grid: {
                left: '10px',
                right: '30px',
                top: '20%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: {show: false},
                data: this.yearDevice.year,
                axisLine: {
                    lineStyle: {
                        width: 0.4,
                    }
                },
            },
            yAxis: {
                type: 'value',
                show: true,
                axisLine:{
                        show:false 
                },
                axisTick: {
                        show:false 
                },
                nameTextStyle: {
                    align: 'right'
                },
                axisLabel:{
                formatter: function(value) {
                    if (value >= 10000) {
                        return value/10000+"万";
                    } else {
                        return value;
                    }
                }},
                splitNumber: 2,
                splitLine:{
                    lineStyle:{
                        width: 0.4,
                    }
		        },
            },
            series: [
            {
                name:"在线设备",
                data: this.yearDevice.deviceOnline,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                lineStyle:{
                    width: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    color: '#01f457'
                },
                itemStyle: {color: '#01f457'}
            },
            {
                name:"总设备",
                data: this.yearDevice.deviceTotal,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                itemStyle: {color: '#188df0'},
                lineStyle:{
                    width: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    color: '#188df0'
                }
            }
            ]           
            };
            myChart.setOption(option);
            // window.onresize = function() {
            //     myChart.resize(); // 调整图表尺寸
            // };
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },      
    },
    watch:{
        yearDevice: {
            deep: true,
            handler(val){
                if(val.year.length){
                    this.deviceLine()
                }
            }
        }
    }
}
</script>

<style>

</style>