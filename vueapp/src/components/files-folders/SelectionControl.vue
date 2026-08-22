<script setup>

	const props = defineProps(
	{
		aspectRatio:       { type: Number, default: 0 },
		canvasWidth:       { type: Number, required: true },
		canvasHeight:      { type: Number, required: true },
		displayBounds:     { type: Object, default: () => ({ x: 0, y: 0, width: 0, height: 0 }) },
		active:            { type: Boolean, default: true },
		snapSize:          { type: Number, default: 0 },
		constrainToBounds: { type: Boolean, default: false }
	})

	const emit = defineEmits(['change', 'end'])

	const isDragging 		= ref(false)
	const dragMode 			= ref(null)
	const startX 			= ref(0)
	const startY 			= ref(0)
	const startCrop 		= ref(null)
	const minCropSize 		= 50
	const initialCropX 		= 50
	const initialCropY 		= 50
	const initialCropWidth 	= 200
	const handleList =
	[
		{ mode: 'nw', class: 'absolute top-[-7px] left-[-7px] size-3 bg-white border border-[#111111] cursor-nwse-resize' },
		{ mode: 'n',  class: 'absolute top-[-6px] left-1/2 size-[10px] -translate-x-1/2 bg-white border border-[#111111] cursor-ns-resize' },
		{ mode: 'ne', class: 'absolute top-[-7px] right-[-7px] size-3 bg-white border border-[#111111] cursor-nesw-resize' },
		{ mode: 'e',  class: 'absolute top-1/2 right-[-6px] size-[10px] -translate-y-1/2 bg-white border border-[#111111] cursor-ew-resize' },
		{ mode: 'se', class: 'absolute bottom-[-7px] right-[-7px] size-3 bg-white border border-[#111111] cursor-nwse-resize' },
		{ mode: 's',  class: 'absolute bottom-[-6px] left-1/2 size-[10px] -translate-x-1/2 bg-white border border-[#111111] cursor-ns-resize' },
		{ mode: 'sw', class: 'absolute bottom-[-7px] left-[-7px] size-3 bg-white border border-[#111111] cursor-nesw-resize' },
		{ mode: 'w',  class: 'absolute top-1/2 left-[-6px] size-[10px] -translate-y-1/2 bg-white border border-[#111111] cursor-ew-resize' }
	]

	const getInitialCrop = () =>
	({
		x: initialCropX,
		y: initialCropY,
		width: initialCropWidth,
		height: initialCropWidth / (props.aspectRatio > 0 ? props.aspectRatio : 1)
	})

	const crop = ref(getInitialCrop())

	const cropStyle = computed(() =>
	({
		left:   `${crop.value.x}px`,
		top:    `${crop.value.y}px`,
		width:  `${crop.value.width}px`,
		height: `${crop.value.height}px`
	}))

	const snap = (value) => props.snapSize > 0 ? Math.round(value / props.snapSize) * props.snapSize : value

	const constrainCrop = (nextCrop, mode = 'move') =>
	{
		const c    = { ...nextCrop }
		const maxX = props.constrainToBounds
			? props.displayBounds.x + props.displayBounds.width
			: props.canvasWidth
		const maxY = props.constrainToBounds
			? props.displayBounds.y + props.displayBounds.height
			: props.canvasHeight

		if (c.width < minCropSize)
		{
			const diff = minCropSize - c.width
			c.width = minCropSize
			if (mode.includes('w')) c.x -= diff
		}

		if (c.height < minCropSize)
		{
			const diff = minCropSize - c.height
			c.height = minCropSize
			if (mode.includes('n')) c.y -= diff
		}

		if (c.x < 0)
		{
			if (mode.includes('w')) c.width += c.x
			c.x = 0
		}

		if (c.y < 0)
		{
			if (mode.includes('n')) c.height += c.y
			c.y = 0
		}

		if (c.x + c.width > maxX)
		{
			const overflowX = c.x + c.width - maxX
			if (mode.includes('e')) c.width -= overflowX
			else c.x -= overflowX
		}

		if (c.y + c.height > maxY)
		{
			const overflowY = c.y + c.height - maxY
			if (mode.includes('s')) c.height -= overflowY
			else c.y -= overflowY
		}

		if (c.width < minCropSize)
		{
			const diff = minCropSize - c.width
			c.width = minCropSize
			if (mode.includes('w')) c.x -= diff
		}

		if (c.height < minCropSize)
		{
			const diff = minCropSize - c.height
			c.height = minCropSize
			if (mode.includes('n')) c.y -= diff
		}

		if (c.x < 0) c.x = 0
		if (c.y < 0) c.y = 0
		if (c.x + c.width > maxX)  c.x = maxX - c.width
		if (c.y + c.height > maxY) c.y = maxY - c.height

		if (props.snapSize > 0)
		{
			c.x      = snap(c.x)
			c.y      = snap(c.y)
			c.width  = Math.max(props.snapSize, snap(c.width))
			c.height = Math.max(props.snapSize, snap(c.height))
		}

		return c
	}

	const applyCrop = (nextCrop, mode = 'move') =>
	{
		crop.value = constrainCrop(nextCrop, mode)
		emit('change', { ...crop.value })
		if (!isDragging.value) emit('end', { ...crop.value })
	}

	const moveCropTo = (x, y) =>
	{
		applyCrop({ x, y, width: crop.value.width, height: crop.value.height }, 'move')
	}

	const nudgeCrop = (dx, dy) =>
	{
		moveCropTo(crop.value.x + dx, crop.value.y + dy)
	}

	const startDrag = (event, mode = 'move') =>
	{
		isDragging.value 	= true
		dragMode.value 		= mode
		startX.value 		= event.clientX
		startY.value 		= event.clientY
		startCrop.value 	= { ...crop.value }

		window.addEventListener('mousemove', onDrag)
		window.addEventListener('mouseup', stopDrag)
	}

	const onDrag = (event) =>
	{
		if (!isDragging.value) return

		const dx 	= event.clientX - startX.value
		const dy 	= event.clientY - startY.value
		const base 	= startCrop.value

		if (!base) return

		let nextCrop = { ...base }

		if (dragMode.value === 'move')
		{
			nextCrop.x = base.x + dx
			nextCrop.y = base.y + dy
		}
		else if (dragMode.value === 'moveInverse')
		{
			nextCrop.x = base.x - dx
			nextCrop.y = base.y - dy
		}
		else if (dragMode.value.length === 2)
		{
			const aspect 		= props.aspectRatio > 0 ? props.aspectRatio : 1
			const widthFromX 	= dragMode.value.includes('e') ? base.width + dx : base.width - dx
			const heightFromY 	= dragMode.value.includes('s') ? base.height + dy : base.height - dy
			const widthFromY 	= heightFromY * aspect
			const widthDeltaFromX = Math.abs(widthFromX - base.width)
			const widthDeltaFromY = Math.abs(widthFromY - base.width)
			const nextWidth 	= widthDeltaFromX >= widthDeltaFromY ? widthFromX : widthFromY
			const nextHeight 	= nextWidth / aspect
			const right 		= base.x + base.width
			const bottom 		= base.y + base.height

			nextCrop.width  = nextWidth
			nextCrop.height = nextHeight
			nextCrop.x 		= dragMode.value.includes('w') ? right - nextWidth : base.x
			nextCrop.y 		= dragMode.value.includes('n') ? bottom - nextHeight : base.y
		}
		else
		{
			if (dragMode.value.includes('e')) nextCrop.width  = base.width + dx
			if (dragMode.value.includes('s')) nextCrop.height = base.height + dy
			if (dragMode.value.includes('w'))
			{
				nextCrop.x     = base.x + dx
				nextCrop.width = base.width - dx
			}
			if (dragMode.value.includes('n'))
			{
				nextCrop.y      = base.y + dy
				nextCrop.height = base.height - dy
			}
		}

		applyCrop(nextCrop, dragMode.value)
	}

	const stopDrag = () =>
	{
		isDragging.value 	= false
		startCrop.value 	= null

		window.removeEventListener('mousemove', onDrag)
		window.removeEventListener('mouseup', stopDrag)
		emit('end', { ...crop.value })
	}

	const getBounds = () =>
	{
		const b = props.displayBounds
		return {
			x: Math.max(b.x, b.x + b.width  - crop.value.width),
			y: Math.max(b.y, b.y + b.height - crop.value.height)
		}
	}

	const selectAll = () =>
	{
		const b = props.displayBounds
		applyCrop({ x: b.x, y: b.y, width: b.width, height: b.height }, 'move')
	}

	const reset = () =>
	{
		crop.value = getInitialCrop()
		emit('change', { ...crop.value })
		emit('end', { ...crop.value })
	}

	defineExpose({ crop, reset, startDrag })

	// Keyboard Listeners  ================================================

	const disableKeys = () => !props.active

	const getStep = (e) =>
	{
		const ctrl = e.ctrlOrMeta ?? e.ctrlKey
		if (props.snapSize > 0)
			return e.shiftKey ? props.snapSize * 5 : (ctrl ? props.snapSize * 2 : props.snapSize)
		return e.shiftKey ? 25 : (ctrl ? 10 : 1)
	}

	const keys =
	{
		'Home':       () => moveCropTo(0, 0),
		'End':        () => moveCropTo(0, getBounds().y),
		'PageUp':     () => moveCropTo(getBounds().x, 0),
		'PageDown':   () => moveCropTo(getBounds().x, getBounds().y),
		'Ctrl+KeyA':  () => selectAll(),
		'ArrowLeft':  (e) => nudgeCrop(-getStep(e), 0),
		'ArrowRight': (e) => nudgeCrop( getStep(e), 0),
		'ArrowUp':    (e) => nudgeCrop(0, -getStep(e)),
		'ArrowDown':  (e) => nudgeCrop(0,  getStep(e)),
	}

	KeyboardListeners(keys, disableKeys)

</script>

<template>

	<div v-if="active" id="selection-control"
		class="absolute border border-white !bg-transparent cursor-move" :style="cropStyle"
		@mousedown="startDrag($event, 'move')">
		<div v-for="handle in handleList" :key="handle.mode" :class="handle.class"
			@mousedown.stop="startDrag($event, handle.mode)" />
	</div>

</template>
