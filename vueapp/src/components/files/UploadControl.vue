<script setup>

	const contentStore 	= useContentStore()
	const { uploads }  	= storeToRefs(contentStore)
	const { clearDoneUploads, addFiles, uploadFile, uploadAll,cancelUpload, retryUpload, removeUpload } = contentStore

	const props = defineProps(
	{
		uploadMessage: { type: String, default: 'Drag files here or click to upload'},
		accept: { type: String, default: "*" }
	})

	const fileInput  = useTemplateRef('fileInput')
	const openDialog = () => fileInput.value.click()

</script>

<template>
	<div class="w-full">

		<!-- Drop Zone -->
		<div class="border border-gray-400 p-8 text-center cursor-pointer
            hover:bg-gray-50 transition relative" @click="openDialog" 
			@dragover.prevent @dragenter.prevent 
			@drop.prevent="addFiles(Array.from($event.dataTransfer.files))">

			<!-- Upload All -->
			<div class="w-full absolute left-0 right-0 top-8 px-8 flex justify-between has-[>:only-child]:justify-end">
				<button v-if="contentStore.hasDoneUploads"
					@click.stop ="clearDoneUploads"
					class="px-4 py-2 bg-white border border-gray-400 rounded
						text-gray-400 font-bold hover:bg-gray-200 hover:text-gray-700">
					Clear Done
				</button>
				<button v-if="contentStore.hasPendingUploads"
					@click.stop ="uploadAll()"
					class="px-4 py-2 bg-blue-600 font-bold tracking-wide text-white rounded hover:bg-blue-700">
					Upload All
				</button>
			</div>

			<div class="mt-14 sm:mt-0 text-gray-400 h-10 hover:text-black cursor-pointer 
				flex justify-center items-center">
				{{ props.uploadMessage }}
			</div>

			<!-- File List -->
			<div v-if="uploads.length" class="grid gap-3 mt-6" @click.stop >

				<div v-for="(item, index) in uploads" :key="index" 
					class="flex items-start gap-4 p-3 
						border-2 border-dashed border-gray-300 rounded-lg">

					<!-- Image / Icon -->
					<div class="w-14 h-14 flex-shrink-0 bg-amber-200">

						<img v-if="item.preview" :src="item.preview" 
							class="w-full h-full object-cover rounded">

						<div v-else class="w-full h-full flex items-center justify-center
							 bg-gray-100 rounded text-xs">FILE
						</div>

					</div>

					<!-- File Info -->
					<div class="flex-1 overflow-hidden">

						<div class="text-sm font-medium text-wrap break-all">
							{{ item.file.name }}
						</div>

						<div class="text-xs text-gray-500">
							{{ Math.round(item.file.size / 1024) }} KB
						</div>

						<!-- Progress -->
						<div v-if="item.status === 'uploading'" 
							class="mt-2 h-2 bg-gray-200 rounded">
							<div class="h-2 bg-green-500 rounded" :style="{ width: item.progress + '%' }" />
						</div>

						<div v-if="item.status === 'error'" 
							class="text-xs text-red-500">
							{{ item.error }}
						</div>

						<div v-if="item.status === 'done'" 
							class="text-xs font-bold">Done</div>

					</div>

					<!-- Actions -->
					<div class="flex items-end gap-2 h-full w-16 relative">

						<button v-if="item.status !== 'uploading'" 
							@click.stop="removeUpload(index)" 
							class="text-red-500 absolute top-0 right-0 text-sm font-bold">✕
						</button>
						
						<button v-if="item.status === 'pending'" 
							@click.stop="uploadFile(item)" 
							class="text-blue-600 text-sm font-bold">Upload
							<IconSymbol icon="heroicons:document-arrow-up-16-solid" />
						</button>

						<button v-if="item.status === 'uploading'" 
							@click.stop="cancelUpload(item)" 
							class="text-yellow-600 text-sm font-bold">Cancel
						</button>

						<button v-if="item.status === 'error'" 
							@click.stop="retryUpload(item)" 
							class="text-blue-600 text-sm font-bold">Retry
						</button>



					</div>

				</div>

			</div>

			<input ref="fileInput" type="file" multiple class="hidden" 
				:accept @change="addFiles(Array.from($event.target.files))">
		</div>

	</div>
</template>

<style scoped></style>