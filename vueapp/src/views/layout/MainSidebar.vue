
<script setup>

    const appStore                  = useAppStore()
    const { sideBarHidden }         = storeToRefs(appStore)
    const { width: windowWidth }    = useWindowSize()

    const breakPoint = 501

    watch(() => windowWidth.value, (newVal, oldVal) => 
    { 
        if(newVal < breakPoint &&  oldVal >= breakPoint) 
            sideBarHidden.value = true
        else if (newVal >= breakPoint &&  oldVal < breakPoint)
            sideBarHidden.value = false
    });


</script>

<template>

    <div id="MainSideBar"
        :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden xs:relative ',
        sideBarHidden ? 'w-0' : 'w-full xs:w-[300px]']">

        <div class="absolute right-0 w-full min-w-[300px] xs:relative xs:w-[300px] xs:min-w-1">
            <slot></slot>
        </div> 
    </div>

</template>

<!-- 
    <div class="bg-red h-screen">FAKE CONTENT</div> 
-->
