<template>
    <div id="year-org" style="width: auto;height:8.2vw;"></div>
</template>

<script>
import {customMethod} from '../../mixin/mixin'
export default {
    name: "YearOrg",
    props: ["yearOrganization"],
    mixins: [customMethod],
    watch:{
        yearOrganization: {
            deep: true,
            handler(val){
                if(val.year.length){
                    this.echartsLine("year-org","机构数",this.yearOrganization.year,this.yearOrganization.organization,"#05524d")
                }
            }
        }
    }
}
</script>

<style>

</style>