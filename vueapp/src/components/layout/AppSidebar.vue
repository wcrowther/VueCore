<script setup>

	import { useElementSize } from '@vueuse/core'

	const appStore                  = useAppStore()
    const { sideBarHidden } = storeToRefs(appStore)

	const props = defineProps(
	{
		id: 		   { type: String, default: '' },
		showGradation: { type: Boolean, default: true },
		breakPoint:    { type: Number, default: 501 }
	});

	// track the control's own container width instead of the window width, so collapsing
	// still works correctly when this control is nested in a narrower layout (e.g. a panel or modal)
	const containerRef = ref(null)
	const { width: containerWidth } = useElementSize(containerRef)

	const breakPoint = computed(() => props.breakPoint)

    watch(() => containerWidth.value, (newVal, oldVal) => 
    { 
        if(newVal < breakPoint.value &&  oldVal >= breakPoint.value) 
            sideBarHidden.value = true
        else if (newVal >= breakPoint.value &&  oldVal < breakPoint.value)
            sideBarHidden.value = false
    });

</script>

<template>

	<div class="flex" :id="props.id" ref="containerRef">

		<div :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden xs:relative',
			sideBarHidden ? 'w-0' : 'w-full xs:w-[300px]']">

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

	<AppSidebar>
		<template #sidebar>
			// Sidebar content here
		</template>
		// Main content here
	</AppSidebar>

	Open/closed state is shared via appStore.sideBarHidden.
-->