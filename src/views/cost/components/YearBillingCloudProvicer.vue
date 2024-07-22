<template>
    <div :id="id" style="width: auto;height:15vw;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data(){
        return {

        }
    },
    props: ["id","yearPieData","year"],
    mounted(){    
    },
    methods:{
        modelPie(){
            var myChart = echarts.init(document.getElementById(this.id));
            var option = {
                title:{
                    text: this.id == "one" ? "本年度("+this.year+"年)云供应商费用占比" : "上一年("+this.year+"年)云供应商费用占比",
                    left: "center",
                    top: this.id == "one" ? "10%" : "6%",
                    textStyle: {
                        fontWeight: 'normal',
                        fontSize: 13
                    }
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor: 'white',
                    borderColor: '#E8E8E8',
                    borderWidth: 1,
                    formatter: '{b}({c} , {d}%)',
                    textStyle: {
                        color: 'black',
                        fontSize: 12,
                        textShadowBlur: 15,
                    },
                },
                legend: {
                    // orient: 'vertical',
                    itemWidth: 16,
                    itemHeight: 10,
                    bottom: this.id == "one" ? '3%' : '6%',
                    formatter: function(name) {
                        if (name.length > 10) {
                            return name.substring(0, 9) + '...';
                        } else {
                            return name;
                        }
                    }   
                },
                color:['#5698F5','#E2C93D','#FF7070','#35A1D3','#4E8975','#5A5476','#FF9393','#254117','#7f02f4','#029ef4','#0556f7','#6905f7','#c405f7','#7d6b92','#a9e8c2','#C1EBDD','#1c9a4e','#f76f0a','#ae6987','#8c1649','#05f7da'],
                series: [
                    {
                        name: "金额",
                        type: 'pie',
                        radius: ['42%', '56%'],
                        left: 'center',
                        top: this.id == "one" ? '-8%' :'-16%' ,
                        label: {
                            show: false,
                        },
                        data: this.yearPieData
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
        yearPieData: {
            handler(val){
                this.modelPie()                        
            },     
        },       
    }
}
</script>

<style>

</style>