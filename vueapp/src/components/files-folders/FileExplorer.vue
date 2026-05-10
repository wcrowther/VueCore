<script setup>

	const fileStore = useFileStore()
	const { selectedFolder, fileRows, isLoading, loadError, selectedFileIndexes } = storeToRefs(fileStore)
	const { selectFileIndex, deleteFile } = fileStore

	const { createConfirm } = useConfirmControl()

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

		<div class="overflow-x-auto">
			<table class="min-w-full text-sm">
				<thead class="bg-blue-100">
					<tr>
						<th class="w-24 text-left pl-6 pr-3 py-2 border-b border-gray-300">Name</th>
						<th class="w-10 text-left px-3 py-2 border-b border-gray-300">Extension</th>
						<th class="w-10 text-left px-3 py-2 border-b border-gray-300">Size</th>
						<th class="w-32 text-left px-3 py-2 border-b border-gray-300">Last Modified</th>
						<th class="w-5 text-left px-3 py-2 border-b border-gray-300">
							<span class="relative bottom-1">...</span>
						</th>
					</tr>
				</thead>
				<tbody class="h-full">
					<tr v-if="fileRows.length === 0">
						<td colspan="5" class="h-[120px] p-3 pb-4 text-center">
							No files found in this folder.
						</td>
					</tr>
					<tr v-else v-for="(file, idx) in fileRows"
						:key="`${file.name}-${idx}`" draggable="true"
						class="odd:bg-white even:bg-blue-50 cursor-pointer"
						:class="selectedIndexSet.has(idx) ? 'odd:!bg-gray-200 even:!bg-blue-200 !text-black' : ''"
						@click="onRowClick(idx, $event)"
						@dragstart="onRowDragStart(idx, file, $event)">
						<td class="pl-6 px-3 py-2 border-b border-gray-200">{{ file.name || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ file.extension || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ formatFileSize(file.size) }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ dateTimeFormat(file.lastModified) }}</td>
						<td class="px-3 py-2 border-b border-gray-200">
							<button class="text-red-500 text-xs border border-red-500 size-4 rounded-full
								 flex justify-center items-center" @click="onDeleteClick(file, $event)">
								<IconSymbol class="text-red-500" width="20px" icon="heroicons:x-mark-20-solid" />
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>

<style scoped></style>