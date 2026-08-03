<script setup>

    const appStore     		= useAppStore()
    const { pagerDebugger }	= storeToRefs(appStore)

    const pager = computed(() => props.pager)

    const props = defineProps(
    {
        pager: PagerModel,
        id: String 
    })

    watchEffect( () => { props.pager.createPages(); })

</script>

<template>
    <!-- Position should be set on the component. Need to keep span end character spacing -->
    <div :id="id" class="select-none text-sm">
         <table>
             <tr v-if="pager.hasMultiplePages">
                <td colspan="3" class="noselect">

                    <a class="pagerPage" href="#" v-show="pager.hasPreviousGroup()" 
                        @click="pager.goToPreviousGroup()">&lt;</a>

                    <span v-show="pager.hasRecords()" class="pageBar">|</span>
                    <span v-for="page in pager.pages" :key="page.CurrentRecord" 
                    ><a class="pagerPage" v-show="!page.Selected" @click="pager.goToRecord(page.Record)" 
                        :title="page.Record">{{page.Display}}</a
                    ><span class="activePage" v-show="page.Selected">{{page.Display}}</span
                    ><span class="pageBar">|</span>
                    </span>

                    <a class="pagerPage" v-show="pager.hasNextGroup()" 
                        @click="pager.goToNextGroup()">&gt;</a>
                </td>
             </tr>
         </table>

        <ListPagerDebugger :pager="pager" v-model:show="pagerDebugger" />
     </div>
</template>

<style lang="postcss"  scoped>

    .pagerPage{
        @apply text-slate-400 hover:text-color-red font-bold 
    }
    .activePage{
        @apply font-bold text-indigo-700
    }
    .pageBar{
        @apply m-1 font-bold text-slate-400
    }

</style>


    

<!--
    Draggable :initial-value="{ x: 800, y: 100 }" storage-key="vueuse-draggable" 
    storage-type="session" class="select-none z-100 fixed"> </Draggable> 
-->