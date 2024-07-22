<template>
    <div>
        <div class="card-space">
            <label for="">平台：</label>
            <a-select style="width: 300px" v-model="selectedGroup" @change="handleChange">
                <a-select-option v-for="(value,index) in hostGroups" :key="index" :value="value">
                    {{ value }}
                </a-select-option>
            </a-select>
        </div>

        <div class="content">
            <a-card class="card-space">
                <a-row :gutter="8">
                    <a-col :span="5">
                        <a-card size="small" ca :hoverable="true"  :bodyStyle="{margin:'0px',padding:'0px'}" class="cardview">
                            <div class="view-title">设备总数</div>
                            <div class="view-content">
                                <div class="iconfont icon-device"></div>
                                <div class="view-value">{{getItemValue("db_device_num")}}</div>      
                            </div>                                        
                        </a-card>
                    </a-col>
                    <a-col :span="5">
                        <a-card size="small" :hoverable="true"  :bodyStyle="{margin:'0px',padding:'0px'}" class="cardview">
                            <div class="view-title">在线设备数</div>
                            <div class="view-content">
                                <div class="iconfont icon-online-device"></div>
                                <div class="view-value">{{getItemValue("db_device_online_num")}}</div>      
                            </div>                                        
                        </a-card>
                    </a-col>
                    <a-col :span="5">
                        <a-card size="small" :hoverable="true" :bodyStyle="{margin:'0px',padding:'0px'}" class="cardview">
                            <div class="view-title">机构数</div>
                            <div class="view-content">
                                <div class="iconfont icon-jigou"></div>
                                <div class="view-value">{{getItemValue("db_organization_num")}}</div>      
                            </div>                                        
                        </a-card>
                    </a-col>
                    <a-col :span="5">
                        <a-card size="small" :hoverable="true"  :bodyStyle="{margin:'0px',padding:'0px'}" class="cardview">
                            <div class="view-title">用户数</div>
                            <div class="view-content">
                                <div class="iconfont icon-user"></div>
                                <div class="view-value">{{getItemValue("db_users_num")}}</div>      
                            </div>                                        
                        </a-card>
                    </a-col>
                    <a-col :span="5">
                        <a-card size="small" :hoverable="true"  :bodyStyle="{margin:'0px',padding:'0px'}" class="cardview">
                            <div class="view-title">活跃用户数</div>
                            <div class="view-content">
                                <div class="iconfont icon-user-live"></div>
                                <div class="view-value">{{getItemValue("db_users_live")}}</div>      
                            </div>                                        
                        </a-card>
                    </a-col>
                </a-row>
            </a-card>

            <a-row :gutter="8" class="card-space">
                <a-col :span="12">
                    <a-card title="机构设备分布统计" :headStyle="{'font-weight':'bold'}" >
                        <OrgDeviceBar v-show="organizationDevice.hasOwnProperty('deviceOrgs')" :organizationDevice="organizationDevice"></OrgDeviceBar>
                        <a-empty v-show="!organizationDevice.hasOwnProperty('deviceOrgs')" style="width: auto;height:18vw;display:flex;align-items:center;justify-content:center"/>
                    </a-card>
                </a-col>
                <a-col :span="12">
                    <a-card title="机型设备数统计" :headStyle="{'font-weight':'bold'}">
                        <a-tooltip slot="extra" placement="bottom" overlayClassName="bgc_tooltip">
                            <template slot="title"><span>统计图</span></template>
                            <a-icon  type="area-chart" @click="changeModelType('pie')" class="icon-pie-basic icon-basic" :class="iconPieColor"/>                           
                        </a-tooltip>
                        <a-tooltip slot="extra" placement="bottom" overlayClassName="bgc_tooltip">
                            <template slot="title"><span>统计表</span></template>
                            <a-icon type="unordered-list" @click="changeModelType('table')" class="icon-table-basic icon-basic" :class="iconTableColor"/>                          
                        </a-tooltip>                     
                        <ModelTable v-if="!modelType && modelValues.length" :modelValues="modelValues"></ModelTable>
                        <ModelPie v-else-if="modelType && modelValues.length"  :modelValues="modelValues"></ModelPie>
                        <a-empty v-show="modelValues.length == 0" style="width: auto;height:18vw;display:flex;align-items:center;justify-content:center"/>
                    </a-card>
                </a-col>
            </a-row>
            
            <a-card title="年增长趋势" class="card-space" :headStyle="{'font-weight':'bold'}" >
                <a-row  :gutter="8">
                    <a-col :span="6">
                        <a-card title="机构" size="small" :headStyle="{'font-size':'12px','background':'rgba(0,0,0,0.03)'}" :bodyStyle="{'padding':'0px'}">
                            <a-button slot="extra" size="small" style="visibility:hidden;"></a-button>
                            <YearOrg v-show="yearOrganization.year.length" :yearOrganization="yearOrganization"></YearOrg>
                            <a-empty :description="false" v-show="!yearOrganization.year.length" style="width: auto;height:120px;display:flex;align-items:center;justify-content:center"/>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card title="用户" size="small" :headStyle="{'font-size':'12px','background':'rgba(0,0,0,0.03)'}" :bodyStyle="{'padding':'0px'}">
                            <a-button slot="extra" size="small" style="visibility:hidden;"></a-button>
                            <YearUser v-show="yearUser.year.length" :yearUser="yearUser"></YearUser>
                            <a-empty :description="false" v-show="!yearUser.year.length" style="width: auto;height:120px;display:flex;align-items:center;justify-content:center"/>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card title="设备" size="small" :headStyle="{'font-size':'12px','background':'rgba(0,0,0,0.03)'}" :bodyStyle="{'padding':'0px'}">
                            <a-button slot="extra" size="small" style="visibility:hidden;"></a-button>
                            <YearDevice v-show="yearDevice.year.length" :yearDevice="yearDevice"></YearDevice>
                            <a-empty :description="false" v-show="!yearDevice.year.length" style="width: auto;height:120px;display:flex;align-items:center;justify-content:center"/>
                        </a-card>
                    </a-col>
                    <a-col :span="6">
                        <a-card title="机型在线设备数(前三)" size="small" :headStyle="{'font-size':'12px','background':'rgba(0,0,0,0.03)'}" :bodyStyle="{'padding':'0px'}">
                            <a-button slot="extra" size="small" type="link" style="font-size:12px;" @click="modalVisible=true">更多机型统计</a-button>
                            <YearModel v-show="yearModel.year.length" :yearModel="yearModel"></YearModel>
                            <a-empty :description="false" v-show="!yearModel.year.length" style="width: auto;height:120px;display:flex;align-items:center;justify-content:center"/>
                        </a-card>
                    </a-col>
                </a-row>
            </a-card>

            <a-modal
                v-model="modalVisible"
                title="机型设备数统计"
                centered
                width="80%"
                :footer="null"
                :maskClosable="false" 
            >
                <span slot="closeIcon" style="font-size:18px">✕</span>
                <YearModelDetail v-if="modalVisible" :yearModel="yearModel"></YearModelDetail>
            </a-modal>
                        
            <a-row>
                <a-card title="机构在线设备TOP10" :headStyle="{'font-weight':'bold'}" >
                    <a-table :columns="columns" :data-source="deviceTop" :pagination="false" rowKey="name">
                        <span slot="percent" slot-scope="record">{{ (record.device_online_num*100/record.device_num).toFixed(2)+"%" }}</span>
                    </a-table>
                </a-card>
            </a-row>

            <!-- <a-row>
                <a-card>
                    <a-slider range :min="1672502400" :max="1704038400" :tip-formatter="getTime" v-model="ppp"  />
                    <input type="text" :value="getTime(ppp[0])"><br>
                    <input type="text" :value="getTime(ppp[1])">
                </a-card>
            </a-row> -->
        </div>
    </div>
