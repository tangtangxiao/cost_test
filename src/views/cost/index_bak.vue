<template>
    <div>    
        <a-card :bodyStyle="{'padding':'0px'}">
            <a-page-header
            style="border-bottom: 2px solid rgb(235, 237, 240)"
            title="产品线年费用统计"
            >
                <a-breadcrumb slot="subTitle" separator=">">
                    <a-breadcrumb-item style="color: rgba(0, 0, 0, 0.65)">费用统计</a-breadcrumb-item>
                    <a-breadcrumb-item style="color: rgba(0, 0, 0, 0.65)">产品线年费用统计</a-breadcrumb-item>
                </a-breadcrumb>
            </a-page-header>
            <a-row>
                <a-spin :spinning="!(applicationGroupResource.length && platformGroupResource.length)">
                    <a-col :span="4" style="padding: 10px;border-right:1px solid #E8E8E8;overflow:hidden;min-height: 600px">
                        <a-tree
                            show-line
                            :tree-data="getTreeData(applicationResource,applicationGroupResource)"
                            @select="onSelect"   
                            :selectedKeys="selectedKeys"
                        />                 
                    </a-col>   
                    <a-col :span="20" style="padding:10px 10px 20px 10px ;border-left:1px solid #E8E8E8;margin-left: -1px;">
                        <a-row style="margin-bottom: 10px;">
                            <a-col :span="12">
                                <a-input-search placeholder="应用平台名称" style="width: 200px" v-model="searchKey" @search="onSearch"/>
                            </a-col>
                            <a-col :span="12" style="display: flex;justify-content: right">
                                <a-button type="primary" @click="getHostCostResource(true)" ghost style="margin-right: 10px;"><a-icon type="reload" :spin="flush_status"/> 刷新</a-button>
                                <a-button type="primary" @click="sortHostCostResource" ghost style="margin-right: 10px;"><a-icon type="rise"/> 排序</a-button>
                                <a-button type="primary" @click="syncCloudHost"><a-icon type="sync" :spin="sync_status"/> 云主机资源同步</a-button>
                            </a-col>
                        </a-row>
                        <a-divider style="margin:0px auto 0px auto"/>
                        <div v-for="(item,index) in platformGroupPageResource" :key="index" class="pf" >
                            <dir style="margin:0px;padding:0px;padding-top:6px;cursor: pointer;" ref="pfs" class="platformInfo" @click="platformHostDisplay(index)"> 
                                <div><span class="pg-name"><span class="iconfont icon2-pingtaiguanli"></span> {{item.name}}</span></div>      
                                <a-descriptions size="small" style="padding-left: 30px;" :column="{ xs: 1, sm: 2, md: 4}" >
                                    <a-descriptions-item label="主机数"><a-tag color="cyan">{{item.host.length}}</a-tag></a-descriptions-item>
                                    <a-descriptions-item >
                                        <span style="display: flex;align-items: center;line-height: 10px;">
                                            <font style="color: rgba(0, 0, 0, 0.85)">云服务商:</font>
                                            <a-tooltip slot="extra" overlayClassName="bgc_tooltip" placement="bottomLeft">
                                                <template slot="title"><span>{{ getCloudResource(item.cloudResourceId,2)}}</span></template>
                                                <span v-if="getCloudResource(item.cloudResourceId,2).includes('阿里云')" class="iconfont icon2-aliyun1" style="font-size: 30px;margin-left: 6px;"></span>
                                                <span v-else-if="getCloudResource(item.cloudResourceId,2).includes('腾讯')" class="iconfont icon2-tengxunyun2" style="font-size: 26px;margin-left: 6px;"></span>
                                                <span v-else-if="getCloudResource(item.cloudResourceId,2).includes('亚马逊')" class="iconfont icon2-aws" style="font-size: 30px;margin-left: 6px;"></span>
                                                <span v-else-if="getCloudResource(item.cloudResourceId,2).includes('微软')" class="iconfont icon2-azure" style="font-size: 30px;margin-left: 6px;"></span>
                                                <span v-else-if="getCloudResource(item.cloudResourceId,2).includes('华为')" class="iconfont icon2-huaweiyun" style="font-size: 30px;margin-left: 6px;"></span>                                
                                            </a-tooltip>
                                        </span>
                                    </a-descriptions-item>
                                    <a-descriptions-item label="所属云区域">{{getCloudResource(item.cloudResourceId,0)}}</a-descriptions-item>
                                    <a-descriptions-item label="所属公有云">{{getCloudResource(item.cloudResourceId,1)}}</a-descriptions-item>
                                    <a-descriptions-item label="主机费用">{{formatNumber(item.hostCost)}}</a-descriptions-item>
                                    <a-descriptions-item label="磁盘费用">{{formatNumber(item.diskCost)}}</a-descriptions-item>
                                    <a-descriptions-item label="带宽费用">{{formatNumber(item.bandwidthCost)}}</a-descriptions-item>
                                    <a-descriptions-item label="总费用">
                                        <span style="font-size: 20px;font-weight: bold;color:#EF8A4F">
                                            <span v-if="item.currencyClass[0] == '1'">¥</span>
                                            <span v-else-if="item.currencyClass[0] == '2'">$</span>
                                            <span v-else-if="item.currencyClass[0] == '3'">€</span>                            
                                            {{formatNumber(item.hostCost + item.diskCost + item.bandwidthCost)}}
                                        </span>             
                                    </a-descriptions-item>
                                </a-descriptions>
                            </dir>
                            <div ref="table" style="max-height: 0px;overflow: hidden;">
                                <a-table   :columns="columns" :data-source="item.host" :pagination="false" rowKey="code"  :scroll="{ x: 1900 }">
                                    <span v-if="record.data.HOST_COST_run_status == '运行中'" slot="instanceName" slot-scope="record" class="truncate" style="width: 160px;">{{record.data.HOST_COST_instance_id}}<br><span class="host-status" style="background: #0BCE13;"></span>{{record.data.HOST_COST_VISIBLE_NAME}}</span>
                                    <span v-else-if="record.data.HOST_COST_run_status == '已关机'" slot="instanceName" slot-scope="record" class="truncate" style="width: 160px;">{{record.data.HOST_COST_instance_id}}<br><span class="host-status" style="background: #D42415;"></span>{{record.data.HOST_COST_VISIBLE_NAME}}</span>
                                    <span v-else slot="instanceName" slot-scope="record" class="truncate" style="width: 160px;">{{record.data.HOST_COST_instance_id}}<br><span class="host-status" style="background: #999797;"></span>{{record.data.HOST_COST_VISIBLE_NAME}}</span>
                                    <span slot="ipaddress" slot-scope="record">{{record.data.HOST_COST_local_ip}}<br>{{record.data.HOST_COST_public_ip}}</span>
                                    <span slot="countStatus" slot-scope="record">
                                        <span v-if="record.data.HOST_COST_count_status == '1'" style="color:green">正常</span>
                                        <span v-else-if="record.data.HOST_COST_count_status == '2'" style="color:red">停止</span>
                                    </span>
                                    <span slot="hostCountType" slot-scope="record">
                                        <span v-if="record.data.HOST_COST_host_cost_cycle == '1'">按量付费(小时计费)</span>
                                        <span v-else-if="record.data.HOST_COST_host_cost_cycle == '2'">包年包月(按月计费)</span>
                                        <span v-else-if="record.data.HOST_COST_host_cost_cycle == '3'">包年包月(按年计费)</span>
                                    </span>
                                    <span slot="diskCountType" slot-scope="record">
                                        <span v-if="record.data.HOST_COST_disk_cost_cycle == '1'">按量付费(小时计费)</span>
                                        <span v-else-if="record.data.HOST_COST_disk_cost_cycle == '2'">包年包月(按月计费)</span>
                                        <span v-else-if="record.data.HOST_COST_disk_cost_cycle == '3'">包年包月(按年计费)</span>
                                    </span>
                                    <span slot="bandwidthCountType" slot-scope="record">
                                        <span v-if="record.data.HOST_COST_bandwidth_cost_cycle == '1'">按量付费(小时计费)</span>
                                        <span v-else-if="record.data.HOST_COST_bandwidth_cost_cycle == '2'">包年包月(按月计费)</span>
                                        <span v-else-if="record.data.HOST_COST_bandwidth_cost_cycle == '3'">包年包月(按年计费)</span>
                                    </span>
                                </a-table>
                            </div>
                        </div>
                        <div style="margin-top:20px;display:flex;justify-content: right;;">
                            <a-pagination
                            v-model="current"
                            :page-size-options="pageSizeOptions"
                            :total="total"
                            show-size-changer
                            :show-total="total => `共 ${total} 条`"
                            :page-size="pageSize"
                            @showSizeChange="onShowSizeChange"
                            @change="pageChange"
                            >
                            <template slot="buildOptionText" slot-scope="props">
                                <span v-if="props.value !== showTotal.toString()">{{ props.value }}条/页</span>
                                <span v-if="props.value === showTotal.toString()">全部</span>
                            </template>
                        </a-pagination>
                        </div>                   
                    </a-col>  
                </a-spin>    
            </a-row>
        </a-card>
    </div>
