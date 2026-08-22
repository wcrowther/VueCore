<script setup>

	import { usePromptControl } from '@/composables/UsePromptControl'

	const props = defineProps(
	{
		modelValue: 	{ type: String, default: null},
		width: 			{ type: Number, default: 300 },
		height: 		{ type: Number, default: 300 },
		aspectRatio: 	{ type: Number, default: 1 },
		outputType: 	{ type: String, default: 'image/png' }
	})

	const emit 						= defineEmits([ 'update:modelValue', 'change' ])
	const imageStore 				= useImageStore()
	const uploadStore 				= useUploadStore()
	const { imageCropperSource, selectedFileName } 	= storeToRefs(imageStore)
	const { uploadFile } 			= uploadStore
	const { createPromptControl } 	= usePromptControl()

	const canvasRef 		= ref(null)
	const fileInputRef 		= ref(null)
	const selectionRef 		= ref(null)
	const image 			= ref(null)
	const sourceFileName 	= ref('')
	const isSaving 			= ref(false)
	const crop 				= ref({ x: 50, y: 50, width: 200, height: 200 })
	const activeCropperTab 	= ref('Source')
	const displayScale 		= ref(1)
	const canvasWidth 	= 800
	const canvasHeight 	= 500

	const disableKeys = () => !image.value

	const canSave = computed(() => !!props.modelValue && !isSaving.value)
	const saveButtonTitle = computed(() => isSaving.value ? 'Saving...' : 'Save')
	const getCanSave = () => canSave.value
	const getSaveButtonTitle = () => saveButtonTitle.value

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
		}
		img.src = source
	}

	const fitImage = () =>
	{
		if (!image.value) return

		const scaleX = canvasWidth / image.value.width
		const scaleY = canvasHeight / image.value.height
		displayScale.value = Math.min(scaleX, scaleY)
		selectionRef.value?.reset()
	}

	const getCropSourceRegion = () =>
	{
		const scale = 1 / displayScale.value

		return {
			sx: crop.value.x * scale,
			sy: crop.value.y * scale,
			sw: crop.value.width * scale,
			sh: crop.value.height * scale
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

		// Redraw only the selected source region into the crop box.
		const { sx, sy, sw, sh } = getCropSourceRegion()

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

	const displayBounds = computed(() =>
	({
		x: 0,
		y: 0,
		width: image.value ? image.value.width * displayScale.value : canvasWidth,
		height: image.value ? image.value.height * displayScale.value : canvasHeight
	}))

	const onCropChange = (newCrop) =>
	{
		crop.value = newCrop
		drawCanvas()
		updateOutput()
	}

	const updateOutput = () =>
	{
		if (!image.value)
			return

		const outputCanvas = document.createElement('canvas')
		const ctx = outputCanvas.getContext('2d')
		const { sx, sy, sw, sh } = getCropSourceRegion()

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

		const options = 
		{
			textSuggestion: getCroppedFileName(),
			message: 'Enter a file name for the cropped image',
			labelName: 'File Name',
			confirmText: 'Save'
		}
		
		const fileName = await createPromptControl(options)

		if (!fileName) return

		await saveCropImage(fileName)
	}

	const switchTab =  () => activeCropperTab.value = activeCropperTab.value === 'Source' ? 'Crop' : 'Source'

	defineExpose(
	{
		openFilePicker,
		promptForSave,
		getCanSave,
		getSaveButtonTitle
	})

	// Keyboard Listeners  ================================================

	const keys =
	{
		'Shift+Tab': () => switchTab(),
		'Ctrl+KeyS': () => promptForSave(),
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
	
		<TabsControl v-model:activeTab="activeCropperTab" class="mb-10" 
			:tabList="['Source', 'Crop']" keepAlive contentBorder>

			<input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onFileChange">

        	<template #Source>    		
				<div class="relative border border-gray-300 overflow-hidden select-none"
					:style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }">

					<canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" 
						class="absolute inset-0" />

					<SelectionControl ref="selectionRef"
						:aspectRatio="props.aspectRatio"
						:canvasWidth="canvasWidth"
						:canvasHeight="canvasHeight"
						:displayBounds="displayBounds"
						:active="!!image"
						@change="onCropChange" />
				</div>
        	</template>

			<template #Crop>
				<img v-if="modelValue" :src="modelValue"
					class="border border-gray-300 max-w-full cursor-move select-none"
					draggable="false"
					@dragstart.prevent
					@mousedown.prevent="selectionRef?.startDrag($event, 'moveInverse')" />
			</template>

    	</TabsControl>

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