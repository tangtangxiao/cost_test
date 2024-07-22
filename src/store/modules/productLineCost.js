import request from '@/utils/request'
import defaultSettings from '@/config/defaultSettings'
import apiResource from '@/config/apiResource'

const productLineCost = {
    namespaced: true,
    actions: {
        applicationResource: (context)=>{
            if(! context.state.applicationResource.length){
                context.commit('APPLICATIONRESOURCE')
            }    
        },
        applicationGroupResource: (context)=>{
            if(! context.state.applicationGroupResource.length){
                context.commit('APPLICATIONGROUPRESOURCE')
            } 
        },
        platformGroupResource: (context)=>{
            if(! context.state.platformGroupResource.length){
                context.commit('PLATFORMGROUPRESOURCE')
            }     
        },
        publicCloudResource: (context)=>{
            if(! context.state.publicCloudResource.length){
                context.commit('PUBLICCLOUDRESOURCE')
            }     
        },
        cloudRegionResource: (context)=>{
            if(! context.state.cloudRegionResource.length){
                context.commit('CLOUDREGIONRESOURCE')
            }     
        },
        cloudAzResource: (context)=>{
            if(! context.state.cloudAzResource.length){
                context.commit('CLOUDAZRESOURCE')
            }     
        }

    },

    mutations: {
        APPLICATIONRESOURCE: (state)=>{
            // request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=APPLICATION&page=1&per_page=100000",
            //     method: "get",
            //     params: "",
            // }).then(res=>{
            //     for(let item of res.data.data){
            //         item.data.parent_inst = item.parent_inst
            //         state.applicationResource.push(item.data)                 
            //     }
            // })  

            state.applicationResource = apiResource.applicationResource
         
        },
        APPLICATIONGROUPRESOURCE: (state)=>{
            // request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=BUSINESS&page=1&per_page=1000",
            //     method: "get",
            //     params: "",
            // }).then(res=>{
            //     for(let item of res.data.data){
            //         item.data.code = item.code
            //         state.applicationGroupResource.push(item.data)
            //     }
            // })   
            
            state.applicationGroupResource = apiResource.applicationGroupResource
        },
        PUBLICCLOUDRESOURCE: (state)=>{
            // request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=PUBLIC_CLOUD&per_page=1000",
            //     method: "get",
            //     params: "",
            // }).then(res=>{
            //     for(let item of res.data.data){
            //         item.data.code = item.code
            //         state.publicCloudResource.push(item.data)
            //     }
            // })

            state.publicCloudResource = apiResource.publicCloudResource
        },
        CLOUDREGIONRESOURCE: (state)=>{
            // request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=CLOUD_REGION&per_page=10000",
            //     method: "get",
            //     params: "",
            // }).then(res=>{
            //     for(let item of res.data.data){
            //         item.data.code = item.code
            //         item.data.parent_inst = item.parent_inst
            //         state.cloudRegionResource.push(item.data)
            //     }
            // })   
            
            state.cloudRegionResource = apiResource.cloudRegionResource
        },
        CLOUDAZRESOURCE: (state)=>{
            // request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=CLOUD_AZ&per_page=10000",
            //     method: "get",
            //     params: "",
            // }).then(res=>{
            //     for(let item of res.data.data){
            //         item.data.code = item.code
            //         item.data.parent_inst = item.parent_inst
            //         state.cloudAzResource.push(item.data)
            //     }
            // })   
            
            state.cloudAzResource = apiResource.cloudAzResource
        },
        PLATFORMGROUPRESOURCE: (state)=>{
            // let costResource = request({
            //     url: defaultSettings.cmdbModelUrl+"/import-v2/?model_code=HOST_COST&per_page=100000",
            //     method: "get",
            //     params: "",
            // })   
     
            let costResource = Promise.resolve(apiResource.costResource)
     
            costResource.then(res=>{
                if(res.code == 200){
                    let platformGroup = []
                    for(let item of res.data.data){
                        platformGroup.push(item.data.HOST_COST_application || "孤立主机组")
                        item.data.code = item.code
                        state.hostCostResource.push(item.data)
                    }
                    
                    if(platformGroup.includes("孤立主机组")){
                        platformGroup.unshift("孤立主机组")
                    }
                    platformGroup = new Set(platformGroup)

                    for(let item of platformGroup){
                        let platformGroupHost = res.data.data.filter(item2 =>(item2.data.HOST_COST_application == item || item == "孤立主机组" && !("HOST_COST_application" in item2.data)))

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

                            let totalCostCount = itemHostCost + itemDiskCost + itembandwidthCost

                            if (!Number.isInteger(totalCostCount)) {
                                totalCostCount = totalCostCount.toFixed(2);
                            }

                            hitem.data.totalCostCount = Number(totalCostCount)
                        }

                        state.platformGroupResource.push({
                            name: item,
                            host: platformGroupHost,
                            hostCost: hostCostCount,
                            diskCost: diskCostCount,
                            bandwidthCost: bandwidthCostCount,
                            cloudResourceId: item == "孤立主机组" ? "" : platformGroupHost[0].data.HOST_COST_parent_inst,
                            currencyClass: platformGroupHost[0].data.HOST_COST_currency_class || "1"
                        })
                    }
                }    
            })    

        },
        FLUSH: (state)=>{
            state.platformGroupResource = []
            state.hostCostResource = []
        },
        COUNTADD: (state)=>{
            state.count ++
        }
        
    },

    state: {
        applicationResource: [],
        applicationGroupResource: [],
        publicCloudResource: [],
        cloudRegionResource: [],
        cloudAzResource: [],
        platformGroupResource: [],
        hostCostResource: [],
        count: 0,
    }
}

export default productLineCost