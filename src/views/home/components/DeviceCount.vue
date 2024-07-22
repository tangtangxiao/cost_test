<template>
    <div id="device-count" style="width: auto;height:14vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "DeviceCount",
    props: ["deviceCountData"],
    data(){
        return {
          year: [],
          deviceYearCount: [],
          onlieDeviceYearCount: [],
        }
    },
    mounted(){

    },
    methods: {
      getDeviceData(){
        for(let item of this.deviceCountData[0].lastvalue){
          this.year.push(item.year)
        }

        for(let key in this.year){
          let deviceCount = 0
          let onlineDeviceCount = 0
          for(let item of this.deviceCountData){
            deviceCount += item.lastvalue[key].total
            onlineDeviceCount += item.lastvalue[key].online
          }
          this.deviceYearCount.push(deviceCount)
          this.onlieDeviceYearCount.push(onlineDeviceCount)
        }     
      },

      DeviceCountLine(){
        var myChart = echarts.init(document.getElementById('device-count'));
        var option = {

        tooltip: {
            trigger: 'axis',
            backgroundColor: 'white',
            borderColor: '#E8E8E8',
            borderWidth: 1,
            formatter: (params) => {
              let index = params[0].dataIndex
              if(index > 0){
                var rateOrg = ((option.series[0].data[index] - option.series[0].data[index-1])*100/option.series[0].data[index-1]).toFixed(2)+"%"
                var rateUser = ((option.series[1].data[index] - option.series[1].data[index-1])*100/option.series[1].data[index-1]).toFixed(2)+"%"
              }else{
                var rateOrg = "NULL"
                var rateUser = "NULL"
              }
              if(option.series[0].data[index-1] == 0){
                var rateOrg = "100%"
              }
              if(option.series[1].data[index-1] == 0){
                var rateUser = "100%"
              }
              return `${params[0].name}年<br>${option.series[0].name}：${option.series[0].data[index]}，(年增长率：${rateOrg})<br>${option.series[1].name}：${option.series[1].data[index]}，(年增长率：${rateUser})`
            },
            textStyle: {
                color: 'black',
                fontSize: 12,
                textShadowBlur: 15,
            },
            axisPointer: {
                type: 'none'
            }
        },
        legend: {
            show: true,
            itemWidth:20,
            itemHeight:3,
            right: '4%',
            top: '0%',
            data: [
                {name:"在线设备数",icon: 'roundRect'},
                {name:"总设备数", icon: 'roundRect'},
            ],
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            right: '10%',
            left: '10%',
            top: '14%',
            bottom: '10%',
            // containLabel: true
        },
        xAxis: {
            type: 'category',
            name: '年份',
            axisTick: { show: false },
            boundaryGap: true,
            data: this.year,

        },
        yAxis: {
            type: 'value',
            name: '设备数',
            nameTextStyle: {
              align: 'right'
            },
            show: true,
            splitNumber: 3,
            splitLine:{
                lineStyle: {  
                    width: 0.6,
                }
            },
            axisLabel:{
            formatter: function(value) {
                if (value >= 10000) {
                    return value/10000+"万";
                } else {
                    return value;
                }
            }},
        },
        series: [
        {
            name: "总设备数",
            data: this.deviceYearCount,
            type: 'line',
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            // areaStyle: {},
            lineStyle:{
                width: 1.4,
                color: '#1869A0'
            },
            itemStyle: {color: '#1869A0'}
        },
        {
            name: "在线设备数",
            data: this.onlieDeviceYearCount,
            type: 'line',
            smooth: false,
            symbol: "circle",
            symbolSize: 1,
            showSymbol: false,
            areaStyle: {},
            itemStyle: {color: '#0ad213'},
            lineStyle:{
                width: 1.4,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
                color: '#0ad213'
            }
        },
        ]
        
        };
        myChart.setOption(option);
        window.addEventListener("resize",()=>{
            myChart.resize();
        });
      }
    },
    watch:{
        deviceCountData: {
          deep: true,
          handler(val){
            this.getDeviceData()
            this.DeviceCountLine()
          }
        }
    }
}
</script>

<style>

</style>