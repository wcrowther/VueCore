<script setup>

	const appStore                  = useAppStore()
    const { sideBarHidden }         = storeToRefs(appStore)
    const { width: windowWidth }    = useWindowSize()
	const breakPoint 				= 501

	const props = defineProps(
	{
		sideBarId: 	{ type: String, default: '' }, 
	});

    watch(() => windowWidth.value, (newVal, oldVal) => 
    { 
        if(newVal < breakPoint &&  oldVal >= breakPoint) 
            sideBarHidden.value = true
        else if (newVal >= breakPoint &&  oldVal < breakPoint)
            sideBarHidden.value = false
    });

</script>

<template>

	<div class="flex" :id="props.sideBarId">

		<div :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden xs:relative ',
			sideBarHidden ? 'w-0' : 'w-full xs:w-[300px]']">

			<div class="absolute right-0 w-full min-w-[300px] xs:relative xs:w-[300px] xs:min-w-1">
				<slot name="sidebar" />
			</div>
		</div>
        
		<div class="w-2/3 sm:p-10 p-5 sm:pt-5 pt-5 pb-14 grow h-full min-h-[600px]">
        	<slot name="default" />
    	</div> 

	</div>

</template>

<!-- Usage: 

	<SidebarControl :showSideBar="true">
		<template #sidebar>
			// Sidebar content here
		</template>
		// Main content here
	</SidebarControl>	
-->