<script setup>

	const fileStore 							 = useFileStore()
	const imageStore 						 = useImageStore()
	const { fileRows, selectedIndexSet,
			fileThumbnailSize } 				 = storeToRefs(fileStore)
	const { deleteFile, isImageFile, getFileUrl, 
			handleFileClick, startFileDrag, selectFileIndex } 	 = fileStore
	const { onPreviewAreaClick } 				 = imageStore
			
	const { createConfirm } 					 = useConfirmControl()

	const onImageClick = (file, idx, event) =>
	{
		handleFileClick(idx, event)
		onPreviewAreaClick(file)
	}

	const onThumbnailEnter = (file, idx) =>
	{
		if (!selectedIndexSet.value.has(idx))
		{
			selectFileIndex(idx)
			return
		}

		onPreviewAreaClick(file)
	}

</script>

<template>

	<div>

		<div v-if="fileRows.length === 0"
			class="h-[120px] flex items-center justify-center text-color-dark-gray text-sm">
			No files found in this folder.
		</div>

		<div v-else class="flex flex-wrap gap-3 p-5">

			<div v-for="(file, idx) in fileRows"
				:key="`${file.name}-${idx}`" draggable="true" tabindex="0"
			:class="['flex flex-col cursor-pointer rounded border-2 overflow-hidden relative group shrink-0',
				selectedIndexSet.has(idx) ? 'border-blue-400' : 'border-transparent hover:border-gray-300']"
				:style="{ width: fileThumbnailSize + 'px' }				"
				@click="handleFileClick(idx, $event)"
				@keydown.enter.prevent="onThumbnailEnter(file, idx)"
				@dragstart="startFileDrag(idx, file, $event)">

				<!-- Image -->
				<img v-if="isImageFile(file.extension)"
					:src="getFileUrl(file)"
					class="object-contain w-full bg-white block"
					@click.stop="onImageClick(file, idx, $event)"
					:style="{ height: fileThumbnailSize + 'px' }" />

				<!-- Placeholder for non-image files -->
				<div v-else class="flex items-center justify-center bg-gray-100 text-gray-400 font-mono text-sm"
					:style="{ width: fileThumbnailSize + 'px', height: fileThumbnailSize + 'px' }">
					{{ file.extension || '?' }}
				</div>

				<!-- Filename label -->
				<div class="px-1 py-1 text-xs text-center truncate bg-gray-100 border-t border-gray-200 leading-tight">
					{{ file.name }}
				</div>

				<!-- Delete button — visible on hover -->
				<button
					class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity
						bg-white border border-red-400 size-4 rounded-full flex justify-center items-center"
					@click.stop="createConfirm(`Delete '${file.name}'?`, () => deleteFile(file.name))">
					<IconSymbol class="text-red-500" width="16px" icon="heroicons:x-mark-20-solid" />
				</button>

			</div>

		</div>

	</div>

</template>
