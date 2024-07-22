<template>
    <div id="user-count" style="width: auto">
      <a-table :columns="columns" :dataSource="dataSource" :pagination="false" rowKey="hostid" :scroll="{ x: 1680 }">
        <span slot="hostgroup" slot-scope="record">
          <a-tag v-if="record != 'total'"  @click="toPlatform" class="pl-tag">{{ getHostgroupName(record) }}</a-tag>
          <a-tag v-else>总 计</a-tag>
        </span>
        <template v-for="(item,index) in year" :slot="'orgRate_'+item" slot-scope="record">
          <div class="percent-total" v-bind:key="index">
              <div class="percent-free" :style="{width: computeRate(record['org_'+[year[index-1]]],record['org_'+item]) < 100 ? (100-computeRate(record['org_'+[year[index-1]]],record['org_'+item]))+'%' : '0%'}"></div>
              <div class="percent-text">
                <span>{{computeRate(record['org_'+[year[index-1]]],record['org_'+item])+'%'}}</span>
              </div>
          </div>
        </template>
        <template v-for="(item,index) in year" :slot="'userRate_'+item" slot-scope="record">
          <!-- <span :key="index">{{ computeRate(record['user_'+[year[index-1]]],record['user_'+item]) }}</span>       -->
          <div class="percent-total" v-bind:key="index">
              <div class="percent-free" :style="{width: computeRate(record['user_'+[year[index-1]]],record['user_'+item]) < 100 ? 100-computeRate(record['user_'+[year[index-1]]],record['user_'+item])+'%' : '0%'}"></div>
              <div class="percent-text">
                <span>{{computeRate(record['user_'+[year[index-1]]],record['user_'+item])+'%'}}</span>
              </div>
          </div>
        </template>
      </a-table>
    </div>
</template>

<script>
export default {
    name: "OrgUserCount",
    props: ["userCountData","orgCountData","hostGroup"],
    data(){
        return {
          year: [],
          columns: [],
          dataSource: [],

        }
    },
    mounted(){
    },
    methods: {
      getUserData(){
        this.columns.push({title: '平台',dataIndex: 'hostid',key: 'hostid',width: '160px',fixed: 'left',align: 'center',scopedSlots: { customRender: 'hostgroup' },})
        for(let item of this.orgCountData[0].lastvalue){
          this.year.push(item.year)
          this.columns.push({
            title: item.year+"年",
            children: [
              {
                title: '机构数',
                dataIndex: 'org_'+item.year,
                key: 'org_'+item.year, 
                sorter: (a,b)=> a['org_'+item.year] - b['org_'+item.year]   
              },
              {
                title: '用户数',
                dataIndex: 'user_'+item.year,
                key: 'user_'+item.year, 
                sorter: (a,b)=> a['user_'+item.year] - b['user_'+item.year]      
              },
              ...(item != this.orgCountData[0].lastvalue[0] ? [
                {
                  title: '机构增长率',
                  key: 'orgRate_'+item.year, 
                  scopedSlots: { customRender: 'orgRate_'+item.year }      
                },
                {
                  title: '用户增长率',
                  key: 'userRate_'+item.year,  
                  scopedSlots: { customRender: 'userRate_'+item.year }      
                }
              ] : []) 
            ]         
          })            
        }

        for(let item of this.orgCountData){
          let count = {hostid: item.hostid}
          for(let index in this.year){
            count['org_'+this.year[index]] = item.lastvalue[index].total

            let userItem = this.userCountData.find((user) => user.hostid == item.hostid)
            if(userItem){
              count['user_'+this.year[index]] = userItem.lastvalue[index].total
            }
          }
          this.dataSource.push(count)
        }

        let countTotal = {hostid: "total"}
        for(let index in this.year){
          let countOrg = 0
          let countUser = 0
          for(let item of this.orgCountData){
            countOrg += item.lastvalue[index].total
          }
          for(let item of this.userCountData){
            countUser += item.lastvalue[index].total
          }
          countTotal['user_'+this.year[index]] = countUser
          countTotal['org_'+this.year[index]] = countOrg
        }

        this.dataSource.push(countTotal)
       
      },
      toPlatform(e){
        this.$router.push({
          path: '/datashow/platform',
          query: { pf: e.target.textContent }
        })
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
    },
    watch:{
        userCountData: {
          deep: true,
          handler(val){
            this.getUserData()
          }
        }
    }
}
</script>

<style lang="less" scoped>
    ::v-deep .ant-table .ant-table-thead > tr > th{
        background-color: rgba(0,0,0,0.03);
        border: 1px solid #e8e8e8;
    }
    ::v-deep .ant-table-tbody > tr > td,::v-deep .ant-table-thead > tr > th {
        padding: 9px;
    }
    ::v-deep .ant-table-tbody tr:last-child{
      font-weight: bold;
    }

    .pl-tag{
      cursor: pointer;
      background-color: @primary-color;
      color: white;
    }

</style>