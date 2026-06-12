<script setup>

	import { useSaveNameControl } from '@/composables/UseSaveNameControl'

	const props = defineProps(
	{
		modelValue: 	{ type: String, default: null},
		width: 			{ type: Number, default: 300 },
		height: 		{ type: Number, default: 300 },
		aspectRatio: 	{ type: Number, default: 1 },
		outputType: 	{ type: String, default: 'image/png' }
	})

	const { platform }			    = usePlatform()
	const emit 						= defineEmits([ 'update:modelValue', 'change' ])
	const imageStore 				= useImageStore()
	const uploadStore 				= useUploadStore()
	const { imageCropperSource, selectedFileName } 	= storeToRefs(imageStore)
	const { uploadFile } 			= uploadStore
	const { createSaveNameControl } = useSaveNameControl()

	const canvasRef 		= ref(null)
	const fileInputRef 		= ref(null)
	const image 			= ref(null)
	const sourceFileName 	= ref('')
	const isSaving 			= ref(false)
	const isDragging 		= ref(false)
	const dragMode 			= ref(null)
	const startX 			= ref(0)
	const startY 			= ref(0)
	const startCrop 		= ref(null)
	const minCropSize 		= 50

	const crop = ref(
	{
		x: 50,
		y: 50,
		width: 200,
		height: 200
	})

	const displayScale 	= ref(1)
	const canvasWidth 	= 800
	const canvasHeight 	= 500
	const handleList =
	[
		{ mode: 'nw', class: 'absolute top-[-7px] left-[-7px] size-3 bg-white border border-[#111111] cursor-nwse-resize' },
		{ mode: 'n',  class: 'absolute top-[-6px] left-1/2 size-[10px] -translate-x-1/2 bg-white border border-[#111111] cursor-ns-resize' },
		{ mode: 'ne', class: 'absolute top-[-7px] right-[-7px] size-3 bg-white border border-[#111111] cursor-nesw-resize' },
		{ mode: 'e',  class: 'absolute top-1/2 right-[-6px] size-[10px] -translate-y-1/2 bg-white border border-[#111111] cursor-ew-resize' },
		{ mode: 'se', class: 'absolute right-[-7px] bottom-[-7px] size-3 bg-white border border-[#111111] cursor-nwse-resize' },
		{ mode: 's',  class: 'absolute bottom-[-6px] left-1/2 size-[10px] -translate-x-1/2 bg-white border border-[#111111] cursor-ns-resize' },
		{ mode: 'sw', class: 'absolute bottom-[-7px] left-[-7px] size-3 bg-white border border-[#111111] cursor-nesw-resize' },
		{ mode: 'w',  class: 'absolute top-1/2 left-[-6px] size-[10px] -translate-y-1/2 bg-white border border-[#111111] cursor-ew-resize' }
	]

	const disableKeys = () => !image.value

	const cropStyle  = computed(() => 
	({
		left: `${crop.value.x}px`,
		top: `${crop.value.y}px`,
		width: `${crop.value.width}px`,
		height: `${crop.value.height}px`
	}))

	const onFileChange = (event) =>
	{
		const file = event.target.files?.[0]

		if (!file) return

		sourceFileName.value = file.name

		const reader = new FileReader()

		reader.onload = e => loadImageSource(e.target.result, true)
		reader.readAsDataURL(file)

		// Allow selecting the same file again and still trigger change.
		event.target.value = ''
	}

	const openFilePicker = () =>
	{
		fileInputRef.value?.click()
	}

	const loadImageSource = (source, persistSource = false) =>
	{
		if (!source)
			return

		const img = new Image()

		img.onload = () =>
		{
			image.value = img

			if (persistSource) imageCropperSource.value = source

			fitImage()
			drawCanvas()
			updateOutput()
		}
		img.src = source
	}

	const fitImage = () =>
	{
		if (!image.value) return

		const scaleX = canvasWidth / image.value.width
		const scaleY = canvasHeight / image.value.height
		displayScale.value = Math.min(scaleX, scaleY)
		crop.value = 
		{
			x: 50,
			y: 50,
			width: 200,
			height: 200 / props.aspectRatio
		}
	}

	const drawCanvas = () =>
	{
		const canvas = canvasRef.value

		if (!canvas || !image.value)
			return

		const ctx 		= canvas.getContext('2d')
		const imgWidth 	= image.value.width * displayScale.value
		const imgHeight = image.value.height * displayScale.value

		ctx.clearRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage( image.value, 0, 0, imgWidth, imgHeight )	
		drawOverlay(ctx)
	}

	const drawOverlay = (ctx) =>
	{
		ctx.fillStyle = 'rgba(0,0,0,0.5)'
		ctx.fillRect(0, 0, canvasWidth, canvasHeight)

		// redraw cropped image section
		const scale = 1 / displayScale.value
		const sx = crop.value.x * scale
		const sy = crop.value.y * scale
		const sw = crop.value.width * scale
		const sh = crop.value.height * scale

		ctx.drawImage
		(
			image.value, sx, sy, sw, sh,
			crop.value.x, crop.value.y, crop.value.width, crop.value.height
		)

		// border
		ctx.strokeStyle = '#ffffff'
		ctx.lineWidth = 1
		ctx.strokeRect( crop.value.x, crop.value.y, crop.value.width, crop.value.height )
	}

	const getImageDisplayBounds = () =>
	({
		x: 0,
		y: 0,
		width: image.value ? image.value.width * displayScale.value : canvasWidth,
		height: image.value ? image.value.height * displayScale.value : canvasHeight
	})

	const applyCrop = (nextCrop, mode = 'move') =>
	{
		crop.value = constrainCrop(nextCrop, mode)
		drawCanvas()
		updateOutput()
	}

	const moveCropTo = (x, y) =>
	{
		applyCrop(
		{
			x,
			y,
			width: crop.value.width,
			height: crop.value.height
		}, 'move')
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

		const dx = event.clientX - startX.value
		const dy = event.clientY - startY.value
		const base = startCrop.value

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
			const aspect = props.aspectRatio > 0 ? props.aspectRatio : 1
			const widthFromX = dragMode.value.includes('e') ? base.width + dx : base.width - dx
			const heightFromY = dragMode.value.includes('s') ? base.height + dy : base.height - dy
			const widthFromY = heightFromY * aspect
			const widthDeltaFromX = Math.abs(widthFromX - base.width)
			const widthDeltaFromY = Math.abs(widthFromY - base.width)
			const nextWidth = widthDeltaFromX >= widthDeltaFromY ? widthFromX : widthFromY
			const nextHeight = nextWidth / aspect
			const right = base.x + base.width
			const bottom = base.y + base.height

			nextCrop.width = nextWidth
			nextCrop.height = nextHeight
			nextCrop.x = dragMode.value.includes('w') ? right - nextWidth : base.x
			nextCrop.y = dragMode.value.includes('n') ? bottom - nextHeight : base.y
		}
		else 
		{
			if (dragMode.value.includes('e')) 
				nextCrop.width = base.width + dx

			if (dragMode.value.includes('s')) 
				nextCrop.height = base.height + dy

			if (dragMode.value.includes('w')) 
			{
				nextCrop.x = base.x + dx
				nextCrop.width = base.width - dx
			}

			if (dragMode.value.includes('n')) 
			{
				nextCrop.y = base.y + dy
				nextCrop.height = base.height - dy
			}
		}

		applyCrop(nextCrop, dragMode.value)
	}

	const stopDrag = () =>
	{
		isDragging.value = false
		startCrop.value = null

		window.removeEventListener('mousemove', onDrag)
		window.removeEventListener('mouseup', stopDrag)
	}

	const constrainCrop = (nextCrop, mode = 'move') =>
	{
		const c = { ...nextCrop }

		if (c.width < minCropSize) 
		{
			const diff = minCropSize - c.width

			c.width = minCropSize

			if (mode.includes('w'))
				c.x -= diff
		}

		if (c.height < minCropSize) 
		{
			const diff = minCropSize - c.height

			c.height = minCropSize

			if (mode.includes('n'))
				c.y -= diff
		}

		if (c.x < 0) 
		{
			if (mode.includes('w'))
				c.width += c.x

			c.x = 0
		}

		if (c.y < 0) 
		{
			if (mode.includes('n'))
				c.height += c.y

			c.y = 0
		}

		if (c.x + c.width > canvasWidth) 
		{
			const overflowX = c.x + c.width - canvasWidth

			if (mode.includes('e'))
				c.width -= overflowX
			else
				c.x -= overflowX
		}

		if (c.y + c.height > canvasHeight) 
		{
			const overflowY = c.y + c.height - canvasHeight

			if (mode.includes('s'))
				c.height -= overflowY
			else
				c.y -= overflowY
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
		if (c.x + c.width > canvasWidth) c.x = canvasWidth - c.width
		if (c.y + c.height > canvasHeight) c.y = canvasHeight - c.height

		return c
	}

	const updateOutput = () =>
	{
		if (!image.value)
			return

		const outputCanvas = document.createElement('canvas')
		const ctx = outputCanvas.getContext('2d')
		const scale = 1 / displayScale.value
		const sx = crop.value.x * scale
		const sy = crop.value.y * scale
		const sw = crop.value.width * scale
		const sh = crop.value.height * scale

		outputCanvas.width = Math.max(1, Math.round(sw))
		outputCanvas.height = Math.max(1, Math.round(sh))

		ctx.drawImage( image.value, sx, sy, sw, sh,
			0, 0, outputCanvas.width, outputCanvas.height )

		const result = outputCanvas.toDataURL(props.outputType)

		emit('update:modelValue', result)
		emit('change', result)
	}

	const getOutputExtension = () =>
	{
		const typeMap =
		{
			'image/jpeg': 'jpg',
			'image/jpg':  'jpg',
			'image/png':  'png',
			'image/webp': 'webp',
			'image/gif':  'gif',
			'image/bmp':  'bmp'
		}

		return typeMap[props.outputType] ?? 'png'
	}

	const getCroppedFileName = () =>
	{
		const sourceName = selectedFileName.value || sourceFileName.value || 'cropped-image'
		const dotIndex = sourceName.lastIndexOf('.')
		const baseName = dotIndex > 0 ? sourceName.slice(0, dotIndex) : sourceName
		return `${baseName}_crop.${getOutputExtension()}`
	}

	const saveCropImage = async (fileName = getCroppedFileName()) =>
	{
		if (!props.modelValue || isSaving.value)
			return

		isSaving.value = true

		try
		{
			const response = await fetch(props.modelValue)
			const blob = await response.blob()
			const file = new File([blob], fileName, { type: props.outputType })

			await uploadFile(
			{
				file,
				preview: props.modelValue,
				progress: 0,
				status: 'pending',
				controller: null,
				error: null
			})
		}
		finally
		{
			isSaving.value = false
		}
	}

	const promptForSave = async () =>
	{
		if (!props.modelValue || isSaving.value) return

		const fileName = await createSaveNameControl(getCroppedFileName())

		if (!fileName) return

		await saveCropImage(fileName)
	}

	// Keyboard Listeners  ================================================

	const keys = (e) =>
	{
		const imageBounds = getImageDisplayBounds()
		const boundsX = Math.max(imageBounds.x, imageBounds.x + imageBounds.width - crop.value.width)
		const boundsY = Math.max(imageBounds.y, imageBounds.y + imageBounds.height - crop.value.height)
		
		let ctrl = platform.value === "MacOS" ? e.metaKey : e.ctrlKey 
		let step = e.shiftKey ? 25 : (e.ctrlKey ? 10 : 1) 
		// console.log(e.code);    

		if (e.code === 'KeyS' && ctrl) { promptForSave(); 		e.preventDefault() }
		if (e.code === 'ArrowLeft')    { nudgeCrop(-step, 0);	e.preventDefault() }
		if (e.code === 'ArrowRight')   { nudgeCrop(step, 0); 	e.preventDefault() }
		if (e.code === 'ArrowUp')      { nudgeCrop(0, -step);	e.preventDefault() }
		if (e.code === 'ArrowDown')    { nudgeCrop(0, step); 	e.preventDefault() }
		if (e.code === 'Home') 		   { moveCropTo(0, 0); 		e.preventDefault() }
		if (e.code === 'End')  		   { moveCropTo(boundsX, boundsY); e.preventDefault() }
	}

	KeyboardListeners(keys, disableKeys)

	// Watch & Mounted  ===================================================

	watch(() => props.modelValue, value => 
	{
		if (value && !image.value)
			loadImageSource(value, true)
	})

	onMounted(() =>
	{
		drawCanvas()

		if (imageCropperSource.value && !image.value)
			loadImageSource(imageCropperSource.value)
	})

</script>

<template>
	<!-- <div class="flex flex-col gap-4"> -->

		<TabsControl class="mb-10" :tabList="['Source', 'Crop']" keepAlive>

			<template #Right>
				<PrimaryButton title="Choose Image" @click="openFilePicker" class="mr-2" />
					<PrimaryButton :title="isSaving ? 'Saving...' : 'Save'" :disabled="!modelValue || isSaving" @click="promptForSave" />
				<input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange">
			</template>

        	<template #Source>    		
				<div class="relative border border-gray-300 overflow-hidden select-none"
					:style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }">

					<canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" 
						class="absolute inset-0" />
					<div v-if="image" id="image-crop"
						class="absolute border border-white !bg-transparent cursor-move" :style="cropStyle"
						@mousedown="startDrag($event, 'move')">
						<div v-for="handle in handleList" :key="handle.mode" :class="handle.class"
							@mousedown.stop="startDrag($event, handle.mode)" />
					</div>			
				</div>
        	</template>

			<template #Crop>
				<img v-if="modelValue" :src="modelValue"
					class="border border-gray-300 max-w-full cursor-move select-none"
					draggable="false"
					@dragstart.prevent
					@mousedown.prevent="startDrag($event, 'moveInverse')" />
			</template>

    	</TabsControl>
	<!-- </div> -->

</template>


<!-- USAGE:

	<script setup>
		const imageData = ref(null)
	</script>

	<template>

	  <ImageCropper v-model="imageData" :width="400" :height="400" :aspect-ratio="1"  />
	  <textarea v-model="imageData" class="w-full h-40 mt-4 border" />
	
	</template>
-->