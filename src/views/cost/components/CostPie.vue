<template>
    <div style="width: 100%;height: 18vw;" :id="id">
        
    </div>
</template>

<script>
import * as echarts from 'echarts'
// import {mapActions,mapState} from 'vuex'

export default {
    data(){
        return{
            testData: [{name:"测试数据",value: 2535}]
        }
    },
    props: ["pieData","id"],
    mounted(){  
        // if(this.count > 3){
             this.modelPie()
        // }
        // if(this.count <= 4){
        //     this.$store.commit('productLineCost/COUNTADD')
        // }                        
    },
    methods:{
        modelPie(){
            console.log(this.pieData)
            // console.log(this.count)
            var myChart = echarts.init(document.getElementById(this.id));
            var option = {
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
                    orient: 'vertical',
                    itemWidth: 16,
                    itemHeight: 10,
                    right: '16%',
                    top: 'center',
                    formatter: function(name) {
                        if (name.length > 13) {
                            return name.substring(0, 12) + '...';
                        } else {
                            return name;
                        }
                    },
                    textStyle:{
                        fontSize: 10,
                    } 
                },
                color:['#5698F5','#E2C93D','#FF7070','#35A1D3','#4E8975','#5A5476','#FF9393','#254117','#7f02f4','#029ef4','#0556f7','#6905f7','#c405f7','#7d6b92','#a9e8c2','#C1EBDD','#1c9a4e','#f76f0a','#ae6987','#8c1649','#05f7da'],
                series: [
                    {
                        name: "金额",
                        type: 'pie',
                        radius: ['46%', '60%'],
                        left: '-40%',
                        label: {
                            show: false,
                        },
                        data: this.testData
                    }
                ]
            };

            myChart.setOption(option);
            window.addEventListener("resize",()=>{
                myChart.resize();
            });
        },          
    },
    computed:{
        // ...mapState("productLineCost",["count"])
    },
    watch:{
        // pieData: {
        //     handler(val){
        //         // if(this.count > 3){
        //             // this.modelPie() 
        //         // } 
        //         // if(this.count <= 4){
        //         //     this.$store.commit('productLineCost/COUNTADD')
        //         // }                                               
        //     },  
        // },       
    }
}
</script>

<style>

</style>