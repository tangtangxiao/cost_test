<template>
    <div id="year-model" style="width: auto;height:8.2vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "YearModel",
    props: ["yearModel"],
    methods: {
        modelLine(){
            var myChart = echarts.init(document.getElementById('year-model'));
            var option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 1,
                formatter: (params) => {
                    let index = params[0].dataIndex
                    return `${option.series[0].name}：${option.series[0].data[index]}<br>${option.series[1].name}：${option.series[1].data[index]}<br>${option.series[2].name}：${option.series[2].data[index]}`
                },
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
                    {name:this.yearModel.model[0].name,icon: 'roundRect',itemHeight:2},
                    {name:this.yearModel.model[1].name, icon: 'roundRect',itemHeight:2},
                    {name:this.yearModel.model[2].name, icon: 'roundRect',itemHeight:2},
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
                data: this.yearModel.year,
                axisLine: {
                    lineStyle: {
                        width: 0.4,
                    }
                },
            },
            yAxis: {
                type: 'value',
                show: true,
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
                splitLine:{//去除网格线
                    lineStyle:{
                        width: 0.4,
                    }
		        },
                axisLine:{
                        show:false 
                },
                axisTick: {
                        show:false 
                },
            },
            series: [
            {
                name: this.yearModel.model[0].name,
                data: this.yearModel.model[0].online,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                lineStyle:{
                    width: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    color: '#45cec2'
                },
                itemStyle: {color: '#45cec2'}
            },
            {
                name: this.yearModel.model[1].name,
                data: this.yearModel.model[1].online,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                itemStyle: {color: '#e27330'},
                lineStyle:{
                    width: 1,

                    color: '#e27330'
                }
            },
            {
                name: this.yearModel.model[2].name,
                data: this.yearModel.model[2].online,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                itemStyle: {color: '#1869A0'},
                lineStyle:{
                    width: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    color: '#1869A0'
                }
            }
            ]
            
            };
            myChart.setOption(option);
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },      
    },
    watch:{
        yearModel: {
            deep: true,
            handler(val){
                if(this.yearModel.year.length){
                    this.modelLine()
                }            
            }
        }
    }
}
</script>

<style>

</style>