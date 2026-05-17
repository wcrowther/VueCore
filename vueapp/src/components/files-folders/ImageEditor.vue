<script setup>

	const imageStore = useImageStore()
	const {
		toolbarTools,
		activeTool,
		hasSelection,
		selectedFileName,
		selectedFileIsImage,
		selectedImageUrl
	} = storeToRefs(imageStore)

	const { setActiveTool } = imageStore

</script>

<template>

	<div class="h-full min-h-[420px] border border-gray-300 bg-white">

		<div class="flex flex-wrap items-center gap-2 p-3 border-b border-gray-300 bg-gray-100">
			<button v-for="tool in toolbarTools"
				:key="tool.key"
				class="btnTool"
				:class="activeTool === tool.key ? 'btnTool-active' : 'btnTool-inactive'"
				:disabled="tool.disabled"
				@click="setActiveTool(tool.key)">
				<IconSymbol :icon="tool.icon" width="18px" />
				<span>{{ tool.label }}</span>
			</button>
		</div>

		<div class="h-[calc(100%-57px)] p-4 flex items-center justify-center bg-gray-50">

			<div v-if="selectedFileIsImage" class="w-full h-full flex flex-col">
				<div class="text-xs text-color-dark-gray mb-2 truncate">
					{{ selectedFileName }}
				</div>
				<div class="flex-1 min-h-0 border border-gray-300 bg-white p-2 overflow-auto">
					<img :src="selectedImageUrl"
						:alt="selectedFileName"
						class="max-w-full max-h-full mx-auto object-contain" />
				</div>
			</div>

			<div v-else class="text-sm text-color-dark-gray text-center">
				<div v-if="!hasSelection">
					Select a file from File Explorer to preview it here.
				</div>
				<div v-else>
					The selected file is not an image.
				</div>
			</div>

		</div>

	</div>

</template>

<style scoped>
	.btnTool { @apply h-8 px-2 rounded border text-xs flex items-center gap-1 transition disabled:opacity-60 disabled:cursor-not-allowed; }
	.btnTool-active { @apply bg-blue-100 border-blue-300 text-blue-900; }
	.btnTool-inactive { @apply bg-white border-gray-300 text-color-dark-gray; }
</style>
