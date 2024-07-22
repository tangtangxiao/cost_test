<template>
    <div id="user-count" style="width: auto;height:14vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "UserCount",
    props: ["userCountData","orgCountData"],
    data(){
        return {
          year: [],
          userYearCount: [],
          orgYearCount: []
        }
    },
    mounted(){

    },
    methods: {
      getUserData(){
        for(let item of this.userCountData[0].lastvalue){
          this.year.push(item.year)

        }

        for(let key in this.year){
          let userCount = 0
          let orgCount = 0
          for(let item of this.userCountData){
            userCount += item.lastvalue[key].total
          }
          this.userYearCount.push(userCount)

          for(let item of this.orgCountData){
            orgCount += item.lastvalue[key].total
          }
          this.orgYearCount.push(orgCount)
        }       
      },

      userCountBar(){
        var myChart = echarts.init(document.getElementById('user-count'));
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
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
              return `${params[0].name}年<br>注册用户：${option.series[0].data[index]}，(年增长率：${rateOrg})<br>总用户：${option.series[1].data[index]}，(年增长率：${rateUser})`
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
            data: ['注册用户数', '总用户数'],
            itemWidth: 16,
            itemHeight: 10,
            right: "4%",
            top: "0%"
          },
          grid: {
            right: '10%',
            left: '10%',
            top: '14%',
            bottom: '10%',

          },
          xAxis: [
            {
              type: 'category',
              name: '年份',
              axisTick: { show: false },
              data: this.year,
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '用户数',
              nameTextStyle: {
                align: 'right'
              },
              splitNumber: 2,
              splitLine:{//去除网格线
			          show:true,
                lineStyle: {  
                    width: 0.6,
                }
		          },
              axisTick: {show: true},
              axisLabel: {
                interval: 0, // 控制标签显示间隔
              },
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
              name: '注册用户数',
              type: 'bar',
              barWidth: 22,
              barGap: 0,
              emphasis: {
                focus: 'series'
              },
              data: this.orgYearCount,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#5190d9' },
                  { offset: 0.5, color: '#2267b8' },
                  { offset: 1, color: '#0a4c9a' }
                ])
              },
            },
            {
              name: '总用户数',
              type: 'bar',
              barWidth: 22,
              emphasis: {
                focus: 'series'
              },
              data: this.userYearCount,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2DD7C0' },
                  { offset: 0.5, color: '#43B9A9' },
                  { offset: 1, color: '#58A399' }
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
        userCountData: {
          deep: true,
          handler(val){
            this.getUserData()
            this.userCountBar()
          }
        }
    }
}
</script>

<style>

</style>