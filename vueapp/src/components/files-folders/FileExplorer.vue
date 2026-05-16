<script setup>

	const fileStore = useFileStore()
	const { selectedFolder, fileRows, isLoading, loadError, selectedFileIndexes } = storeToRefs(fileStore)
	const { selectFileIndex, deleteFile } = fileStore
	const { createConfirm } = useConfirmControl()
	const appStore = useAppStore()

	const showThumbnails = ref(false)

	const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'])
	const isImageFile = (ext) => imageExtensions.has((ext ?? '').toLowerCase())
	const getFileUrl  = (file) => `${appStore.baseApiUrl}/content/file/${toApiFolderPath(selectedFolder.value)}/${encodeURIComponent(file.name)}`

	const selectedIndexes = computed(() =>
	{
		const indexes = selectedFileIndexes?.value
		return Array.isArray(indexes) ? indexes : []
	})

	const selectedIndexSet = computed(() => new Set(selectedIndexes.value))

	const onRowClick = (index, event) =>
	{
		selectFileIndex(index,
		{
			shiftKey: !!event?.shiftKey,
			metaKey: !!event?.metaKey,
			ctrlKey: !!event?.ctrlKey
		})
	}

	const onDeleteClick = async (file, event) =>
	{
		event.stopPropagation()
		const confirmed = await createConfirm(`Delete "${file.name}"?`)
		if (confirmed)
			await deleteFile(file.name)
	}

	const onRowDragStart = (index, file, event) =>
	{
		if (!selectedIndexSet.value.has(index))
			selectFileIndex(index)

		const selectedFiles = selectedIndexes.value
			.map(idx => fileRows.value[idx]?.name)
			.filter(name => !!name)

		const payload = {
			sourcePath: selectedFolder.value,
			fileNames: selectedFiles
		}

		event.dataTransfer.effectAllowed = "move"
		event.dataTransfer.setData("application/x-vueapp-files", JSON.stringify(payload))
		event.dataTransfer.setData("text/plain", file?.name || "")
	}

</script>

<template>

	<div>

		<!-- 
		<div v-if="isLoading" 
			class="flex items-center text-color-dark-gray px-6 py-2">
			Loading files...
		</div>
		<div v-else-if="loadError" 
			class="text-red-700 pt-4 px-4">
			{{ loadError }}
		</div>
		<div v-else 
			class="flex items-center text-color-dark-gray px-6 py-2">
			Loading files...
		</div> 
		-->

		<div class="flex justify-between items-center text-color-dark-gray pl-6 pr-4 py-2">
			<span class="">
				Show Thumbnails: {{ showThumbnails }}
			</span>
			<div class="ml-auto flex gap-2">

				<button @click="showThumbnails = false" 
					class="btnIcon" :class="{ 'bg-gray-200': !showThumbnails }">
					<IconSymbol width="22px" class="text-color-dark-gray" icon="heroicons:bars-3-20-solid" />
				</button>
				<button  @click="showThumbnails = true" 
					class="btnIcon" :class="{ 'bg-gray-200': showThumbnails }">
					<IconSymbol width="22px" class="text-color-dark-gray" icon="heroicons:photo-20-solid" />
				</button>

			</div>
		</div>

		<div class="overflow-x-auto">
			<div class="grid grid-cols-[60px_minmax(0,2fr)_1fr_1fr_2fr_36px] min-w-full text-sm">

				<!-- Header -->
				<div class="col-span-full grid grid-cols-subgrid bg-blue-100">
					<div class="py-2 border-b border-gray-300">
					</div>
					<div class="pl-6 pr-3 py-2 border-b border-gray-300 font-semibold">
						Name
					</div>
					<div class="px-3 py-2 border-b border-gray-300 font-semibold">
						Extension
					</div>
					<div class="px-3 py-2 border-b border-gray-300 font-semibold">
						Size
					</div>
					<div class="px-3 py-2 border-b border-gray-300 font-semibold">
						Last Modified
					</div>
					<div class="px-3 py-2 border-b border-gray-300 font-semibold">
						<span class="relative bottom-1">...</span>
					</div>
				</div>

				<!-- Empty state -->
				<div v-if="fileRows.length === 0"
					class="col-span-full h-[120px] p-3 pb-4 pl-5 text-center">
					No files found in this folder.
				</div>

				<!-- Data rows -->
				<div v-else v-for="(file, idx) in fileRows"
					:key="`${file.name}-${idx}`" draggable="true"
					class="col-span-full grid grid-cols-subgrid cursor-pointer"
					:class="selectedIndexSet.has(idx)
						? [idx % 2 === 0 ? 'bg-gray-200' : 'bg-blue-200', 'text-black']
						: [idx % 2 === 0 ? 'bg-white' : 'bg-blue-50']"
					@click="onRowClick(idx, $event)"
					@dragstart="onRowDragStart(idx, file, $event)">

					<div class="py-1 pl-5 pr-1 border-b border-gray-200 flex justify-end">
						<img v-if="isImageFile(file.extension)"
							:src="getFileUrl(file)"
							class="size-8 object-cover block rounded-sm" />
						<div v-else
							class="size-8 bg-gray-300 rounded-sm" />
					</div>
					<div class="pl-6 px-3 py-2 border-b border-gray-200">
						{{ file.name || "-" }}
					</div>
					<div class="px-3 py-2 border-b border-gray-200">
						{{ file.extension || "-" }}
					</div>
					<div class="px-3 py-2 border-b border-gray-200">
						{{ formatFileSize(file.size) }}
					</div>
					<div class="px-3 py-2 border-b border-gray-200">
						{{ dateTimeFormat(file.lastModified) }}
					</div>
					<div class="px-3 py-2 border-b border-gray-200">
						<button class="text-red-500 text-xs border border-red-500 size-4 rounded-full
							flex justify-center items-center" @click="onDeleteClick(file, $event)">
							<IconSymbol class="text-red-500" width="20px" icon="heroicons:x-mark-20-solid" />
						</button>
					</div>
				</div>

			</div>
		</div>
	</div>

</template>

<style scoped>
	.btnIcon { @apply flex-center size-8 rounded border border-gray-400 h-8 hover:bg-gray-200 transition;	}
</style>