<template>
    <div id="model-test" style="width: auto;height:18vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "ModelPie",
    props: ["modelValues"],
    mounted(){
        this.modelPie()
    },
    methods: {
        modelPie(){
            var myChart = echarts.init(document.getElementById('model-test'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'white',
                    borderColor: '#E8E8E8',
                    borderWidth: 1,
                    formatter: '{a}:<br/>{b}({c} , {d}%)',
                    textStyle: {
                        color: 'black',
                        fontSize: 12,
                        textShadowBlur: 15,
                    },
                },
                legend: {
                    orient: 'vertical',
                    itemWidth: 16,
                    itemHeight: 10,
                    right: '5%', 
                    formatter: function(name) {
                        if (name.length > 8) {
                            return name.substring(0, 8) + '...';
                        } else {
                            return name;
                        }
                    }   
                },
                color:['#45cec2','#eae40b','#09ad4b','#1869A0','#45C2E0','#4E8975','#5A5476','#FF9393','#254117','#7f02f4','#029ef4','#0556f7','#6905f7','#c405f7','#7d6b92','#a9e8c2','#C1EBDD','#1c9a4e','#f76f0a','#ae6987','#8c1649','#05f7da'],
                series: [
                    {
                        name: this.modelValues.length ? "在线设备数": "",
                        type: 'pie',
                        radius: ['55%', '70%'],
                        left: '-40%',
                        label: {
                            show: false,
                        },
                        data: this.modelValues
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },      
    },
    watch:{
        modelValues: {
            // deep: true,
            handler(val){
                if(val.length){
                    this.modelPie()
                }               
            }
        }
    }
}
</script>

<style>

</style>