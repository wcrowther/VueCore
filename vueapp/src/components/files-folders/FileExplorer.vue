<script setup>

	const fileStore 			= useFileStore()
	const { useFileThumbnail,
			fileThumbnailSize,
			fileLoadError,
			isLoadingFile } 	= storeToRefs(fileStore)

</script>

<template>

	<div>
	
		<div class="flex justify-between items-center text-color-dark-gray pl-6 pr-4 py-2">
			
			<div v-if="isLoadingFile" 
				class="flex items-center text-color-dark-gray">
				Loading files...
			</div>
			<div v-else-if="fileLoadError" 
				class="flex items-center text-red-700">
				{{ fileLoadError }}
			</div>
			<div v-else-if="useFileThumbnail" 
				class="flex items-center text-color-dark-gray">

				<SliderInput v-model="fileThumbnailSize"
					labelName="Size" minName="100px" maxName="300px"
					:min="100" :max="300" :step="20"
					class="!mb-0 w-[200px] p-4 py-1 border border-gray-300" />
			</div>

			<div class="ml-auto flex gap-2">

				<button @click="useFileThumbnail=false"
					class="btnIcon" :class="['!rounded-none',{ 'bg-gray-200': !useFileThumbnail }]">
					<IconSymbol width="22px" class="text-color-dark-gray" icon="heroicons:bars-3-20-solid" />
				</button>
				<button @click="useFileThumbnail=true"
					class="btnIcon" :class="['!rounded-none',{ 'bg-gray-200': useFileThumbnail }]">
					<IconSymbol width="22px" class="text-color-dark-gray" icon="heroicons:photo-20-solid" />
				</button>
			</div>

		</div>

		<FileThumbnails v-if="useFileThumbnail" />
		<FileRows v-else />

	</div>

</template>

<style scoped>
	.btnIcon { @apply flex-center size-8 rounded border border-gray-400 h-8 hover:bg-gray-200 transition;	}
</style>
0