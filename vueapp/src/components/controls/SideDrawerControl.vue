<script setup>

	import { useElementSize, useLocalStorage } from '@vueuse/core'
	import LineHandle from './LineHandle.vue'

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 				{ type: String,  required: true },
		hideToggleButton:	{ type: Boolean, default: false },
		flipSide:			{ type: Boolean, default: false },
		resizable:				{ type: Boolean, default: false },
		initialWidth:		{ type: Number,  default: 300 },
		minWidth:			{ type: Number,  default: 48 },
		breakPoint:			{ type: Number,  default: 512 },
		breakPointAutoOpen:	{ type: Boolean, default: false },
	});

	const containerRef 				= ref(null)
	const drawerRef					= ref(null)
	const { width: containerWidth } = useElementSize(containerRef)
	const breakPoint 				= computed(() => props.breakPoint)
	const drawerWidth				= useLocalStorage(`${props.id}.drawerWidth`, props.initialWidth)
	const resizing					= ref(false)
	let startingWidth = 0

	const startResize = () =>
	{
		startingWidth  = drawerRef.value.getBoundingClientRect().width
		resizing.value = true
	}

	const moveResize = (delta) =>
	{
		const width 		= startingWidth + (props.flipSide ? -delta : delta)
		drawerWidth.value 	= Math.max(props.minWidth, Math.min(containerWidth.value - props.minWidth, width))
	}

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

	<div :class="['relative flex @container', props.flipSide ? 'flex-row-reverse' : '', resizing ? 'select-none' : '']" :id="props.id" ref="containerRef">

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

		<div ref="drawerRef" :class="['absolute top-0 h-full z-50 flex-none transform',
			resizing ? 'transition-none' : 'transition-all duration-300',
			'@lg:relative @lg:top-auto @lg:left-auto @lg:right-auto @lg:h-auto',
			props.flipSide ? 'right-0' : 'left-0',
			drawerHidden ? 'w-0' : (props.resizable && drawerWidth !== null ? 'w-full @lg:w-(--side-drawer-width)' : 'w-full @lg:w-75')]"
			:style="props.resizable && drawerWidth !== null ? { '--side-drawer-width': `min(${Math.max(props.minWidth, drawerWidth)}px, calc(100% - ${props.minWidth}px))` } : null">

			<LineHandle v-if="props.resizable && !drawerHidden" :key="props.flipSide"
				:delay="200"
				:class="['hidden @lg:block', props.flipSide ? '-left-1' : '-right-1']"
				@start="startResize" @move="moveResize" @end="resizing = false" />

			<div :class="['relative w-full h-full overflow-hidden @lg:border-0',
				!drawerHidden ? (props.flipSide ? 'border-r border-gray-400' : 'border-l border-gray-400') : '']">
				<div :class="['absolute w-full h-full min-w-75 @lg:relative @lg:min-w-1',
					props.resizable && !drawerHidden ? '@lg:w-full' : '@lg:w-75',
					props.flipSide ? 'left-0' : 'right-0']">
					<slot name="sidedrawer" />
				</div>
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
	Pass resizable to enable resizing in the side-by-side layout. Hover over the
	divider briefly before dragging. minWidth sets the resizing limit for each
	pane in pixels (default 48), when there is enough space.
	The width is stored under "<id>.drawerWidth"; use a unique, stable id.
	initialWidth sets the width in pixels when no saved width exists (default 300).

	<SideDrawerControl id="exampleDrawer" v-model:drawerHidden="hidden">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>

	Use the toggleButton slot to replace the default toggle. Its drawerHidden
	slot prop exposes the current state; update the parent model to change it:

	<SideDrawerControl id="customToggleDrawer" v-model:drawerHidden="hidden">
		<template #toggleButton="{ drawerHidden }">
			<button @click="hidden = !hidden">{{ drawerHidden ? 'Show' : 'Hide' }}</button>
		</template>
	</SideDrawerControl>

	Pass flipSide to put the drawer on the right instead of the left:

	<SideDrawerControl id="rightDrawer" v-model:drawerHidden="hidden" :flipSide="true">
		<template #sidedrawer>
			// Sidebar content here
		</template>
		// Main content here
	</SideDrawerControl>
-->
