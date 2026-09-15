<script setup>

	const appStore                  		= useAppStore()
    const { sideBarHidden: appSidebarHidden } 	= storeToRefs(appStore)
    const { width: windowWidth }    		= useWindowSize()
	
	const props = defineProps(
	{
		id: 		   { type: String, default: '' },
		showGradation: { type: Boolean, default: true },
		breakPoint:    { type: Number, default: 501 },
		sideBarHidden: { type: Boolean, default: undefined }
	});

	const emit = defineEmits(['update:sideBarHidden'])

	// no v-model bound -> falls back to the shared appStore state
	const isLocal = computed(() => props.sideBarHidden !== undefined)

	const hidden = computed(
	{
		get: () => isLocal.value ? props.sideBarHidden : appSidebarHidden.value,
		set: (val) => isLocal.value ? emit('update:sideBarHidden', val) : (appSidebarHidden.value = val)
	})

	const breakPoint = computed(() => props.breakPoint)

    watch(() => windowWidth.value, (newVal, oldVal) => 
    { 
        if(newVal < breakPoint.value &&  oldVal >= breakPoint.value) 
            hidden.value = true
        else if (newVal >= breakPoint.value &&  oldVal < breakPoint.value)
            hidden.value = false
    });

</script>

<template>

	<div class="flex" :id="props.id">

		<div :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden xs:relative',
			hidden ? 'w-0' : 'w-full xs:w-[300px]']">

			<div class="absolute right-0 w-full min-w-[300px] xs:relative xs:w-[300px] xs:min-w-1">
				<slot name="sidebar" />
			</div>
		</div>
        
		<div class="relative w-2/3 sm:p-10 p-5 sm:pt-5 pt-5 pb-14 grow h-full min-h-[600px] overflow-hidden">

        	<BackGradation v-if="props.showGradation" />      
			  	
			<div class="relative z-10">
				<slot name="default" />
			</div>
			
    	</div> 

	</div>

</template>

<!-- Usage: 

	<SidebarControl>
		<template #sidebar>
			// Sidebar content here
		</template>
		// Main content here
	</SidebarControl>	

	Without v-model:sideBarHidden, the open/closed state comes from appStore.sideBarHidden (shared).
	Pass v-model:sideBarHidden to control the open/closed state locally instead:

	<SidebarControl v-model:sideBarHidden="hidden">
		...
	</SidebarControl>
-->