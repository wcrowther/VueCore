<script setup>

	const imageData 		= ref(null)
	const examplesStore 	= useExamplesStore()
	const { disableShortcuts } = storeToRefs(examplesStore)

	DisableGlobalKeys(true)

	const onCropperMouseEnter = () => { disableShortcuts.value = true }
	const onCropperMouseLeave = () => { disableShortcuts.value = false }

	onUnmounted(() => { disableShortcuts.value = false })

</script>

<template>

	<div class="mb-10">

		<PageTitleBox pageTitle="Image Cropper" />
	
		<div class="flex flex-wrap justify-between mt-10 mb-5">

			<InfoBox>
				Possible new control for cropping images. May just get incorporated into ImageEditor.
        	</InfoBox>

		</div>

		<div @mouseenter="onCropperMouseEnter" @mouseleave="onCropperMouseLeave">
			<ImageCropper v-model="imageData" :width="400" :height="400" :aspect-ratio="1"  />
		</div>

	  	<textarea v-model="imageData" class="hidden w-full h-40 mt-4 border" />

	</div>

</template>