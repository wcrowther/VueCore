<script setup>

	import { useElementSize } from '@vueuse/core'

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 				{ type: String, default: '' },
		hideToggleButton:	{ type: Boolean, default: false },
		flipSide:			{ type: Boolean, default: false },
		breakPoint:			{ type: Number, default: 512 },
		breakPointAutoOpen:	{ type: Boolean, default: false },
	});

	const containerRef 				= ref(null)
	const { width: containerWidth } = useElementSize(containerRef)
	const breakPoint 				= computed(() => props.breakPoint)

    watch(() => containerWidth.value, (newVal, oldVal) => 
    { 
        if (oldVal === 0) return // ignore the initial 0 -> measured-width jump from useElementSize

        if(newVal < breakPoint.value &&  oldVal >= breakPoint.value) 
            drawerHidden.value = true
        else if (props.breakPointAutoOpen && newVal >= breakPoint.value &&  oldVal < breakPoint.value)
            drawerHidden.value = false
    });

</script>

<template>

	<div :class="['relative flex @container', props.flipSide ? 'flex-row-reverse' : '']" :id="props.id" ref="containerRef">

		<div v-if="!props.hideToggleButton" 
			:class="['absolute top-1 z-60', props.flipSide ? 'right-1' : 'left-1']">
			<slot name="toggleButton" :drawerHidden="drawerHidden">
				<CircleButton v-model="drawerHidden" 
					size="12px" padding="p-[2px]" bgColor="bg-white" 
					:icon="props.flipSide ? 'heroicons:chevron-right' : 'heroicons:chevron-left'"
					role="button" tabindex="0" :aria-expanded="!drawerHidden"
					:aria-label="drawerHidden ? 'Show side drawer' : 'Hide side drawer'" />
			</slot>
		</div>

		<div :class="['absolute top-0 h-full z-50 flex-none transform transition-all duration-300 overflow-hidden',
			'@lg:relative @lg:top-auto @lg:left-auto @lg:right-auto @lg:h-auto @lg:border-0',
			props.flipSide ? 'right-0' : 'left-0',
			drawerHidden ? 'w-0' : 'w-full @lg:w-75',
			!drawerHidden ? (props.flipSide ? 'border-r border-gray-400' : 'border-l border-gray-400') : '']">

			<div :class="['absolute w-full h-full min-w-75 @lg:relative @lg:w-75 @lg:min-w-1', props.flipSide ? 'left-0' : 'right-0']">
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

	The drawer closes when its container shrinks below breakPoint (default 512px).
	Set breakPointAutoOpen to also open it when the container grows back across it.
	The initial drawerHidden value is preserved.

	<SideDrawerControl v-model:drawerHidden="hidden">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>

	Use the toggleButton slot to replace the default toggle. Its drawerHidden
	slot prop exposes the current state; update the parent model to change it:

	<SideDrawerControl v-model:drawerHidden="hidden">
		<template #toggleButton="{ drawerHidden }">
			<button @click="hidden = !hidden">{{ drawerHidden ? 'Show' : 'Hide' }}</button>
		</template>
	</SideDrawerControl>

	Pass flipSide to put the drawer on the right instead of the left:

	<SideDrawerControl v-model:drawerHidden="hidden" :flipSide="true">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>
-->
