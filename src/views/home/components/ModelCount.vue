<template>
    <div id="model-count" style="width: auto;">
      <div>
        <a-menu v-model="menuValue" mode="horizontal" @click="menuChange">
          <a-menu-item key="total"> <a-icon type="control" />总设备统计 </a-menu-item>
          <a-menu-item key="online"> <a-icon type="project" />在线设备统计</a-menu-item>
        </a-menu>
      </div>
      <a-table style="margin-top: 20px" :columns="columns" :dataSource="dataSource" :pagination="false" rowKey="name">   
        <div
          slot="filterDropdown"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
          style="padding: 8px"
        >
          <a-input
            v-ant-ref="c => (searchInput = c)"
            placeholder="搜索机型"
            :value="selectedKeys[0]"
            style="width: 140px;margin-bottom: 8px; display: block;font-size:12px"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <a-button
            type="primary"
            icon="search"
            size="small"
            style="width: 66px; margin-right: 8px;font-size: 12px;"
            @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            搜索
          </a-button>
          <a-button size="small" icon="reload" style="width: 66px;font-size: 12px;" @click="() => handleReset(clearFilters)">重置</a-button>
        </div>
        <a-icon
          slot="filterIcon"
          slot-scope="filtered"
          type="search"
          :style="{ color: filtered ? '#108ee9' : undefined }"
        />
        <template slot="customRender" slot-scope="text, record, index, column">
          <span v-if="searchText && searchedColumn === column.dataIndex">
            <template
              v-for="(fragment, i) in text
                .toString()
                .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
            >
              <mark
                v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                :key="i"
                class="highlight"
                >{{ fragment }}</mark
              >
              <template v-else>{{ fragment }}</template>
            </template>
          </span>
          <template v-else>{{ text }}</template>
        </template>
        <span slot="percent" slot-scope="record">
          <a-tag v-if="record.maxNumberGroup" @click="toPlatform" class="pl-tag">{{ getHostgroupName(record.maxNumberGroup) }}</a-tag>
          <a-tag v-else-if="!record.maxNumberGroup && menuValue == 'online'">未上线平台</a-tag>
          <a-tag color="blue" v-else-if="!record.maxNumberGroup && menuValue == 'total'">未接入平台</a-tag>
        </span>
        <template v-for="(item,index) in year" :slot="item+'rate'" slot-scope="record">
          <!-- <span :key="index">{{ computeRate(record[year[index-1]],record[item]) }}</span> -->
          <div class="percent-total" v-bind:key="index">
              <div class="percent-free" :style="{width: computeRate(record[year[index-1]],record[item]) < 100 ? 100-computeRate(record[year[index-1]],record[item])+'%' : '0%'}"></div>
              <div class="percent-text">
                <span>{{computeRate(record[year[index-1]],record[item])+'%'}}</span>
              </div>
          </div>      
        </template>
      </a-table>
    </div>
</template>

<script>


