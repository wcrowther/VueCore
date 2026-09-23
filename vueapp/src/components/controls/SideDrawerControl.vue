<script setup>

	import { useElementSize } from '@vueuse/core'

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 		{ type: String, default: '' },
		breakPoint:	{ type: Number, default: 501 },
		flipSide:	{ type: Boolean, default: false }
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

	<div :class="['flex @container', props.flipSide ? 'flex-row-reverse' : '']" :id="props.id" ref="containerRef">

		<div :class="['absolute h-full z-50 flex-none transform transition-all duration-[300ms] overflow-hidden @lg:relative',
			drawerHidden ? 'w-0' : 'w-full @lg:w-[300px]']">

			<div :class="['absolute w-full min-w-[300px] @lg:relative @lg:w-[300px] @lg:min-w-1', props.flipSide ? 'left-0' : 'right-0']">
				<slot name="sidedrawer" />
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

	<SideDrawerControl v-model:drawerHidden="hidden">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>

	Pass side="right" to put the drawer on the right instead of the left:

	<SideDrawerControl v-model:drawerHidden="hidden" :flipSide="true">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>
-->
