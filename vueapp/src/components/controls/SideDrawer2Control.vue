<script setup>

	import { useElementSize, useEventListener } from '@vueuse/core'

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 				{ type: String, default: '' },
		hideToggleButton:	{ type: Boolean, default: false },
		flipSide:			{ type: Boolean, default: false },
		resize:				{ type: Boolean, default: false },
		breakPoint:			{ type: Number, default: 512 },
		breakPointAutoOpen:	{ type: Boolean, default: false },
	});

	const delayHover 				= 200
	const containerRef 				= ref(null)
	const drawerRef					= ref(null)
	const { width: containerWidth } = useElementSize(containerRef)
	const breakPoint 				= computed(() => props.breakPoint)
	const drawerWidth				= ref(null)
	const resizeReady				= ref(false)
	const resizing					= ref(false)
	let hoverTimer
	let hovering = false
	let drag = null

	function startHover()
	{
		hovering = true
		clearTimeout(hoverTimer)
		hoverTimer = setTimeout(() => { resizeReady.value = true }, delayHover)
	}

	function stopHover()
	{
		hovering = false
		clearTimeout(hoverTimer)
		resizeReady.value = false
	}

	function startResize(event)
	{
		if (!resizeReady.value || event.button !== 0 || event.pointerType !== 'mouse') return

		event.preventDefault()
		drag = { pointerId: event.pointerId, x: event.clientX, width: drawerRef.value.getBoundingClientRect().width }
		resizing.value = true
	}

	useEventListener(window, 'pointermove', (event) =>
	{
		if (!drag || event.pointerId !== drag.pointerId) return

		const delta = (event.clientX - drag.x) * (props.flipSide ? -1 : 1)
		drawerWidth.value = Math.max(48, Math.min(containerWidth.value - 48, drag.width + delta))
	})

	function stopResize(event)
	{
		if (!drag || (event && event.pointerId !== drag.pointerId)) return

		drag = null
		resizing.value = false
		resizeReady.value = false
		if (hovering) startHover()
	}

	useEventListener(window, 'pointerup', stopResize)
	useEventListener(window, 'pointercancel', stopResize)

	watch(() => [drawerHidden.value, props.resize, props.flipSide], () =>
	{
		stopHover()
		stopResize()
	})

	onUnmounted(() =>
	{
		clearTimeout(hoverTimer)
	})

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

	<div :class="['relative flex @container', props.flipSide ? 'flex-row-reverse' : '', resizing ? 'select-none' : '']" 
		:id="props.id" ref="containerRef">

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

		<div ref="drawerRef" :class="['absolute top-0 h-full z-50 flex-none transform overflow-hidden',
			resizing ? 'transition-none' : 'transition-all duration-300',
			'@lg:relative @lg:top-auto @lg:left-auto @lg:right-auto @lg:h-auto @lg:border-0',
			props.resize && !drawerHidden ? '@lg:overflow-visible' : '',
			props.flipSide ? 'right-0' : 'left-0',
			drawerHidden ? 'w-0' : (props.resize && drawerWidth !== null ? 'w-full @lg:w-(--side-drawer-width)' : 'w-full @lg:w-75'),
			!drawerHidden ? (props.flipSide ? 'border-r border-gray-400' : 'border-l border-gray-400') : '']"
			:style="props.resize && drawerWidth !== null ? { '--side-drawer-width': `min(${drawerWidth}px, calc(100% - 48px))` } : null">

			<div :class="['absolute w-full h-full min-w-75 @lg:relative @lg:min-w-1',
				props.resize && !drawerHidden ? '@lg:w-full @lg:overflow-hidden' : '@lg:w-75',
				props.flipSide ? 'left-0' : 'right-0']">
				<slot name="sidedrawer" />
			</div>

			<div v-if="props.resize && !drawerHidden"
				:class="['hidden @lg:block absolute top-0 z-60 h-full w-0.75',
					props.flipSide ? 'left-[-1.5px]' : 'right-[-1.5px]',
					resizeReady || resizing ? 'cursor-col-resize' : '']"
				aria-hidden="true" @mouseenter="startHover" @mouseleave="stopHover"
				@pointerdown="startResize" />
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
	Pass resize to allow mouse resizing in the side-by-side layout. Hover over the
	divider for one second before dragging. Both panes retain at least 48px.

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
