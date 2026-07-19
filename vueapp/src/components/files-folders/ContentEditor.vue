<script setup>

	const showEditor = defineModel('showEditor', { type: Boolean, default: false })
	const props = defineProps(
	{
		height: { type: String, default: '500px' },
		width:  { type: String, default: '900px' },
	})
	const imageStore = useImageStore()
	const { requestedEditorTab } = storeToRefs(imageStore)
	const { consumeRequestedEditorTab } = imageStore

	const activeEditorTab = ref('Files')

	watch(showEditor, (isOpen) =>
	{
		if (!isOpen) activeEditorTab.value = 'Files'
	})

	watch(requestedEditorTab, () =>
	{
		if (!showEditor.value) return

		const nextTab = consumeRequestedEditorTab()
		if (!nextTab) return

		activeEditorTab.value = nextTab
	})

</script>

<template>

	<PrimaryButton title="Show Editor" @click="showEditor=true" />
	
	<ModalControl v-if="showEditor" v-model="showEditor" :showFooter="false"
		class="pt-1 bg-[#b8d7ed] !overflow-hidden" :height="props.height" :width="props.width" title="Editor">

	    <TabsControl v-model:activeTab="activeEditorTab"
			class="mb-10" :tabList="['Files', 'Images', 'Content']" >
			<template #Files>       
    			<UploadControl accept="image/*" class="bg-gradient-main mb-3" />
    			<div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 mb-7
    			    border border-gray-400 bg-white">
    			    <FolderExplorer class="lg:border-r border-gray-400" />
    			    <FileExplorer class="border-t border-gray-400 lg:border-none" />
    			</div>
        	</template>
        	<template #Images>       
        	    <ImageEditor />
        	</template>
			<template #Content>       
        	    <MarkdownEditor />
        	</template>

    	</TabsControl>

	</ModalControl>	

</template>