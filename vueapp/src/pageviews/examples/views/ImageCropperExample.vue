<script setup>

	const imageData 		= ref(null)
	const imageCropperRef 	= ref(null)
	const examplesStore 	= useExamplesStore()
	const { disableShortcuts } = storeToRefs(examplesStore) // rename to exampleShortcutsOff?

	const onCropperMouseEnter = () => { disableShortcuts.value = true }
	const onCropperMouseLeave = () => { disableShortcuts.value = false }

	onUnmounted(() => { disableShortcuts.value = false })

</script>

<template>

	<div class="mb-10">

		<PageTitleBox pageTitle="Image Cropper">
			<PrimaryButton title="Choose Image" @click="imageCropperRef?.openFilePicker()" />
			<PrimaryButton
				:title="imageCropperRef?.getSaveButtonTitle?.() || 'Save'"
				:disabled="!imageCropperRef?.getCanSave?.()"
				@click="imageCropperRef?.promptForSave()" />
		</PageTitleBox>	
	
		<InfoBox>
			ImageCropper lets you choose an image, drag a fixed-ratio crop region, and preview the cropped output in real time.
			This example is configured for a 1:1 square crop and is intended for avatar/profile-style images.
        </InfoBox>

		<HelpBox>
			Use mouse drag to move the selection and corner/edge handles to resize. 
			While your mouse is over this control, the ExampleList keyboard shortcuts are temporarily disabled.
			Keyboard shortcuts:
			<ul class="list-disc pl-6 mt-2 space-y-1">
				<li><b>Shift + Tab</b>: Toggle between Source and Crop views (in this setup).</li>
				<li><b>Arrow Keys</b>: Nudge the crop by 1px.</li>
				<li><b>Ctrl + Arrow Keys</b>: Nudge by 10px.</li>
				<li><b>Shift + Arrow Keys</b>: Nudge by 25px.</li>
				<li><b>Home</b>: Move crop to top-left.</li>
				<li><b>End</b>: Move crop to bottom-right within bounds.</li>
				<li><b>Ctrl + S</b> (or <b>Cmd + S</b> on macOS): Save cropped image.</li>
			</ul>
        </HelpBox>

		<div @mouseenter="onCropperMouseEnter" @mouseleave="onCropperMouseLeave">
			<ImageCropper ref="imageCropperRef" v-model="imageData" :width="400" :height="400" :aspect-ratio="1"  />
		</div>

	  	<textarea v-model="imageData" class="hidden w-full h-40 mt-4 border" />

	</div>

</template>