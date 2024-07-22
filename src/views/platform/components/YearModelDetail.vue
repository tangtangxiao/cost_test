<template>
    <div>
        <a-row  :gutter="0">
                    <a-col :span="5">
                        <a-card :bordered="false" :bodyStyle="{'padding-left':'30px','height':'350px'}">
                                <a-list size="small" :grid="{ gutter: 0, column: 2 }"  :data-source="model">
                                    <a-list-item slot="renderItem" slot-scope="item, index" style="height:26px;">
                                        <span @mouseleave="mouseLeave(index)" @click="selectModel(index)" @mouseenter="mouseEnter(index)" style="display:flex;align-items:center;cursor: pointer">
                                            <span :ref="'tag'+index" :style="{width:'16px',height:'10px',background:color[index],'margin-right':'4px','border-radius':'2px'}"></span>
                                            <span :ref="'model'+index" class="text-ellipsis">{{item}}</span>
                                        </span>
                                    </a-list-item>
                                </a-list>
                        </a-card>
                    </a-col>
                    <a-col :span="19">
                        <div v-show="yearModel.year.length" id="model-line" style="width:auto;height:350px;"></div>                                                    
                    </a-col>
        </a-row>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: "YearModelDetail",
    props: ["yearModel"],
    data(){
        return {
            model: [],
            color: ['#45cec2','#eae40b','#09ad4b','#1869A0','#45C2E0','#4E8975','#C1EBDD','#5A5476','#FF9393','#7f02f4','#029ef4','#0556f7','#6905f7','#c405f7','#7d6b92','#a9e8c2','#1c9a4e','#f76f0a','#ae6987','#8c1649','#05f7da','#254117','#f75555','#942dfb','#feaf06'],
            selectedModel: "",
            selectedColor: "",
            newColor: "",
            lineOnline: [],
            lineTotal: [],
            moveColor: "",
        }
    },
    mounted(){
        for(let model of this.yearModel.model){
            this.model.push(model.name)           
        }

        this.selectedModel = this.model[0]
        this.selectedColor = "rgb(69, 206, 194)" 
    },
    methods: {
        selectModel(index){
            this.selectedModel=this.$refs[`model${index}`].innerText
            this.selectedColor=this.moveColor          
        },
        mouseEnter(index){
            this.moveColor = this.$refs[`tag${index}`].style.background
            this.$refs[`tag${index}`].style.background = this.getColor(this.moveColor)
        },
        mouseLeave(index){
            this.$refs[`tag${index}`].style.background = this.moveColor
        },
        modelLine(){
            var myChart = echarts.init(document.getElementById('model-line'));
            var option = {
            title: {
                left: 'center',
                text: this.selectedModel+'机型设备数统计',
                textStyle: {
                    fontWeight: 'bolder',
                    fontSize: 14,
                    fontFamily: 'Arial'
                }
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'white',
                borderColor: '#E8E8E8',
                borderWidth: 1,
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
                top: '4%',
                data: [
                    {name:"在线设备数",icon: 'roundRect'},
                    {name:"总设备数", icon: 'roundRect'},
                ],
                textStyle: {
                    fontSize: 12
                }
            },
            grid: {
                left: '14px',
                right: '8%',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                name: '年份',
                boundaryGap: false,
                axisTick: {show: true},
                data: this.yearModel.year,
                axisLine: {
                    lineStyle: {
                        width: 0.4,
                    }
                },
            },
            yAxis: {
                type: 'value',
                name: '设备数',
                nameTextStyle: {
                    align: 'right'
                },
                show: true,
                splitNumber: 2,
                splitLine:{
                    lineStyle: {  
                        width: 0.6,
                        // type: 'dotted'
                    }
                }

            },
            series: [
                {
                    name: "总设备数",
                    data: this.lineTotal,
                    type: 'line',
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 1,
                    showSymbol: false,
                    // areaStyle: {},
                    lineStyle:{
                        width: 1.3,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        color: this.newColor
                    },
                    itemStyle: {color: this.newColor}
                },
                {
                    name: "在线设备数",
                    data: this.lineOnline,
                    type: 'line',
                    smooth: true,
                    symbol: "circle",
                    symbolSize: 1,
                    showSymbol: false,
                    // areaStyle: {},
                    itemStyle: {color: this.selectedColor},
                    lineStyle:{
                        width: 1.3,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 10,
                        color: this.selectedColor
                    }
                },
            ]           
            };
            myChart.setOption(option);
        }, 
        getColor(rgb){
            let newColor = rgb.split(/\(|\)|,/)
            let red = parseInt(newColor[1])
            let green = parseInt(newColor[2])
            let blue = parseInt(newColor[3])
            let newRed = red-80 < 0 ? 0 : red - 80
            let newGreen = green - 80 < 0 ? 0 : green - 80
            let newBlue = blue - 80 < 0 ? 0 : blue - 80
            return("rgb("+newRed+","+newGreen+","+newBlue+")")
        }     
    },
    watch:{
        selectedModel: {
            handler(val){
                let selectedItem = this.yearModel.model.find(item => item.name == this.selectedModel)
                this.lineOnline = selectedItem.online
                this.lineTotal = selectedItem.total

                this.newColor = this.getColor(this.selectedColor)
                this.modelLine()
            }
        }
    }
}
</script>

<style>
.text-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 66px;
}
</style>