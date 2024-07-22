<template>
    <div id="org-category" style="width: auto;height:18vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "OrgDeviceBar",
    props: ["organizationDevice"],
    data(){
        return {
 
        }
    },
    methods: {
      orgDeviceBar(){
        var myChart = echarts.init(document.getElementById('org-category'));
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
          legend: {
            data: ['在线设备机构数', '总设备机构数'],
            itemWidth: 16,
            itemHeight: 10,
            right: "0%",
            top: "6%"
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
          },
          grid: {
            right: '16%',
            left: '10%',
            bottom: '14%'
          },
          xAxis: [
            {
              type: 'category',
              name: "设备数分布",
              axisTick: { show: false },
              data: ['0', '1~10', '11~100', '101~1000', '1000+'],
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '机构数',
              nameTextStyle: {
                align: 'right'
              },
              splitNumber: 2,
              splitLine:{//去除网格线
			          show:false
		          },
              axisTick: {show: true},
              axisLabel: {
                interval: 0, // 控制标签显示间隔
              }
              
            }
          ],
          series: [
            {
              name: '在线设备机构数',
              type: 'bar',
              barWidth: 20,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: this.organizationDevice.onlineDeviceOrgs,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#23f3ba' },
                  { offset: 0.5, color: '#4ad7b0' },
                  { offset: 1, color: '#4ad7b0' }
                ])
              },
            },
            {
              name: '总设备机构数',
              type: 'bar',
              barWidth: 20,
              emphasis: {
                focus: 'series'
              },
              data: this.organizationDevice.deviceOrgs,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ])
              },
            }
          ]
        };
        myChart.setOption(option);
        window.addEventListener("resize",()=>{
            myChart.resize();
        });
      }
    },
    watch:{
        organizationDevice: {
            handler: function(val) {
              if(val.hasOwnProperty('deviceOrgs')){
                  this.orgDeviceBar();
              }
            },
            // immediate: true,
        }
    },
}
</script>

<style>

</style>