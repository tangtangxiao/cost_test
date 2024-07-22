<template>
    <div id="year-user" style="width: auto;height:8.2vw;"></div>
</template>

<script>
import {customMethod} from '../../mixin/mixin'
export default {
    name: "YearUser",
    props: ["yearUser"],
    mixins: [customMethod],
    watch:{
        yearUser: {
            deep: true,
            handler(val){
                if(val.year.length){
                    this.echartsLine("year-user","用户数",this.yearUser.year,this.yearUser.user,"#5A5476")
                }
            }
        }
    }
}
</script>

<style>

</style>