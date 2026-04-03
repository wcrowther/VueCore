<script setup>

    const appStore  = useAppStore()
    const pager     = computed(() => props.pager); 

    const props = defineProps({
        pager: { type: PagerModel, required: true },
    })

</script>

<template>

    <Teleport to="#modals" v-if="appStore.showPrevNext">

        <!-- Right PREV / NEXT Button for Mobile--> 

        <div class="fixed xs:hidden rounded-full bg-[#b8d7ed] size-7 z-[80]  
            opacity-80 top-4 right-4 flex justify-center items-center" 
            id="listPagerMobilePrev" @click="pager.goToPrevious()">
            <IconSymbol class="select-none relative" width="16px" 
                :vertical-flip="true" :vFlip="true" color="#3e5091" icon="mdi:arrow-down-thick" />
        </div>
        <div class="fixed xs:hidden rounded-full bg-[#b8d7ed] size-7 z-[80]    
            opacity-80 bottom-4 right-4 flex justify-center items-center"
            id="listPagerMobileNext" @click="pager.goToNext()">
            <IconSymbol class="select-none relative" 
                width="16px" color="#3e5091" icon="mdi:arrow-down-thick" />
        </div>

    </Teleport> 

</template>

<style lang="postcss"  scoped></style>


    