</template>

<script>
import request from '@/utils/request'
import defaultSettings from '@/config/defaultSettings'
import apiResource from '@/config/apiResource'

import {mapActions,mapState} from 'vuex'

export default {
    data() {
        return {
            sync_status: false,
            flush_status: false,
            searchKey: "",
            requestData: "",
            serverCost: [],
            platformGroupResource: [],
            platformGroupTreeResource: [],
            platformGroupShowResource: [],
            platformGroupPageResource: [],
            pgHostShowStatus: null,
            cloudProvide: new Set(),
            publicCloudResource: [],
            cloudRegionResource: [],
            cloudAzResource: [],

            applicationResource: [],
            applicationGroupResource: [],

            errorMessage: [],
            columns: [
                {
                    title: "实例ID/实例名称",
                    scopedSlots: { customRender: 'instanceName' },
                    width: '200px',
                    fixed: 'left',
                },
                {
                    title: "计费状态",
                    scopedSlots: { customRender: 'countStatus' },
                },
                {
                    dataIndex: 'data.HOST_COST_cpu_core_number',
                    title: 'CPU数'
                },
                {
                    dataIndex: 'data.HOST_COST_memory',
                    title: '内存(MB)'
                },
                {
                    title: "内网IP/公网IP",
                    scopedSlots: { customRender: 'ipaddress' },
                },
                {
                    title: '操作系统',
                    dataIndex: 'data.HOST_COST_host_os',
                    width: '110px',
                    ellipsis: true,
                },
                {
                    dataIndex: 'data.HOST_COST_expire_datetime',
                    title: '过期时间'
                },
                {
                    dataIndex: 'data.totalCostCount',
                    title: '费用合计'
                },               
                {
                    scopedSlots: { customRender: 'hostCountType' },
                    title: '主机计费方式',
                    width: '120px'
                },
                {
                    dataIndex: 'data.HOST_COST_host_cost',
                    title: '主机费用'
                },
                {
                    scopedSlots: { customRender: 'diskCountType' },
                    title: '磁盘计费方式',
                    width: '120px'
                },
                {
                    dataIndex: 'data.HOST_COST_disk_cost',
                    title: '磁盘费用'
                },
                {
                    scopedSlots: { customRender: 'bandwidthCountType' },
                    title: '带宽计费方式',
                    width: '120px'
                },
                {
                    dataIndex: 'data.HOST_COST_bandwidth_cost',
                    title: '带宽费用'
                },
                {
                    dataIndex: 'data.HOST_COST_updatetime',
                    title: '更新时间',
                },
                {
                    title: '备注',
                    dataIndex: 'data.HOST_COST_remark',
                    ellipsis: true,
                },
            ],
            pageSizeOptions: ['10', '20', '50'],
            current: 1,
            pageSize: 10,
            total: 0,
            showTotal: 0,
            sortType: 0,
            selectedKeys: [0],
        }
    },
    mounted(){ 
        this.getHostCostResource()
        
        // request({
        //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=APPLICATION&page=1&per_page=100000",
        //     method: "get",
        //     params: "",
        // }).then(res=>{
        //     for(let item of res.data.data){
        //         item.data.parent_inst = item.parent_inst
        //         this.applicationResource.push(item.data)
        //     }
        // })

        // request({
        //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=BUSINESS&page=1&per_page=1000",
        //     method: "get",
        //     params: "",
        // }).then(res=>{
        //     for(let item of res.data.data){
        //         item.data.code = item.code
        //         this.applicationGroupResource.push(item.data)
        //     }
        // })

        // this.$store.dispatch('productLineCost/applicationResource')
        // this.$store.dispatch('productLineCost/applicationGroupResource')
        
        // request({
        //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=PUBLIC_CLOUD&per_page=1000",
        //     method: "get",
        //     params: "",
        // }).then(res=>{
        //     for(let item of res.data.data){
        //         this.cloudProvide.add(item.data.PUBLIC_CLOUD_PROVIDE)
        //         item.data.code = item.code
        //         this.publicCloudResource.push(item.data)
        //     }
        // })

        // request({
        //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=CLOUD_REGION&per_page=10000",
        //     method: "get",
        //     params: "",
        // }).then(res=>{
        //     for(let item of res.data.data){
        //         item.data.code = item.code
        //         item.data.parent_inst = item.parent_inst
        //         this.cloudRegionResource.push(item.data)
        //     }
        // })

        // request({
        //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=CLOUD_AZ&per_page=10000",
        //     method: "get",
        //     params: "",
        // }).then(res=>{
        //     for(let item of res.data.data){
        //         item.data.code = item.code
        //         item.data.parent_inst = item.parent_inst
        //         this.cloudAzResource.push(item.data)
        //     }
        // })

        this.publicCloudResource = apiResource.publicCloudResource
        this.cloudRegionResource = apiResource.cloudRegionResource
        this.cloudAzResource = apiResource.cloudAzResource
        this.applicationResource = apiResource.applicationResource
        this.applicationGroupResource = apiResource.applicationGroupResource     
    },
    methods: {
        onSelect(selectedKeys) {
            this.current = 1
            this.platformGroupTreeResource = []
            this.selectedKeys = selectedKeys
            if(typeof(selectedKeys[0]) == 'string'){
                this.platformGroupTreeResource = this.platformGroupResource.filter(item=>item.name == selectedKeys[0])
            }else if(typeof(selectedKeys[0]) == 'number'){
                if(selectedKeys[0] == 0){
                    this.platformGroupTreeResource = this.platformGroupResource
                }else{
                    this.platformGroupTreeResource = this.platformGroupResource.filter(item => {
                        let appItem = this.applicationResource.find(aitem => aitem.APPLICATION_name == item.name)
                        return appItem && appItem.parent_inst == selectedKeys[0]
                    })
                }
            }
            this.onSearch()
            this.hideHost()
            this.pgHostShowStatus = null
        },
        onShowSizeChange(current, pageSize) {
            this.pageSize = pageSize;
            this.platformGroupPageResource = this.platformGroupShowResource.slice(current*pageSize-pageSize,current*pageSize)
        },
        pageChange(page, pageSize){
            this.platformGroupPageResource = this.platformGroupShowResource.slice(page*pageSize-pageSize,page*pageSize)
         
        },
        hideHost(){
            for(let item of this.$refs.table){
                item.style.transition = "5ms"
                item.style.maxHeight = "0px"
            }  
            for(let item of this.$refs.pfs){
                item.style.background = "white"
            }         
        },
        platformHostDisplay(index){
            this.hideHost()
            if(this.pgHostShowStatus != index){
                this.$refs.table[index].style.transition = "20s"       
                this.$refs.table[index].style.maxHeight = "10000px"
                this.$refs.pfs[index].style.background = "rgba(175,219,205,0.5)"
                this.pgHostShowStatus = index
            }else{
                this.pgHostShowStatus = null
            }
        },
        onSearch() {
            this.current = 1 
            let searchKey = this.searchKey.trim()
            if(searchKey != ""){
                this.platformGroupShowResource = this.platformGroupTreeResource.filter(item => {
                    return item.name && item.name.toLowerCase().includes(searchKey.toLowerCase())
                })             
            }else{
                this.platformGroupShowResource = this.platformGroupTreeResource
            }
            this.total = this.platformGroupShowResource.length
            this.platformGroupPageResource = this.platformGroupShowResource.slice(this.current*this.pageSize-this.pageSize,this.current*this.pageSize)
        },
        sortHostCostResource(){
            let sortArr = [
                (a,b)=> b.hostCost + b.diskCost + b.bandwidthCost - a.hostCost - a.diskCost - a.bandwidthCost,     //按总费用排序
                (a,b)=> b.host.length - a.host.length,              //按主机数排序
                (a,b)=>{                                            //按名称排序
                    if(a.name && b.name){
                        let nameA = a.name.toUpperCase(); 
                        let nameB = b.name.toUpperCase();
                        if(nameB > nameA){
                            return -1
                        }else if(nameB < nameA){
                            return 1
                        }
                    }
                },
            ]
     
            this.platformGroupShowResource.sort(sortArr[this.sortType])
            this.hideHost()
            this.pgHostShowStatus = null
            this.platformGroupPageResource = this.platformGroupShowResource.slice(this.current*this.pageSize-this.pageSize,this.current*this.pageSize)
            if(this.sortType < sortArr.length - 1){
                this.sortType += 1
            }else{
                this.sortType = 0
            }
        },
        getHostCostResource(flush=false){
            this.selectedKeys = [0]
            if(flush){
                this.flush_status = true
                this.hideHost()
                this.pgHostShowStatus = null
            }
        
            // let costResource = request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=HOST_COST&per_page=100000",
            //     method: "get",
            //     params: "",
            // })

            let costResource = Promise.resolve(apiResource.costResource)

            // this.platformGroupResource = []

            costResource.then(res=>{
                if(res.code == 200){
                    this.requestData = this.serverCost = res.data.data
                    let platformGroup = []
                    for(let item of this.requestData){
                        platformGroup.push(item.data.HOST_COST_application || "孤立主机组")
                    }
                    
                    if(platformGroup.includes("孤立主机组")){
                        platformGroup.unshift("孤立主机组")
                    }
                    platformGroup = new Set(platformGroup)

                    for(let item of platformGroup){
                        let platformGroupHost = this.serverCost.filter(item2 =>(item2.data.HOST_COST_application == item || item == "孤立主机组" && !("HOST_COST_application" in item2.data)))

                        let hostCostCount = 0
                        let diskCostCount = 0
                        let bandwidthCostCount = 0
                        for(let hitem of platformGroupHost){
                            let hostCost = hitem.data.HOST_COST_host_cost || 0
                            let diskCost = hitem.data.HOST_COST_disk_cost || 0
                            let bandwidthCost = hitem.data.HOST_COST_bandwidth_cost || 0
                            hitem.data.HOST_COST_host_cost_cycle = hitem.data.HOST_COST_host_cost_cycle && hitem.data.HOST_COST_host_cost_cycle.slice(0, 1) || "1"
                            hitem.data.HOST_COST_disk_cost_cycle = hitem.data.HOST_COST_disk_cost_cycle && hitem.data.HOST_COST_disk_cost_cycle.slice(0, 1) || "1"
                            hitem.data.HOST_COST_bandwidth_cost_cycle = hitem.data.HOST_COST_bandwidth_cost_cycle && hitem.data.HOST_COST_bandwidth_cost_cycle.slice(0, 1) || "1"
                            hitem.data.HOST_COST_count_status = hitem.data.HOST_COST_count_status && hitem.data.HOST_COST_count_status[0] || "1"

                            let itemHostCost = 0
                            let itemDiskCost = 0
                            let itembandwidthCost = 0

                            if(hitem.data.HOST_COST_count_status == "1"){
                                if(hitem.data.HOST_COST_host_cost_cycle == "1"){
                                    itemHostCost = hostCost * 8760
                                }else if(hitem.data.HOST_COST_host_cost_cycle == "2"){
                                    itemHostCost = hostCost * 12
                                }else if(hitem.data.HOST_COST_host_cost_cycle == "3"){
                                    itemHostCost = hostCost
                                }
                                if(hitem.data.HOST_COST_disk_cost_cycle == "1"){
                                    itemDiskCost = diskCost * 8760
                                }else if(hitem.data.HOST_COST_disk_cost_cycle == "2"){
                                    itemDiskCost = diskCost * 12
                                }else if(hitem.data.HOST_COST_disk_cost_cycle == "3"){
                                    itemDiskCost = diskCost
                                }
                                if(hitem.data.HOST_COST_bandwidth_cost_cycle == "1"){
                                    itembandwidthCost = bandwidthCost * 8760
                                }else if(hitem.data.HOST_COST_bandwidth_cost_cycle == "2"){
                                    itembandwidthCost = bandwidthCost * 12
                                }else if(hitem.data.HOST_COST_bandwidth_cost_cycle == "3"){
                                    itembandwidthCost = bandwidthCost
                                }
                            }
                            hostCostCount += itemHostCost
                            diskCostCount += itemDiskCost
                            bandwidthCostCount += itembandwidthCost

                            hitem.data.totalCostCount = this.formatNumber(itemHostCost + itemDiskCost + itembandwidthCost)
                        }

                        this.platformGroupResource.push({
                            name: item,
                            host: platformGroupHost,
                            hostCost: hostCostCount,
                            diskCost: diskCostCount,
                            bandwidthCost: bandwidthCostCount,
                            cloudResourceId: item == "孤立主机组" ? "" : platformGroupHost[0].data.HOST_COST_parent_inst,
                            currencyClass: platformGroupHost[0].data.HOST_COST_currency_class || "1"
                        })
                    }

                    this.platformGroupTreeResource = this.platformGroupShowResource =  this.platformGroupResource
                    this.onSearch()
                    this.flush_status = false

                    if(this.showTotal > this.pageSizeOptions[this.pageSizeOptions.length-1]){
                        this.pageSizeOptions.push(this.showTotal.toString())
                    } 
                }else{
                    this.$message.error('获取费用信息失败：'+message)
                    this.flush_status = false
                }      
            })
        },
        getCurrentTime() {
            var date = new Date();
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
            var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
            var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
            return Y+M+D+h+m+s;
        }, 
        formatNumber(num) {
            if (!Number.isInteger(num)) {
                num = num.toFixed(2);
            }
            return Number(num)
        }, 
        createCostHostRequest(params){
            return request({
                url: defaultSettings.cmdbModelUrl+"/import/",
                method: "post",
                data: params                
            })
        },
        updateCostHostRequest(params){
            return request({
                url: defaultSettings.cmdbModelUrl+"/import/",
                method: "put",
                data: params                
            })
        },
        syncCloudHost(){
            this.sync_status = true
            let cloudHostRequest = request({
                url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=CLOUD_SERVER&per_page=100000",
                method: "get",
                params: "",
            })

            cloudHostRequest.then(res=>{
                let cloudHostObj = {}
                let nu = 0
                for(let item of res.data.data){
                    let changeObj = this.requestData.find(ite=>ite.data.HOST_COST_name == item.data.CLOUD_SERVER_name)
                    if(!changeObj){
                        Object.defineProperty(cloudHostObj,"name"+nu,{
                            value: this.createCostHostRequest({
                                "model_code":"HOST_COST",
                                "data":{
                                    "HOST_COST_VISIBLE_NAME":item.data.CLOUD_SERVER_VISIBLE_NAME,
                                    "HOST_COST_name":item.data.CLOUD_SERVER_name,
                                    "HOST_COST_instance_name":item.data.CLOUD_SERVER_INSTANCE_NAME,
                                    "HOST_COST_instance_id":item.data.CLOUD_SERVER_INSTANCE_ID,
                                    "HOST_COST_hostname":item.data.CLOUD_SERVER_HOSTNAME,
                                    "HOST_COST_run_status":item.data.CLOUD_SERVER_RUN_STATUS,
                                    "HOST_COST_local_ip":item.data.CLOUD_SERVER_INTERNAL_IP,
                                    "HOST_COST_public_ip":item.data.CLOUD_SERVER_PUBLIC_IP,
                                    "HOST_COST_expire_datetime":item.data.CLOUD_SERVER_EXPIRE_DATETIME,
                                    "HOST_COST_application":item.data.CLOUD_SERVER_IN_APPLICATION,
                                    "HOST_COST_memory":item.data.CLOUD_SERVER_MEMORY,
                                    "HOST_COST_cpu_core_number":item.data.CLOUD_SERVER_CPU_NUM,
                                    "HOST_COST_host_os":item.data.CLOUD_SERVER_OS,
                                    "HOST_COST_parent_inst": item.parent_inst,
                                    "HOST_COST_count_status":"1",
                                    "HOST_COST_updatetime":this.getCurrentTime(),
                                    "HOST_COST_remark":""
                                },
                                "pk_name":"HOST_COST_name",
                                "pk_value":item.data.CLOUD_SERVER_INSTANCE_ID
                            }),
                            writable: true,
                            enumerable:true
                        })
                    }else{
                        let cloudHostPropertyStr = item.data.CLOUD_SERVER_VISIBLE_NAME+item.data.CLOUD_SERVER_name+item.data.CLOUD_SERVER_INSTANCE_NAME+item.data.CLOUD_SERVER_INSTANCE_ID+item.data.CLOUD_SERVER_HOSTNAME+item.data.CLOUD_SERVER_RUN_STATUS+item.data.CLOUD_SERVER_INTERNAL_IP+item.data.CLOUD_SERVER_PUBLIC_IP+item.data.CLOUD_SERVER_EXPIRE_DATETIME+item.data.CLOUD_SERVER_IN_APPLICATION+item.data.CLOUD_SERVER_MEMORY+item.data.CLOUD_SERVER_CPU_NUM+item.data.CLOUD_SERVER_OS+item.parent_inst
                        let hostCostPropertyStr = changeObj.data.HOST_COST_VISIBLE_NAME+changeObj.data.HOST_COST_name+changeObj.data.HOST_COST_instance_name+changeObj.data.HOST_COST_instance_id+changeObj.data.HOST_COST_hostname+changeObj.data.HOST_COST_run_status+changeObj.data.HOST_COST_local_ip+changeObj.data.HOST_COST_public_ip+changeObj.data.HOST_COST_expire_datetime+changeObj.data.HOST_COST_application+changeObj.data.HOST_COST_memory+changeObj.data.HOST_COST_cpu_core_number+changeObj.data.HOST_COST_host_os+changeObj.data.HOST_COST_parent_inst
                        if(cloudHostPropertyStr != hostCostPropertyStr){
                            Object.defineProperty(cloudHostObj,"name"+nu,{
                                value: this.updateCostHostRequest({
                                    "code":changeObj.code,
                                    "model_code":"HOST_COST",
                                    "data":{
                                        "HOST_COST_VISIBLE_NAME":item.data.CLOUD_SERVER_VISIBLE_NAME,
                                        "HOST_COST_name":item.data.CLOUD_SERVER_name,
                                        "HOST_COST_instance_name":item.data.CLOUD_SERVER_INSTANCE_NAME,
                                        "HOST_COST_instance_id":item.data.CLOUD_SERVER_INSTANCE_ID,
                                        "HOST_COST_hostname":item.data.CLOUD_SERVER_HOSTNAME,
                                        "HOST_COST_parent_inst":item.parent_inst,
                                        "HOST_COST_run_status":item.data.CLOUD_SERVER_RUN_STATUS,
                                        "HOST_COST_local_ip":item.data.CLOUD_SERVER_INTERNAL_IP,
                                        "HOST_COST_public_ip":item.data.CLOUD_SERVER_PUBLIC_IP,
                                        "HOST_COST_expire_datetime":item.data.CLOUD_SERVER_EXPIRE_DATETIME,
                                        "HOST_COST_application":item.data.CLOUD_SERVER_IN_APPLICATION,
                                        "HOST_COST_memory":item.data.CLOUD_SERVER_MEMORY,
                                        "HOST_COST_cpu_core_number":item.data.CLOUD_SERVER_CPU_NUM,
                                        "HOST_COST_host_os":item.data.CLOUD_SERVER_OS,
                                        "HOST_COST_count_status":changeObj.data.HOST_COST_count_status,
                                        "HOST_COST_currency_class":changeObj.data.HOST_COST_currency_class,
                                        "HOST_COST_host_cost_cycle":changeObj.data.HOST_COST_host_cost_cycle,
                                        "HOST_COST_host_cost":changeObj.data.HOST_COST_host_cost,
                                        "HOST_COST_disk_cost_cycle":changeObj.data.HOST_COST_disk_cost_cycle,
                                        "HOST_COST_disk_cost":changeObj.data.HOST_COST_disk_cost,
                                        "HOST_COST_bandwidth_cost_cycle":changeObj.data.HOST_COST_bandwidth_cost_cycle,
                                        "HOST_COST_bandwidth_cost":changeObj.data.HOST_COST_bandwidth_cost,
                                        "HOST_COST_updatetime":this.getCurrentTime(),
                                        "HOST_COST_remark":changeObj.data.HOST_COST_remark
                                    },
                                    "pk_name":"HOST_COST_name",
                                    "pk_value":item.data.CLOUD_SERVER_INSTANCE_ID
                                }),
                                writable: true,
                                enumerable:true
                            })
                        } 
                    }
                    nu += 1
                }
                
                function main(){
                    let arr_async = []
                    for(let item in cloudHostObj){
                        arr_async.push(cloudHostObj[item])
                    }
                    return Promise.allSettled(arr_async)
                }

                main().then(value=>{                   
                    let errMsg = []
                    let errCount = 0
                    for(let item of value){
                        if(item.status == "rejected"){
                            errCount = errCount + 1
                            errMsg.push(item.reason)
                        }
                    }
                    if(errCount == 0){
                        this.$message.success('云主机资源同步完成！')
                    }else{
                        this.$message.warning(errCount+'条记录同步失败:'+errMsg)
                    }
                    this.sync_status = false
                    this.getHostCostResource()

                    this.hideHost()
                },error=>{
                    this.$message.error('云主机资源同步失败：'+error)
                    this.sync_status = false
                })
            },err=>{
                this.$message.error('云主机资源同步失败：'+err)
                this.sync_status = false
            })
        }
    },
    computed: {
        getCloudResource(){
            return function(id,type){
                let cloudAZParent_inst = ""
                let cloudRegionParent_inst = ""
                let cloudAZ = ""
                let RegionInPublicCloud = ""
                let publicCloudProvide =""

                let cloudAZItem = this.cloudAzResource.find(it=>it.code == id)
                if(cloudAZItem){
                    cloudAZParent_inst = cloudAZItem.parent_inst
                }

                let cloudRegionItem = this.cloudRegionResource.find(it=>it.code == cloudAZParent_inst)
                if(cloudRegionItem){
                    cloudRegionParent_inst = cloudRegionItem.parent_inst
                    RegionInPublicCloud = cloudRegionItem.CLOUD_REGION_IN_PUBLIC_CLOUD
                    cloudAZ = cloudRegionItem.CLOUD_REGION_VISIBLE_NAME
                }

                if(type == 0){
                    return cloudAZ
                }else if(type == 1){
                    return RegionInPublicCloud
                }else if(type == 2){
                    let publicCloudItem = this.publicCloudResource.find(it=>it.code == cloudRegionParent_inst)
                    if(publicCloudItem){
                        publicCloudProvide = publicCloudItem.PUBLIC_CLOUD_PROVIDE
                    }
                    return publicCloudProvide
                }
            }
        },
        getTreeData(){
            return function(app,appGroup){
                let treeData = [{title: '全部产品线',key: 0}]
                if(this.platformGroupResource.find(item => item.name == "孤立主机组")){
                    treeData.push({title: '孤立主机组',key: '孤立主机组'})
                }
                
                for(let item of appGroup){
                    let appGroupItem = {
                        title: item.BUSINESS_VISIBLE_NAME,
                        key: item.code,
                        children: [{title:"loading...",key: ""}]
                    }
                    for(let appItem of app){
                        if(appItem.parent_inst == item.code){
                            appGroupItem.children.push({
                                title: appItem.APPLICATION_VISIBLE_NAME,
                                key: appItem.APPLICATION_name
                            })
                        }
                    }
                    if(appGroupItem.children.length > 1){
                        appGroupItem.children.shift()
                    }                      
                    treeData.push(appGroupItem)                   
                }
                return treeData
            }
        },

        // ...mapState("productLineCost",["applicationResource","applicationGroupResource"])
    }
}
</script>

