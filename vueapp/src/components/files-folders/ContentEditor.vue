<script setup>

	const showEditor = defineModel('showEditor', { type: Boolean, default: false })

</script>

<template>

	<PrimaryButton title="Show Editor" @click="showEditor=true" />
	
	<ModalControl v-if="showEditor" v-model="showEditor" :showFooter="false"
		class="pt-1 bg-[#b8d7ed]"  height="500px" width="900px" title="Editor">

	    <TabControl class="mb-10" :tabList="['Content', 'Files', 'Images']" >

        	<template #Content>       
        	    <MarkdownEditor />
        	</template>
			<template #Files>       
    			<UploadControl accept="image/*" class="bg-gradient-main mb-3" />
    			<div class="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 mb-7
    			    border border-gray-400 bg-white">
    			    <FolderExplorer class="lg:border-r border-gray-400" />
    			    <FileExplorer class="" />
    			</div>
        	</template>
        	<template #Images>       
        	    <div class="p-5">
        	        <div class="font-bold text-red mb-3">Image Edit</div>
        	    </div>
        	</template>

    	</TabControl>

	</ModalControl>	

</template>