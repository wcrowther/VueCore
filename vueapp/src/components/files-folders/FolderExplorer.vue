<script setup>

	const folderStore 											= useFolderStore()
	const {	newRootFolder, isEditing, selectedPath, 
			rootParentPath, rootChildren,displaySelectedPath } 
																= storeToRefs(folderStore)
	const { load, toggleRootEdit, addRootFolder, cancelEdit } 	= folderStore

	onMounted(load)

</script>

<template>

	<div class="flex">

		<div class="flex-1 border-r border-gray-400 pt-4 px-4 pb-6">

			<h4 class="flex items-center text-xl font-bold mb-3">
				Folder Explorer
				<div class="text-sm ml-[10px] border border-gray-400 size-4
						rounded-full flex justify-center items-center"
					@click="toggleRootEdit">
					<IconSymbol class="text-color-dark-gray" width="20px" icon="heroicons:plus-20-solid" />
				</div>
			</h4>

			<p class="text-color-dark-gray mb-3">
				<span class="font-bold ml-3 mr-1">Path:</span>
				{{ displaySelectedPath ? displaySelectedPath : "none" }}
			</p>

			<!-- add root-level folder -->
			<div v-if="isEditing"
				class="flex flex-wrap items-center gap-1 mb-3">
				<TextInput name="addFolder" v-model="newRootFolder" hideLabel
					class="ml-[2px] !mb-0 h-6 px-2 py-0" placeholder="new folder"
					@keyup.enter="addRootFolder" />
				<PrimaryButton compact @click="addRootFolder">Add</PrimaryButton>
				<PrimaryButton compact @click="cancelEdit">Cancel</PrimaryButton>
			</div>
			
			<FolderNode v-for="(node, idx) in rootChildren"
				:key="(node.name ?? node.Name ?? 'node') + '-' + idx"
				:node="node" :parent-path="rootParentPath" />
		</div>

		<div class="grow bg-white pt-4 px-4 pb-6">
			<slot>
				<FileExplorer :selected-path="selectedPath" />
			</slot>
		</div>

	</div> 

</template>