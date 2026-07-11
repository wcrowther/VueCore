<script setup>

	const imageData = ref(null)

	DisableGlobalKeys(true)

</script>

<template>

	<div class="mb-10">

		
        <div class="text-lg font-bold mb-5">Image Cropper</div>
	
		<div class="flex flex-wrap justify-between mt-10 mb-5">

			<InfoBox>
				Possible new control for cropping images. May just get incorporated into ImageEditor.
        	</InfoBox>

		</div>

		<KeepAlive>
			<ImageCropper v-model="imageData" :width="400" :height="400" :aspect-ratio="1"  />
		</KeepAlive>
	  	<textarea v-model="imageData" class="hidden w-full h-40 mt-4 border" />

	</div>

</template>