export default {
    name: "ModelCount",
    props: ["deviceCountData","hostGroup"],
    data(){
        return {
          year: [],
          models: new Set(),
          columns: [
            {
              title: '机型',
              dataIndex: 'name',
              key: 'name',
              width: "10%",
              scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender',
              },
              onFilter: (value, record) =>
                record.name
                  .toString()
                  .toLowerCase()
                  .includes(value.toLowerCase()),
              onFilterDropdownVisibleChange: visible => {
                if (visible) {
                  setTimeout(() => {
                    this.searchInput.focus();
                  }, 0);
                }
              },
            },
            {
              title: '接入量最大平台',
              key: 'percent',
              align: 'center',
              scopedSlots: { customRender: 'percent' },
            }, 
          ],
          menuValue: ["total"],
          modelDeviceCount: {online: [],total: []},
          dataSource: [],
          searchText: '',
          searchInput: null,
          searchedColumn: '',
        }
    },
    mounted(){
      this.dataSource = this.modelDeviceCount.total
    },
    methods: {
      menuChange(e){
        this.dataSource = this.modelDeviceCount[e.key]
      },
      getModelData(){
        for(let item of this.deviceCountData[0].lastvalue){
          this.year.push(item.year)
        }

        if(this.columns.length == 2){
          let annualRate = []
          for(let key in this.year){
            this.columns.push({title: this.year[key]+"年",key: this.year[key],dataIndex: this.year[key],sorter: (a,b)=> a[this.year[key]] - b[this.year[key]]})
            if(key > 0){
              annualRate.push({title: this.year[key]+"年增长率",key: this.year[key]+"rate",scopedSlots: { customRender: this.year[key]+"rate" },width: "10%"})
            }
          }
          this.columns.push(...annualRate)
        }

        for(let item of this.deviceCountData){
          for(let key in this.year){
            for(let item2 of item.lastvalue[key].models){
              this.models.add(item2._id)
            }
          }
        }
      
        for(let model of this.models){
          let modelItemTotal = {name: model}
          let modelItemOnline = {name: model}

          let modelDeviceMaxTotal = 0
          let modelDeviceMaxOnline = 0
          let MaxTotalHostid = ""
          let MaxOnlineHostid = ""

          for(let year of this.year){  
            let modelDeviceCountTotal = 0
            let modelDeviceCountOnline = 0

            for(let pf of this.deviceCountData){
              let yearCount = pf.lastvalue.find(py => py.year == year)
              if(yearCount){
                let modelCount = yearCount.models.find(pm => pm._id == model) 
                if(modelCount){
                  modelDeviceCountTotal += modelCount.total
                  modelDeviceCountOnline += modelCount.online
                } 
              }

              let currentYearCount = pf.lastvalue.find(py => py.year == this.year.slice(-1)[0])
              if(currentYearCount){
                let modelMax = currentYearCount.models.find(pm => pm._id == model)
                if(modelMax){
                  if(modelMax.total > modelDeviceMaxTotal){
                    modelDeviceMaxTotal = modelMax.total
                    MaxTotalHostid = pf.hostid
                  }
                  if(modelMax.online > modelDeviceMaxOnline){
                    modelDeviceMaxOnline = modelMax.online
                    MaxOnlineHostid = pf.hostid
                  }
                }
              }              
            }

            Object.defineProperty(modelItemTotal,year,{
              value: modelDeviceCountTotal,
              enumerable: true,
            })
            Object.defineProperty(modelItemOnline,year,{
              value: modelDeviceCountOnline,
              enumerable: true,
            })
          }

          modelItemTotal.maxNumberGroup = MaxTotalHostid
          modelItemOnline.maxNumberGroup = MaxOnlineHostid

          this.modelDeviceCount.total.push(modelItemTotal)
          this.modelDeviceCount.online.push(modelItemOnline)         
        }
        //数据排序
        this.modelDeviceCount.total.sort((a,b)=>{
          return a.name.localeCompare(b.name)
        })
        this.modelDeviceCount.online.sort((a,b)=>{
          return a.name.localeCompare(b.name)
        })
      },
      toPlatform(e){
        this.$router.push({
          path: '/datashow/platform',
          query: { pf: e.target.textContent }
        })
      },     
      handleSearch(selectedKeys, confirm, dataIndex) {
        confirm();
        this.searchText = selectedKeys[0];
        this.searchedColumn = dataIndex;
      },
      handleReset(clearFilters) {
        clearFilters();
        this.searchText = '';
      },
    },
    watch:{
        deviceCountData: {
          deep: true,
          handler(val){
            this.getModelData()
          }
        }
    },
    computed:{
      getHostgroupName(){
          return function(hostid){
              let hostgroupItem = this.hostGroup.find(item => item.hostids.includes(hostid))
              if(hostgroupItem){
                return hostgroupItem.name
              }
          }
      },
      computeRate(){
        return function(a,b){
          if(a ==0 && b != 0){
            return 100
          }else if(a == 0 && b == 0){
            return 0
          }else{
            if(a==b ||(b-a) == a){
              return ((b-a)*100/a).toFixed(0)
            }else{
              return ((b-a)*100/a).toFixed(2)
            }           
          }
        }
      }
    }
}
</script>

<style lang="less" scoped>
    ::v-deep .ant-table .ant-table-thead > tr > th{
        background-color: rgba(0,0,0,0.03);
    }
    ::v-deep .ant-table-tbody > tr > td,::v-deep .ant-table-thead > tr > th {
        padding: 9px;
    }
    .pl-tag{
      cursor: pointer;
      background-color: @primary-color;
      color: white;
    }
</style>