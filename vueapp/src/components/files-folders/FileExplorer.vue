<script setup>

	const fileStore = useFileStore()
	const { selectedPath, fileRows, isLoading, loadError, selectedFileIndexes } = storeToRefs(fileStore)
	const { setSelectedPath, selectFileIndex } = fileStore

	const props = defineProps (
	{
		selectedPath: { type: String, default: "" }
	})

	watch(() => props.selectedPath, setSelectedPath, { immediate: true })

	const selectedIndexes = computed(() =>
	{
		const indexes = selectedFileIndexes?.value
		return Array.isArray(indexes) ? indexes : []
	})

	const selectedIndexSet = computed(() => new Set(selectedIndexes.value))

	const onRowClick = (index, event) =>
	{
		selectFileIndex(index, !!event?.shiftKey)
	}

	const onRowDragStart = (index, file, event) =>
	{
		if (!selectedIndexSet.value.has(index))
			selectFileIndex(index, false)

		const selectedFiles = selectedIndexes.value
			.map(idx => fileRows.value[idx]?.name)
			.filter(name => !!name)

		const payload = {
			sourcePath: selectedPath.value,
			fileNames: selectedFiles
		}

		event.dataTransfer.effectAllowed = "move"
		event.dataTransfer.setData("application/x-vueapp-files", JSON.stringify(payload))
		event.dataTransfer.setData("text/plain", file?.name || "")
	}

</script>

<template>

	<div>
		<div v-if="!selectedPath" class="text-color-dark-gray pt-4 px-4">
			Select a folder to view files.
		</div>

		<div v-else-if="isLoading" class="text-color-dark-gray pt-4 px-4">
			Loading files...
		</div>

		<div v-else-if="loadError" class="text-red-700 pt-4 px-4">
			{{ loadError }}
		</div>

		<div v-else-if="fileRows.length === 0" class="text-color-dark-gray pt-4 px-4">
			No files found in this folder.
		</div>

		<div v-else class="overflow-x-auto">
			<table class="min-w-full text-sm">
				<thead class="bg-blue-100">
					<tr>
						<th class="text-left pl-6 pr-3 py-2 border-b border-gray-300">Name</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Extension</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Size</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Last Modified</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(file, idx) in fileRows"
						:key="`${file.name}-${idx}`"  draggable="true"
						class="odd:bg-white even:bg-blue-50 cursor-pointer"
						:class="selectedIndexSet.has(idx) ? 'bg-blue-100 !text-black' : ''"
						@click="onRowClick(idx, $event)"
						@dragstart="onRowDragStart(idx, file, $event)">
						<td class="pl-6 px-3 py-2 border-b border-gray-200">{{ file.name || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ file.extension || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ formatFileSize(file.size) }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ dateTimeFormat(file.lastModified) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>

<style scoped></style>