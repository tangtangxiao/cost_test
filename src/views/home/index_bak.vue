<template>
    <div>
        <div class="card-space" v-show="errorMessage.length"> 
            <a-alert v-for="(item,index) in errorMessage" type="error" closeText="✕" :message="item"  :key="index"  banner/>     
        </div>
        <a-row :gutter="8" class="card-space">
            <a-col :span="12">
                <a-card title="平台用户增长趋势"  :headStyle="{'font-weight':'bold'}">
                    <UserCount :userCountData="userCountData" :orgCountData="orgCountData"></UserCount>
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card title="设备上云增长趋势" :headStyle="{'font-weight':'bold'}">
                    <DeviceCount :deviceCountData="deviceCountData"></DeviceCount>
                </a-card>
            </a-col>
        </a-row>

        <a-row class="card-space">
            <a-card title="机型设备接入量统计" :headStyle="{'font-weight':'bold'}">
                <div>
                    <a-menu v-model="menuValue" mode="horizontal">
                    <a-menu-item key="total"> <a-icon type="control" />总设备统计 </a-menu-item>
                    <a-menu-item key="online"> <a-icon type="project" />在线设备统计</a-menu-item>
                    </a-menu>
                </div>
                <!-- <ModelCount :deviceCountData="deviceCountData"></ModelCount> -->
            </a-card>
        </a-row>
        <a-row class="card-space">
            <a-card>
                {{deviceCountData}}
            </a-card>
        </a-row>
    </div>
</template>

<script>
import { getZabbixResource } from '@/api/zabbix'
import defaultSettings from '@/config/defaultSettings'

import UserCount from './components/UserCount'
import DeviceCount from './components/DeviceCount'
import ModelCount from './components/ModelCount'
import {customMethod} from '../mixin/mixin'

export default {
    components: {UserCount,DeviceCount,ModelCount},
    data() {
        return {
            userCountData: [],
            orgCountData: [],
            deviceCountData: [],
            errorMessage: [],
            menuValue: ["total"],
            resData:[]
        }
    },
    mixins: [customMethod],
    mounted(){
        this.getUserData()
    },
    methods: {
        getUserData(){
            getZabbixResource({ 
                "jsonrpc": "2.0",
                "method": "item.get",                
                "params": {
                    "output": ["hostid","name","lastvalue","hostid","hosts"],
                    "monitored": "true",
                    "tags": [{'tag': 'Application', 'value': 'opsany'}],
                },
                "auth":defaultSettings.zabbixToken,
                "id":1
            }).then(res=>{
                this.resData = res.data.result
                if(res.data.result.length){
                    for(let item of res.data.result){
                        if(item.name == "users统计"){
                            try{
                                this.userCountData.push(JSON.parse(item.lastvalue).data)
                            }catch{
                                // this.errorMessage.push(await this.getHostgroup(item.hostid)+" "+item.name+" 数据获取失败！")
                                // this.getHostgroup(item.hostid).then(ret=>{
                                //     let group = ret.data.result[0].name
                                //     this.errorMessage.push(group+" "+item.name+" 数据获取失败！")
                                // })
                            }                           
                        }else if(item.name == "机构统计"){
                            try{
                                this.orgCountData.push(JSON.parse(item.lastvalue).data)
                            }catch{
                                // console.log(this.abc(item.hostid))
                                this.getHostgroup(item.hostid).then(ret=>{
                                    let group = ret.data.result[0].name
                                    this.errorMessage.push(group+" "+item.name+" 数据获取失败！")
                                })
                                // console.log(this.getHostgroup(item.hostid))
                            }                            
                        }else if(item.name == "device统计"){
                            try{
                                this.deviceCountData.push({hostid:item.hostid,lastvalue:JSON.parse(item.lastvalue).data})
                            }catch{
                                // this.errorMessage.push(await this.getHostgroup(item.hostid)+" "+item.name+" 数据获取失败！")
                                // this.getHostgroup(item.hostid).then(ret=>{
                                //     let group = ret.data.result[0].name
                                //     this.errorMessage.push(group+" "+item.name+" 数据获取失败！")
                                // })
                            } 
                        }
                    }
                } 
            })
            // console.log(this.deviceCountData)

        },
        // getErrorMessage(hostid,itemName){
        //     getZabbixResource({ 
        //         "jsonrpc": "2.0",
        //         "method": "hostgroup.get",                
        //         "params": {
        //             "output": ["name"],
        //             "hostids": hostid
        //         },
        //         "auth":defaultSettings.zabbixToken,
        //         "id":1
        //     }).then(res=>{
        //         let hostgroup = res.data.result[0].name
        //         this.errorMessage.push(hostgroup+' '+itemName+' 数据获取失败!')                  
        //     })           
        // }
    },
    computed:{
    }
}
</script>

<style lang="less" >
    .card-space{
        margin-bottom: 8px;
    }
    .ant-alert-message{
        color: #686161;
        font-size: 13px;
    }
    
</style>