<style lang="less" scoped>
.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
}
.card-space{
    margin-bottom: 8px;
}
.pf{
    border-bottom:1px solid rgba(0,0,0,0.1);
}
.platformInfo:hover{
    background-color: rgba(175,219,205,0.7) !important
}
.pf-table{
    display: none;
}
.host-status{
    display:inline-block;
    width:6px;
    height:6px;
    border-radius:6px;
    margin-right:2px;
}
::v-deep .ant-table .ant-table-thead > tr > th{
    background-color: rgba(0,0,0,0.08);
    // font-weight: 400;
}
::v-deep .ant-table .ant-table-tbody > tr{
    background-color: rgba(0,0,0,0.06);
}
::v-deep .ant-table-tbody > tr > td,::v-deep .ant-table-thead > tr > th {
    padding: 4px;
    font-size: 12px;
}

::v-deep .ant-table-tbody > tr >td:first-child, ::v-deep .ant-table-thead > tr >th:first-child{
    padding-left: 30px;
}

.pg-name{
    background: #F0F0F0;
    height: 30px;
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    line-height: 30px;
    border-top-right-radius: 20px 12px;
    border-bottom-right-radius: 20px 12px;
    font-size: 15px;
    font-weight: bold;
    margin-left: 20px;
    margin-top: 8px;
    margin-bottom: 8px;
    border: 1px solid #E0E0E0 ; 
}

::v-deep ::-webkit-scrollbar {
    height: 4px;
}

/* 自定义滚动条轨道 */
::v-deep ::-webkit-scrollbar-track {
     background: rgba(0,0,0,0.06);; /* 设置轨道的背景颜色 */
}
 
/* 自定义滚动条的滑块（thumb） */
::v-deep ::-webkit-scrollbar-thumb {
     background: #B8B8B8; /* 设置滑块的背景颜色 */
}
 
/* 当滑块悬停或活动时自定义滚动条的滑块 */
::v-deep ::-webkit-scrollbar-thumb:hover {
    background: #989898  ; /* 设置滑块在悬停状态下的背景颜色 */
}
</style>

<style lang="less">
    .bgc_tooltip {
        .ant-tooltip-inner {
            // 这里是框框
            font-size: 10px;
            height: 20px;
            line-height: 20px;
            min-height: 20px;
            min-width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #585858;
        }
        .ant-tooltip-arrow::before {
            // 这里是小三角形
            background-color: #585858;
        }
    }
</style>