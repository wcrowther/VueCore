<script setup>

	const contentStore 			= useContentStore()
	const { uploads }  			= storeToRefs(contentStore)
	const {
		clearDoneUploads,
		addFiles,
		uploadFile,
		uploadAll,
		cancelUpload,
		retryUpload,
		removeUpload
	} 							= contentStore

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
		<div class="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer
            hover:bg-gray-50 transition" @click="openDialog" 
			@dragover.prevent @dragenter.prevent @drop.prevent="addFiles(Array.from($event.dataTransfer.files))">
			<p class="text-gray-400">
				{{ props.uploadMessage }}
			</p>

			<input ref="fileInput" type="file" multiple class="hidden" 
				:accept @change="addFiles(Array.from($event.target.files))">
		</div>

		<div class="flex gap-3">
			<!-- Upload All -->
			<button v-if="contentStore.hasPendingUploads"
				@click="uploadAll()"
				class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
				Upload All
			</button>
			<button v-if="contentStore.hasDoneUploads"
				@click="clearDoneUploads"
				class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
				Clear Done
			</button>
		</div>

		<!-- File List -->
		<div v-if="uploads.length" class="grid  gap-3 mt-6">

			<div v-for="(item, index) in uploads" :key="index" 
				class="flex items-start gap-4 p-3 
					border border-gray-500 rounded-lg">

				<!-- Preview -->
				<div class="w-14 h-14 flex-shrink-0">

					<img v-if="item.preview" :src="item.preview" 
						class="w-full h-full object-cover rounded">

					<div v-else class="w-full h-full flex items-center justify-center
						 bg-gray-100 rounded text-xs">FILE
					</div>

				</div>

				<!-- File Info -->
				<div class="flex-1">

					<div class="text-sm font-medium">
						{{ item.file.name }}
					</div>

					<div class="text-xs text-gray-500">
						{{ Math.round(item.file.size / 1024) }} KB
					</div>

					<!-- Progress -->
					<div v-if="item.status === 'uploading'" class="mt-2 h-2 bg-gray-200 rounded">
						<div class="h-2 bg-green-500 rounded" :style="{ width: item.progress + '%' }" />
					</div>

					<div v-if="item.status === 'error'" class="text-xs text-red-500">
						{{ item.error }}
					</div>

					<div v-if="item.status === 'done'" class="text-xs font-bold text-green-500">Done</div>

				</div>

				<!-- Actions -->
				<div class="flex gap-2">

					<button v-if="item.status === 'pending'" @click="uploadFile(item)" 
						class="text-blue-600 text-sm font-bold">Upload
					</button>

					<button v-if="item.status === 'uploading'" @click="cancelUpload(item)" 
						class="text-yellow-600 text-sm font-bold">Cancel
					</button>

					<button v-if="item.status === 'error'" @click="retryUpload(item)" 
						class="text-blue-600 text-sm font-bold">Retry
					</button>

					<button v-if="item.status !== 'uploading'" @click="removeUpload(index)" 
						class="text-red-500 text-sm font-bold">✕
					</button>

				</div>

			</div>

		</div>

	</div>
</template>

<style scoped></style>