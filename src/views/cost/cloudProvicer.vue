<template>
    <div>    
        <a-card :bodyStyle="{'padding':'0px'}">
            <a-page-header title="云服务商账单统计">
                <a-breadcrumb slot="subTitle" separator=">">
                    <a-breadcrumb-item style="color: rgba(0, 0, 0, 0.65)">费用统计</a-breadcrumb-item>
                    <a-breadcrumb-item style="color: rgba(0, 0, 0, 0.65)">云服务商账单统计</a-breadcrumb-item>
                </a-breadcrumb>
            </a-page-header>
        </a-card>
        <a-card>
            <a-row>
                <a-radio-group v-model="billingType" :style="{ marginBottom: '8px' }" button-style="solid" @change="billingTypeChange">
                    <a-radio-button value="year">
                        年账单统计
                    </a-radio-button>
                    <a-radio-button value="month">
                        月账单统计
                    </a-radio-button>
                </a-radio-group>
                <span style="margin-left: 16px;">
                    <span>付款主体：</span>
                    <a-select v-model="payElement" style="width: 260px;" @change="payElementChange">
                        <a-select-option v-for="(item,index) in payElementSet" :key="index"  :value="item">
                        {{item}}
                        </a-select-option>
                    </a-select>
                </span>
                <span style="margin-left: 16px;">
                    <span>云供应商：</span>
                    <a-select v-model="cloudProvider" style="width: 160px;" @change="getFilterBillingResource">
                        <a-select-option v-for="(item,index) in cloudProviderSet" :key="index"  :value="item">
                        {{item}}
                        </a-select-option>
                    </a-select>
                </span>
                <span style="margin-left: 16px;" v-show="billingType == 'month'">
                    <span>年份：</span>
                    <a-select v-model="year" style="width: 120px;" @change="getFilterBillingResource">
                        <a-select-option v-for="(item,index) in yearList" :key="index" :value="item">
                            {{item+"年"}}
                        </a-select-option>
                    </a-select>
                </span>
            </a-row>
            <a-row>
                <YearBilling v-if="billingType=='year'" :billingTypeClicked="billingTypeClicked" :yearBillingResource="yearBillingResource" :yearList="yearList"></YearBilling>
                <MonthBilling v-if="billingType=='month'" :monthBillingResource="monthBillingResource" :year="year"></MonthBilling>
            </a-row>
        </a-card>
    </div>  
</template>

<script>
import request from '@/utils/request'
import defaultSettings from '@/config/defaultSettings'
import apiResource from '@/config/apiResource'

import MonthBilling from './components/MonthBilling'
import YearBilling from './components/YearBilling'

export default {
    data() {
        return {
            billingType: 'year',
            billingTypeClicked: false,
            cloudProvider: '全部云供应商',
            payElement: '',
            year: '',
            yearList: [],
            payElementSet: new Set(),
            cloudProviderSet: new Set(["全部云供应商"]),
            billingResource: [],
            monthBillingResource: [],
            yearBillingResource: [],
        }
    },
    components: {MonthBilling,YearBilling},
    mounted(){
        const currentYear = new Date().getFullYear();
        this.year = currentYear
        for(let i=currentYear;i>= currentYear-4;i--){
            this.yearList.push(i)
        }

        this.getBillingResource()
    },
    methods:{
        billingTypeChange(){
            this.billingTypeClicked = true
        },
        getBillingResource(){
            let costResource = request({
                url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=YunFuWuZhangDan&per_page=100000",
                method: "get",
                params: "",
            })

            costResource.then(res=>{
                if(res.code == 200){
                    this.requestData = res.data.data
                    for(let item of this.requestData){
                        this.billingResource.push(item.data)
                        this.payElementSet.add(item.data.YunFuWuZhangDan_FuKuanZhuTi)
                    }
                    this.payElement = [...this.payElementSet][0]
                    this.payElementChange()
                }else{
                    this.$message.error('获取费用信息失败：'+message)
                }  
            })
            
            // setTimeout(()=>{
            //     this.billingResource = apiResource.billingResource
            //     for(let item of this.billingResource){
            //         this.payElementSet.add(item.YunFuWuZhangDan_FuKuanZhuTi)
            //     }
            //     this.payElement = [...this.payElementSet][0]
            //     this.payElementChange()
            // })

        },
        getFilterBillingResource(){
            let tmpResource = []

            if(this.cloudProvider == "全部云供应商"){
                tmpResource = this.billingResource.filter(item => item.YunFuWuZhangDan_FuKuanZhuTi == this.payElement)
            }else{
                tmpResource = this.billingResource.filter(item => item.YunFuWuZhangDan_FuKuanZhuTi == this.payElement && item.YunFuWuZhangDan_YunTiGongShang == this.cloudProvider)
            }

            this.yearBillingResource = tmpResource
            this.monthBillingResource = tmpResource.filter(item => item.YunFuWuZhangDan_ZhangDanNianFen == this.year).sort((a,b)=>b.YunFuWuZhangDan_YueFen - a.YunFuWuZhangDan_YueFen)
        },
        payElementChange(){
            this.cloudProviderSet = new Set(["全部云供应商"])
            for(let item of this.billingResource){
                if(this.payElement == item.YunFuWuZhangDan_FuKuanZhuTi){
                    this.cloudProviderSet.add(item.YunFuWuZhangDan_YunTiGongShang)
                }
            }

            this.cloudProvider = '全部云供应商'

            this.getFilterBillingResource()
        }
    },
    computed:{

    }
}
</script>

<style lang="less" scoped>
.card-space{
    margin-bottom: 8px;
}
</style>