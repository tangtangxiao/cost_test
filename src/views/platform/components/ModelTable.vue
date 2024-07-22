<template>
    <div style="width: auto;height:18vw;overflow:auto;" class="model-table">
            <a-table :columns="columns" :data-source="modelValues" :pagination="false"  rowKey="name" :row-style="{height:'90px'}" :cell-style="{padding:'0px'}">
                  <span slot="percent" slot-scope="record">{{ (record.value*100/record.total).toFixed(2)+"%" }}</span>
            </a-table>
    </div>
</template>

<script>
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: '机型',
  },
  {
    title: '在线设备数',
    dataIndex: 'value',
    key: 'value',
    sorter: (a, b) => b.value - a.value,
  },
  {
    title: '总设备数',
    dataIndex: 'total',
    key: 'total',
    sorter: (a, b) => b.total - a.total,
  },
    {
    title: '在线率',
    key: 'percent',
    scopedSlots: { customRender: 'percent' },
  }
];

export default {
    name: "ModelTable",
    props: ["modelValues"],
    data(){
        return {
            columns,
        }
    },
    methods: {
      
    },
}
</script>

<style scoped>

</style>