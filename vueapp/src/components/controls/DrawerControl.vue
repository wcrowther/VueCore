<script setup>

	import { useElementSize } from '@vueuse/core'

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 		{ type: String, default: '' },
		breakPoint:	{ type: Number, default: 501 }
	});

	// track the control's own container width instead of the window width, so collapsing
	// works correctly when this control is nested in a narrower layout (e.g. a panel or modal)
	const containerRef = ref(null)
	const { width: containerWidth } = useElementSize(containerRef)

	const breakPoint = computed(() => props.breakPoint)

    watch(() => containerWidth.value, (newVal, oldVal) => 
    { 
        if (oldVal === 0) return // ignore the initial 0 -> measured-width jump from useElementSize

        if(newVal < breakPoint.value &&  oldVal >= breakPoint.value) 
            drawerHidden.value = true
        else if (newVal >= breakPoint.value &&  oldVal < breakPoint.value)
            drawerHidden.value = false
    });

</script>

<template>

	<div class="flex @container" :id="props.id" ref="containerRef">

		<div :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden @lg:relative',
			drawerHidden ? 'w-0' : 'w-full @lg:w-[300px]']">

			<div class="absolute right-0 w-full min-w-[300px] @lg:relative @lg:w-[300px] @lg:min-w-1">
				<slot name="sidebar" />
			</div>
		</div>
        
		<div class="relative w-2/3 grow h-full overflow-hidden">
	
			<div class="relative z-10">
				<slot name="default" />
			</div>
			
    	</div> 

	</div>

</template>

<!-- Usage: 

	<DrawerControl v-model:drawerHidden="hidden">
		<template #sidebar>
			// Sidebar content here
		</template>
		// Main content here
	</DrawerControl>
-->