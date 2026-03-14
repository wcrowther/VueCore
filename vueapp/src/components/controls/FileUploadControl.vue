<script setup>

	import axios from "axios"

	const props = defineProps(
	{
		url: { type: String, required: true },
		maxSizeMB: { type: Number, default: 10 },
		accept: { type: String, default: "*" }
	})

	const emit = defineEmits(["uploaded", "error"])

	const fileInput = ref(null)
	const uploads = ref([])

	const openDialog 	= ()  => fileInput.value.click()
	const prevent 		= (e) => e.preventDefault()
	const onDrop 		= (e) => 
	{
		// console.log('OnDrop', e.dataTransfer.files)
		prevent(e)
		addFiles(Array.from(e.dataTransfer.files))
	}
	const onSelect 		= (e) => addFiles(Array.from(e.target.files))
	const addFiles 		= (files) =>
	{
		files.forEach(file => 
		{
			if (file.size > props.maxSizeMB * 1024 * 1024) 
			{
				uploads.value.push({ file, status: "error", error: "File too large" })
				return
			}

			const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null
			uploads.value.push({ file, preview, progress: 0, 
				status: "pending", cancelSource: null })
		})
	}
	const uploadFile = async (item) =>
	{
		const form = new FormData()
		form.append("file", item.file)

		//const source 		= axios.CancelToken.source()
		//item.cancelSource 	= source
		item.status 		= "uploading"

		try 
		{
			const result = await apiFormPost(props.url, form, (pct) => item.progress = pct)

			// const res = await axios.post(saveToUrl, form, 
			// {
			// 	cancelToken: source.token,
			// 	onUploadProgress(e) 
			// 	{
			// 		item.progress = Math.round((e.loaded * 100) / e.total)
			// 	}
			// })

			item.status = "done"
			emit("uploaded", result.data)
		} 
		catch (err) 
		{
			if (axios.isCancel(err)) 
			{
				item.status = "cancelled"
			} 
			else 
			{
				item.status = "error"
				item.error = err.message
				emit("error", err)
			}
		}
	}
	const uploadAll = () =>
	{
		uploads.value
			.filter(f => f.status === "pending")
			.forEach(uploadFile)
	}
	const cancel 	= (item) => item.cancelSource?.cancel()
	const retry 	= (item) =>
	{
		item.progress = 0
		item.status = "pending"
		uploadFile(item)
	}
	const remove = (index) => uploads.value.splice(index, 1)

</script>

<template>
	<div class="w-full">

		<!-- Drop Zone -->
		<div class="border-2 border-dashed border-gray-500 rounded-lg p-8 text-center cursor-pointer
            hover:bg-gray-50 transition" @click="openDialog" 
			@dragover="prevent" @dragenter="prevent" @drop="onDrop">
			<p class="text-gray-400">
				Drag files here or click to upload
			</p>

			<input ref="fileInput" type="file" multiple class="hidden" :accept="accept" @change="onSelect">
		</div>

		<!-- File List -->
		<div v-if="uploads.length" class="grid lg:grid-cols-2 2xl:grid-cols-3 gap-3 mt-6">

			<div v-for="(item, index) in uploads" :key="index" 
				class="flex items-center gap-4 p-3 
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

				</div>

				<!-- Actions -->
				<div class="flex gap-2">

					<button v-if="item.status === 'pending'" @click="uploadFile(item)" 
						class="text-blue-600 text-sm font-bold">Upload
					</button>

					<button v-if="item.status === 'uploading'" @click="cancel(item)" 
						class="text-yellow-600 text-sm font-bold">Cancel
					</button>

					<button v-if="item.status === 'error'" @click="retry(item)" 
						class="text-blue-600 text-sm font-bold">Retry
					</button>

					<button v-if="item.status !== 'uploading'" @click="remove(index)" 
						class="text-red-500 text-sm font-bold">✕
					</button>

				</div>

			</div>

		</div>

		<!-- Upload All -->
		<button v-if="uploads.some(f => f.status === 'pending')" @click="uploadAll"
			class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
			Upload All
		</button>

	</div>
</template>

<style scoped></style>