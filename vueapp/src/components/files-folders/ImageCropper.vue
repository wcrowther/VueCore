<script setup>

	const props = defineProps(
	{
		modelValue: 	{ type: String, default: null},
		width: 			{ type: Number, default: 300 },
		height: 		{ type: Number, default: 300 },
		aspectRatio: 	{ type: Number, default: 1 },
		outputType: 	{ type: String, default: 'image/png' }
	})

	const emit = defineEmits( [ 'update:modelValue', 'change' ])

	const canvasRef = ref(null)
	const fileInputRef = ref(null)
	const image = ref(null)
	const isDragging = ref(false)
	const dragMode = ref(null)
	const startX = ref(0)
	const startY = ref(0)

	const crop = ref(
	{
		x: 50,
		y: 50,
		width: 200,
		height: 200
	})

	const displayScale = ref(1)
	const canvasWidth = 800
	const canvasHeight = 500
	const cropStyle = computed(() => (
	{
		left: `${crop.value.x}px`,
		top: `${crop.value.y}px`,
		width: `${crop.value.width}px`,
		height: `${crop.value.height}px`
	}))

	function onFileChange(event) 
	{
		const file = event.target.files?.[0]

		if (!file)
			return

		const reader = new FileReader()

		reader.onload = e => 
		{
			const img = new Image()

			img.onload = () => 
			{
				image.value = img

				fitImage()

				drawCanvas()

				updateOutput()
			}

			img.src = e.target.result
		}

		reader.readAsDataURL(file)

		// Allow selecting the same file again and still trigger change.
		event.target.value = ''
	}

	function openFilePicker()
	{
		fileInputRef.value?.click()
	}

	function fitImage() 
	{
		if (!image.value)
			return

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

	function drawCanvas() 
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

	function drawOverlay(ctx) 
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
		ctx.lineWidth = 2
		ctx.strokeRect( crop.value.x, crop.value.y, crop.value.width, crop.value.height )
	}

	function startDrag(event, mode = 'move') 
	{
		isDragging.value 	= true
		dragMode.value 		= mode
		startX.value 		= event.clientX
		startY.value 		= event.clientY

		window.addEventListener('mousemove', onDrag)
		window.addEventListener('mouseup', stopDrag)
	}

	function onDrag(event) 
	{
		if (!isDragging.value)
			return

		const dx = event.clientX - startX.value
		const dy = event.clientY - startY.value

		if (dragMode.value === 'move') {
			crop.value.x += dx
			crop.value.y += dy
		}

		if (dragMode.value === 'resize') {
			crop.value.width += dx

			crop.value.height = crop.value.width / props.aspectRatio
		}

		constrainCrop()

		startX.value = event.clientX
		startY.value = event.clientY

		drawCanvas()

		updateOutput()
	}

	function stopDrag() 
	{
		isDragging.value = false

		window.removeEventListener('mousemove', onDrag)
		window.removeEventListener('mouseup', stopDrag)
	}

	function constrainCrop() 
	{
		const c = crop.value

		if (c.x < 0)
			c.x = 0

		if (c.y < 0)
			c.y = 0

		if (c.x + c.width > canvasWidth)
			c.x = canvasWidth - c.width

		if (c.y + c.height > canvasHeight)
			c.y = canvasHeight - c.height

		if (c.width < 50) {
			c.width = 50
			c.height = c.width / props.aspectRatio
		}
	}

	function updateOutput() 
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

		outputCanvas.width = props.width
		outputCanvas.height = props.height

		ctx.drawImage( image.value, sx, sy, sw, sh,
			0, 0, outputCanvas.width, outputCanvas.height )

		const result = outputCanvas.toDataURL(props.outputType)

		emit('update:modelValue', result)
		emit('change', result)
	}

	watch(() => props.modelValue, value => 
	{
		if (value && !image.value) {
			const img = new Image()

			img.onload = () => {
				image.value = img

				fitImage()

				drawCanvas()
			}

			img.src = value
		}
	})

	onMounted(() => { drawCanvas() })
</script>

<template>
	<!-- <div class="flex flex-col gap-4"> -->

		<TabControl class="mb-10" :tabList="['Source', 'Preview']" keepAlive>

			<template #Right>
				<PrimaryButton title="Choose Image" @click="openFilePicker" />
				<input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange">
			</template>

        	<template #Source>    		
				<div class="relative border border-gray-300 overflow-hidden select-none"
					:style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }">

					<canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" 
						class="absolute inset-0" />
					<div v-if="image" id="image-crop"
						class="absolute border-2 border-white !bg-transparent cursor-move" :style="cropStyle"
						@mousedown="startDrag($event, 'move')">
						<div class="absolute w-4 h-4 bg-white border border-black right-[-8px] bottom-[-8px] cursor-se-resize"
							@mousedown.stop="startDrag($event, 'resize')" />
					</div>			
				</div>
        	</template>

			<template #Preview>

				<img v-if="modelValue" :src="modelValue" class="border border-gray-300 max-w-full" />
			</template>

    	</TabControl>
	<!-- </div> -->

</template>

<style scoped>
	canvas { display: block; }
</style>

<!-- USAGE:

	<script setup>
		const imageData = ref(null)
	</script>

	<template>

	  <ImageCropper v-model="imageData" :width="400" :height="400" :aspect-ratio="1"  />
	  <textarea v-model="imageData" class="w-full h-40 mt-4 border" />
	
	</template>
-->