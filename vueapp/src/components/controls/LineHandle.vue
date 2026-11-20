<script setup>

	import { useEventListener } from '@vueuse/core'

	const props = defineProps(
	{
		width:	{ type: Number, default: 8 },
		delay:	{ type: Number, default: 0 },
		color:	{ type: String, default: 'bg-gray/20' },
	})

	const emit 		= defineEmits(['start', 'move', 'end'])
	const ready 	= ref(false)
	const dragging 	= ref(false)

	let hoverTimer
	let hovering 	= false
	let drag 	= null

	const startHover = () =>
	{
		hovering = true
		clearTimeout(hoverTimer)
		if (props.delay === 0)
			ready.value = true
		else
			hoverTimer = setTimeout(() => { ready.value = true }, props.delay)
	}

	const stopHover = () =>
	{
		hovering = false
		clearTimeout(hoverTimer)
		ready.value = false
	}

	const startDrag = (event) =>
	{
		if (!ready.value || event.pointerType !== 'mouse' || event.button !== 0 || drag) return

		event.preventDefault()
		event.currentTarget.setPointerCapture(event.pointerId)
		drag = { pointerId: event.pointerId, x: event.clientX, target: event.currentTarget }
		dragging.value = true
		emit('start')
	}

	const moveDrag = (event) =>
	{
		if (!drag || event.pointerId !== drag.pointerId) return
		if (!event.currentTarget.getClientRects().length)
		{
			stopHover()
			endDrag()
			return
		}
		emit('move', event.clientX - drag.x)
	}

	const endDrag = (event) =>
	{
		if (!drag || (event && event.pointerId !== drag.pointerId)) return

		const { pointerId, target } = drag
		drag = null
		if (target.hasPointerCapture(pointerId)) target.releasePointerCapture(pointerId)
		dragging.value = false
		emit('end')
		if (!hovering) ready.value = false
	}

	useEventListener(window, 'blur', () =>
	{
		stopHover()
		endDrag()
	})

	onBeforeUnmount(() =>
	{
		clearTimeout(hoverTimer)
		endDrag()
	})

</script>

<template>
	<div :class="['absolute top-0 z-100 h-full',
		ready || dragging ? ['cursor-col-resize', props.color] : '']"
		:style="{ width: `${props.width}px` }"
		aria-hidden="true" @mouseenter="startHover" @mouseleave="stopHover"
		@pointerdown="startDrag" @pointermove="moveDrag" @pointerup="endDrag"
		@pointercancel="endDrag" @lostpointercapture="endDrag" />
</template>

<!--
	width is in pixels (default 8); delay is in milliseconds (default 0).
	color is a Tailwind background class (default bg-gray/20). Ensure custom
	classes are present in scanned source so Tailwind generates them.
-->
