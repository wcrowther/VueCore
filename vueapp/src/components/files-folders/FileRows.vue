<script setup>

	const fileStore = useFileStore()
	const imageStore = useImageStore()
	const { fileRows, selectedIndexes, selectedIndexSet } = storeToRefs(fileStore)
	const { deleteFile, isImageFile, getFileUrl, handleFileClick, startFileDrag, selectFileIndex } = fileStore
	const { onPreviewAreaClick } = imageStore
	const { createConfirm } = useConfirmControl()

	const onDeleteClick = async (file) =>
		await createConfirm(`Delete "${file.name}"?`, () => deleteFile(file.name))

	const onPreviewClick = (file) =>
	{
		onPreviewAreaClick(file)
	}

	const onRowEnter = (file, idx) =>
	{
		if (!selectedIndexSet.value.has(idx))
		{
			selectFileIndex(idx)
			return
		}

		onPreviewAreaClick(file)
	}

	const trimExtension = (name) => name?.split('.').slice(0, -1).join('.') || "-"

</script>

<template>

	<div class="overflow-x-auto">
		<div class="grid grid-cols-[60px_minmax(0,2fr)_1fr_1fr_2fr_36px] min-w-full text-sm">

			<!-- Header -->
			<div class="col-span-full grid grid-cols-subgrid bg-blue-100">
				<div class="py-2 border-b border-gray-300"></div>
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
				:key="`${file.name}-${idx}`" draggable="true" tabindex="0"
				class="col-span-full grid grid-cols-subgrid cursor-pointer"
				:class="selectedIndexSet.has(idx)
					? [idx % 2 === 0 ? 'bg-gray-200' : 'bg-blue-200', 'text-black']
					: [idx % 2 === 0 ? 'bg-white' : 'bg-blue-50']"
				@click="handleFileClick(idx, $event)"
				@keydown.enter.prevent="onRowEnter(file, idx)"
				@dragstart="startFileDrag(idx, file, $event)">

				<div class="py-1 pl-5 pr-1 border-b border-gray-200 flex justify-end"
					@click.stop.prevent="onPreviewClick(file, idx, $event)">
					<img v-if="isImageFile(file.extension)"
						:src="getFileUrl(file)"
						class="size-8 object-contain block rounded-sm bg-white" />
					<div v-else
						class="size-8 bg-gray-300 rounded-sm" />
				</div>
				<div class="pl-6 px-3 py-2 border-b border-gray-200">
					{{ trimExtension(file.name) }}
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
						flex justify-center items-center" @click.stop="onDeleteClick(file)">
						<IconSymbol class="text-red-500" width="20px" icon="heroicons:x-mark-20-solid" />
					</button>
				</div>

			</div>

		</div>
	</div>

</template>
