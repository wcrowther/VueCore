<script setup>

	import { marked } from 'marked'
	const content = ref(`# Markdown Editor
		Type **markdown** here...

		- Supports images
		- Live preview
		`
	)

	const isPreview = ref(false)

	// Render markdown
	const rendered = computed(() => 
	{
		return marked.parse(content.value)
	})

	// Insert helpers
	function wrapSelection(before, after = before) 
	{
		const textarea = document.getElementById('editor')
		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const selected = content.value.substring(start, end)

		content.value = content.value.substring(0, start) + before +
			selected + after + content.value.substring(end)

		textarea.focus()
	}

	function insertImage(url) 
	{
		if (!url) return
		content.value += `\n![image](${url})\n`
	}

	function handleImageUpload(e) 
	{
		const file = e.target.files[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = () => 
		{
			insertImage(reader.result)
		}
		reader.readAsDataURL(file)
	}

	// Drag & drop
	function onDrop(e) 
	{
		e.preventDefault()
		const file = e.dataTransfer.files[0]
		if (!file || !file.type.startsWith('image/')) return

		const reader = new FileReader()
		reader.onload = () => 
		{
			insertImage(reader.result)
		}
		reader.readAsDataURL(file)
	}

	function onDragOver(e) {
		e.preventDefault()
	}
</script>

<template>
	<div class="flex flex-col h-full overflow-hidden">

		<!-- Toolbar -->
		<div class="flex items-center gap-2 p-2 mb-2 border border-gray-200 bg-gray-50">

			<button @click="wrapSelection('**')" class="btnIcon">
				<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:bold" />
			</button>

			<button @click="wrapSelection('*')" class="btnIcon">
				<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:italic-16-solid" />
			</button>

			<button @click="wrapSelection('[', '](url)')" class="btnIcon">
				<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:link-16-solid" />
			</button>

			<label class="btnIcon cursor-pointer">
				<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:photo-16-solid" />
				<input type="file" class="hidden" @change="handleImageUpload" />
			</label>

			<div class="ml-auto flex gap-2">

				<button @click="isPreview = false" 
					class="btnIcon" :class="{ 'bg-gray-200': !isPreview }">
					<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:pencil-16-solid" />
				</button>
				<button  @click="isPreview = true" 
					class="btnIcon" :class="{ 'bg-gray-200': isPreview }">
					<IconSymbol width="16px" class="text-color-dark-gray" icon="heroicons:eye-16-solid" />
				</button>
			</div>
		</div>

		<!-- Body -->
		<div class="flex-1 grid grid-cols-1 md:grid-cols-2">

			<!-- Editor -->
			<div v-show="!isPreview" class="h-full">
				<textarea id="editor" v-model="content" 
					class="w-full h-full p-4 outline-none resize-none font-mono"
					@drop="onDrop" @dragover="onDragOver" />
			</div>

			<!-- Preview -->
			<div v-show="isPreview || true" 
				class="h-full p-4 overflow-auto prose max-w-none border-l"
				v-html="rendered" />
		</div>
	</div>
</template>

<style scoped>
	.btnIcon { @apply flex-center size-8 rounded border border-gray-400 h-8 hover:bg-gray-200 transition;	}
</style>