import * as echarts from 'echarts'
import { getZabbixResource } from '@/api/zabbix'
import defaultSettings from '@/config/defaultSettings'

export const customMethod = {
    methods: {
        echartsLine(id,tooltipName,xdata,seriesdata,color){
            var myChart = echarts.init(document.getElementById(id));
            var option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 1,
                formatter: tooltipName+'：{c}',
                textStyle: {
                    color: 'black',
                    fontSize: 10,
                    textShadowBlur: 15,
                },
                axisPointer: {
                    type: 'none'
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
                data: xdata,
                axisLine: {
                    lineStyle: {
                        width: 0.4,
                    }
                }
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
            series: {
                data: seriesdata,
                type: 'line',
                smooth: false,
                symbol: "circle",
                symbolSize: 1,
                showSymbol: false,
                itemStyle: {color: color},
                lineStyle:{
                    width: 1,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10,
                    color: color
                }
            }
            
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },
        async getHostgroup(hostid){
            let param = { 
                jsonrpc: "2.0",
                method: "hostgroup.get",                
                params: {
                    output: ["name"],
                    monitored_hosts: true,
                    real_hosts: true,
                    selectHosts: "extend"
                    // hostids: hostid
                },
                auth:defaultSettings.zabbixToken,
                id:1
            }

            if(hostid){
                Object.defineProperty(param.params,"hostids",{
                    value: hostid,
                    enumerable: true,
                })
            }
            return await getZabbixResource(param)
        }, 
    }   
}
