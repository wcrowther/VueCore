<script setup>

    const appStore   			= useAppStore()
    const { showBreakpoints }	= storeToRefs(appStore)
    const { width: winWidth }   = useWindowSize()
    
    const showWinWidth = ref(false)

</script>

<template>
    <Teleport to="#modals" v-if="showBreakpoints" >
        <div class="fixed left-4 bottom-4" @click="showWinWidth=!showWinWidth">
            <div class="capsule hidden xxs:block xs:hidden"  
                title="436px+">
                xxs <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden xs:block sm:hidden"  
                title="480px+" >
                xs <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden sm:block md:hidden"  
                title="640px+" >
                sm <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden md:block lg:hidden"  
                title="800px+" >
                md <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden lg:block xl:hidden"  
                title="1024px+">
                lg <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden xl:block 2xl:hidden" 
                title="1280px+">
                xl <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
            <div class="capsule hidden 2xl:block 3xl:hidden"           
                title="1536px+">
                2xl <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>            
            <div class="capsule hidden 3xl:block"           
                title="1920px+">
                3xl <span v-if="showWinWidth">&nbsp;{{ winWidth }}px</span>
            </div>
        </div>
    </Teleport>
</template>

<style lang="postcss" scoped>
    .capsule {
        @apply px-2 pt-[3px] pb-[2px] bg-[#f8ac59] text-red rounded-full text-center text-xs font-bold select-none 
    }
    .capsule span { @apply text-color-dark-gray }
</style>