</template>

<script>
import { getZabbixResource } from '@/api/zabbix'
import defaultSettings from '@/config/defaultSettings'

import ModelPie from './components/ModelPie'
import ModelTable from './components/ModelTable'
import OrgDeviceBar from './components/OrgDeviceBar'
import YearOrg from './components/YearOrg'
import YearUser from './components/YearUser'
import YearDevice from './components/YearDevice'
import YearModel from './components/YearModel'
import YearModelDetail from './components/YearModelDetail'

// import { Slider } from 'ant-design-vue';

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: '名称',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '在线设备数',
    key: 'device_online_num',
    dataIndex: 'device_online_num',
  },
  {
    title: '设备总数',
    dataIndex: 'device_num',
    key: 'device_num',
  },
  {
    title: '在线率',
    key: 'percent',
    scopedSlots: { customRender: 'percent' },
  }
];

export default {
    components: {ModelPie,ModelTable,OrgDeviceBar,YearOrg,YearUser,YearDevice,YearModel,YearModelDetail},
    data() {
        return {
            zabbixResource:"",
            hostGroups: [],
            selectedGroup: "DN5-DM-G-IOT",
            modelType: true,
            modelValues: [],
            deviceTop: [],
            columns,
            organizationDevice: {},
            yearOrganization: {year:[],organization:[]},
            yearUser: {year:[],user:[]},
            yearDevice: {year:[],deviceOnline:[],deviceTotal:[]},
            yearModel: {year:[],model:[]},
            modalVisible: false,
            iconTableColor: "icon-unselected-color",
            iconPieColor: "icon-selected-color",
        }
    },
    mounted(){
        getZabbixResource({
            "jsonrpc": "2.0",
            "method": "host.get",
            "params": {
                "output": ["hostgroups"],
                "selectHostGroups": "extend",
                "templateids": defaultSettings.zabbixTemplateId,
                "monitored_hosts": true,
            },
            "auth":defaultSettings.zabbixToken,
            "id":1
        }).then(res=>{
            let getGroups = []
            for(let group of res.data.result){
                getGroups.push(group.hostgroups[0].name)
            }
            getGroups.sort()
            this.hostGroups = [...new Map(getGroups.map(item => [item, item])).values()]
        })  
        
        if(this.$route.query.pf){
            this.selectedGroup = this.$route.query.pf
        }   
        
        this.handleChange()  
  
    },
    methods: {
        handleChange(){
            getZabbixResource({
                "jsonrpc": "2.0",
                "method": "item.get",
                "params": {
                    "output": ["name","lastvalue"],
                    "group": this.selectedGroup,
                    "monitored": "true",
                    "tags": [{'tag': 'Application', 'value': 'device'},{'tag': 'Application', 'value': 'opsany'}],
                    "sortfield" : "name"
                },
                "auth":defaultSettings.zabbixToken,
                "id":1
            }).then(res=>{
                this.zabbixResource = res.data
                try{
                    this.deviceTop = JSON.parse(this.getItemValue("device_online_top10"))
                }catch{
                    this.deviceTop = []
                }

                this.modelValues = []
                this.yearDevice = {year:[],deviceOnline:[],deviceTotal:[]}
                this.yearModel = {year:[],model:[]}
                let modelList = []

                let deviceResource = this.getItemValue("device统计")
                try{
                    let deviceCount = JSON.parse(deviceResource).data
                    for(let device of deviceCount){
                        this.yearDevice.year.push(device.year)
                        this.yearModel.year.push(device.year)
                        this.yearDevice.deviceOnline.push(device.online)
                        this.yearDevice.deviceTotal.push(device.total)
                    }

                    let lastItem = deviceCount.slice(-1)[0]
                    for(let model of lastItem.models){
                        this.modelValues.push({name: model._id,value: model.online,total: model.total})

                        let online= [],total = []
                        for(let deviceItem of deviceCount){
                            let itemValue = deviceItem.models.find(item => item._id == model._id)
                            online.push(itemValue ? itemValue.online : 0)
                            total.push(itemValue ? itemValue.total : 0)
                        }
                        modelList.push({name: model._id,online: online,total: total})   
                    }

                    //按最近年份在线设备数排序
                    outer:for(let model1 of this.modelValues.sort((a, b) => b.value - a.value)){
                        for(let model2 of modelList){
                            if(model1.name == model2.name){
                                this.yearModel.model.push(model2)
                                continue outer
                            }
                        }
                    }
                }catch{}
                
                this.organizationDevice = {}
                this.yearOrganization = {year:[],organization:[]}
                var orgDeviceResource = this.getItemValue("机构统计")
                try{
                    var orgDeviceCount = JSON.parse(orgDeviceResource)
                    this.organizationDevice = {
                        deviceOrgs: [orgDeviceCount.deviceorgs.devicezero,orgDeviceCount.deviceorgs.device10,orgDeviceCount.deviceorgs.device100,orgDeviceCount.deviceorgs.device1000,orgDeviceCount.deviceorgs.device1000plus],
                        onlineDeviceOrgs: [orgDeviceCount.onlinedeviceorgs.onlinedevicezero,orgDeviceCount.onlinedeviceorgs.onlinedevice10,orgDeviceCount.onlinedeviceorgs.device100,orgDeviceCount.onlinedeviceorgs.device1000,orgDeviceCount.onlinedeviceorgs.onlinedevice1000plus]
                    }
                    for(let org of orgDeviceCount.data){
                        this.yearOrganization.year.push(org.year)
                        this.yearOrganization.organization.push(org.total)
                    }
                }catch{
                    this.organizationDevice = {}
                }
                
                this.yearUser = {year:[],user:[]}
                var userResource = this.getItemValue("users统计")
                try{
                    var userCount = JSON.parse(userResource)
                    for(let user of userCount.data){
                        this.yearUser.year.push(user.year)
                        this.yearUser.user.push(user.total)
                    }
                }catch{} 
            }) 
        }, 
        changeModelType(type){
            if(type == "table"){
                this.modelType = false
                this.iconTableColor = "icon-selected-color"
                this.iconPieColor = "icon-unselected-color"
            }
            if(type == "pie"){
                this.modelType = true
                this.iconTableColor = "icon-unselected-color"
                this.iconPieColor = "icon-selected-color"
            }
        },
        getTime(timestamp){
            let date = new Date(parseInt(timestamp) * 1000);
            let Year = date.getFullYear();
            let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
            let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
            let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
            let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
            let  GMT =  Year + '-' + Moth + '-' + Day + '   '+ Hour +':'+ Minute  + ':' + Sechond;
            return GMT
        }
    },
    computed:{
        getItemValue(){
            return function(itemName){
                try{
                    return this.zabbixResource.result.find(item => item.name == itemName).lastvalue                       
                }catch{}
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .iconfont{
        font-size: 3.6vw;
    }
    .view-title{
        height:1.4vw;font-size:0.82vw;padding-left:5px;padding-top:5px;
    }
    .view-content{
        display:flex;justify-content:center;align-items:center;
    }
    .view-value{
        margin-left: 0.4vw;
        font-size:1.6vw;
        font-weight: 600;
    }
    .card-space{
        margin-bottom: 8px;
    }

    .cardview:hover{
        background-color: #F8F8F8;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        .view-value{
            font-size: 2.2vw;
            text-shadow: 2px 2px 1px #A8A8A8 ;
            font-weight: 700;
        }
    }
    ::v-deep .ant-table .ant-table-thead > tr > th{
        background-color: rgba(0,0,0,0.03);
    }
    ::v-deep .ant-table-tbody > tr > td,::v-deep .ant-table-thead > tr > th {
        padding: 9px;
    }

    ::v-deep .model-table .ant-table-tbody > tr > td,::v-deep .model-table .ant-table-thead > tr > th {
        padding: 6px;
    }  

    .icon-table-basic{
        font-size: 17px;
    }

    .icon-pie-basic{
        font-size: 18px;
        margin-right: 8px;
    }

    .icon-selected-color,.icon-basic:hover{
        color: @primary-color
    }

    .icon-unselected-color{
        color: #989898
    }    
   
    .ant-col-5 {
        width: 20%;
    }

</style>
<style lang="less">
    .bgc_tooltip {
        .ant-tooltip-inner {
            // 这里是框框
            font-size: 10px;
            height: 20px;
            line-height: 20px;
            // width: 46px;
            min-height: 20px;
            min-width: 20px;
            display: flex;
            align-items: center;
            background-color: #585858;
        }
        .ant-tooltip-arrow::before {
            // 这里是小三角形
            background-color: #585858;
        }
    }
</style>