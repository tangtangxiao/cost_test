<template>
    <div>
        <div class="card-space" v-show="errorMessage.length"> 
            <a-alert v-for="(item,index) in errorMessage" type="error" closeText="✕" :message="getHostgroupName(item.hostid)+' ' + item.itemname + ' 数据获取失败！'"  :key="index"  banner/>     
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
            <a-card title="平台机构用户统计" :headStyle="{'font-weight':'bold'}">
                <OrgUserCount :userCountData="userCountData" :orgCountData="orgCountData" :hostGroup="hostGroup"></OrgUserCount>
            </a-card>
        </a-row>

        <a-row class="card-space">
            <a-card title="机型设备接入量统计" :headStyle="{'font-weight':'bold'}">
                <ModelCount :deviceCountData="deviceCountData" :hostGroup="hostGroup"></ModelCount>
            </a-card>
        </a-row>

    </div>
</template>

<script>
import { getZabbixResource } from '@/api/zabbix'
import defaultSettings from '@/config/defaultSettings'

import UserCount from './components/UserCount'
import DeviceCount from './components/DeviceCount'
import OrgUserCount from './components/OrgUserCount'
import ModelCount from './components/ModelCount'
import {customMethod} from '../mixin/mixin'

export default {
    components: {UserCount,DeviceCount,ModelCount,OrgUserCount},
    data() {
        return {
            hostGroup: [],
            userCountData: [],
            orgCountData: [],
            deviceCountData: [],
            errorMessage: [],
            extraPercent: 50,
        }
    },
    mixins: [customMethod],
    mounted(){
        this.getHostgroup().then(res=>{
            for(let group of res.data.result){
                let itemGroup = {name: group.name,hostids: []}
                for(let host of group.hosts){
                    itemGroup.hostids.push(host.hostid)
                }
                this.hostGroup.push(itemGroup)
            }
        })

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
                if(res.data.result.length){
                    for(let item of res.data.result){
                        if(item.name == "users统计"){
                            try{
                                this.userCountData.push({hostid:item.hostid,lastvalue:JSON.parse(item.lastvalue).data})
                            }catch{
                                this.errorMessage.push({hostid: item.hostid,itemname: item.name})
                            }                           
                        }else if(item.name == "机构统计"){
                            try{
                                this.orgCountData.push({hostid:item.hostid,lastvalue:JSON.parse(item.lastvalue).data})
                            }catch{
                                this.errorMessage.push({hostid: item.hostid,itemname: item.name})    
                            }                            
                        }else if(item.name == "device统计"){
                            try{
                                this.deviceCountData.push({hostid:item.hostid,lastvalue:JSON.parse(item.lastvalue).data})
                            }catch{
                                this.errorMessage.push({hostid: item.hostid,itemname: item.name})
                            }
                        }
                    }
                } 
            })

        },

    },
    computed:{
        getHostgroupName(){
            return function(hostid){
                    let hostgroupItem =this.hostGroup.find(item => item.hostids.includes(hostid))
                    if(hostgroupItem){
                        return hostgroupItem.name
                    }                 
            }
        }   
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
    
    @percent-height: 16px;
    .percent-total{
        width: 80px;
        height: @percent-height;
        // background-image: linear-gradient(to right, darken(@primary-color,4%) 0%, lighten(spin(@primary-color,-20),20%) 100%);
        background-color: #F0F0F0;
        position: relative;
        border-radius: 1px;
    }
    .percent-total::before{
      content: '';
      position: absolute;
      width: 80px;
      height: @percent-height - 0.13px;
      background-image: linear-gradient(to right, darken(@primary-color,4%) 0%, lighten(spin(@primary-color,-20),20%) 100%);
      transform-origin: left;
      animation: LeftToRight 5s 1;
      justify-content: space;
    }
    .percent-free{
        height: @percent-height;
        background-color: #F0F0F0;
        float: right;
        position: relative;
    }
    .percent-text{
        position: absolute;
        width: 100%;
        height: @percent-height;
        background-color: rgba(0,0,0,0);
        display: flex;
        justify-content: right;
        align-items: center;
        font-size: 10px;
        span{
          margin-right: 4px;
        };        
    }
    @keyframes LeftToRight {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
</style>