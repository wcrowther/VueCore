<script setup>
	
	const { useFileThumbnail,
			fileThumbnailSize,
			fileLoadError,
			isLoadingFile,
			selectedFileNames }  = storeToRefs(useFileStore())  // inline example for store
</script>

<template>

	<div>
	
		<div class="flex justify-between items-center text-color-dark-gray pl-6 pr-4 pt-5 pb-2">
			
			<div v-if="isLoadingFile" 
				class="flex items-center text-color-dark-gray">
				Loading files...
			</div>
			<div v-else-if="fileLoadError" 
				class="flex items-center text-red-700">
				{{ fileLoadError }}
			</div>
			<div v-else
				class="flex items-center">
				<span class="font-bold mr-2">Selected:</span>
				{{ selectedFileNames.join(', ') || 'None'}}
			</div>

			<div class="ml-auto flex gap-2">

				<SliderInput v-if="useFileThumbnail" 
					v-model="fileThumbnailSize"
					labelName="Size" minName="50px" maxName="300px"
					:min="50" :max="300" :step="50"
					class="!mb-0 !w-[150px] mr-5 px-3 py-1 border border-gray-300" />

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