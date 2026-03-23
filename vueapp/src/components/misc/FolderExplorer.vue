<script setup>

	const rootNodeName = "FolderRoot"

	const tree 			= ref([])
	const newRootFolder = ref("")
	const isEditing 	= ref(false)

	const normalized = (value) => String(value ?? "").toLowerCase().replace(/[\s_-]/g, "")
	const isRootName = (value) =>
	{
		const normalizedName = normalized(value)
		return normalizedName === "rootfolder" || normalizedName === "folderroot"
	}

	const toApiParentPath = (path) =>
	{
		const rawPath = String(path ?? "").trim()
		if (!rawPath) return ""

		const segments = rawPath.split("/").filter(Boolean)
		if (segments.length === 0) return ""

		if (isRootName(segments[0]))
			segments.shift()

		return segments.join("/")
	}

	const rootParentPath = computed(() => rootNode.value?.name ?? rootNode.value?.Name ?? rootNodeName)

	const rootNode = computed(() =>
	{
		const nodes = Array.isArray(tree.value) ? tree.value : []
		return nodes.find(node => 
		{
			const name = node?.name ?? node?.Name
			return isRootName(name)
		})
	})

	const rootChildren = computed(() =>
	{
		if (!rootNode.value)
			return Array.isArray(tree.value) ? tree.value : []

		const children = rootNode.value?.children ?? rootNode.value?.Children ?? []
		return Array.isArray(children) ? children : []
	})

	const load = async () =>
	{
		const res = await apiGet("/content/folders")
		tree.value = Array.isArray(res.data) ? res.data : []
	}

	const addFolder = async (parentPath, name) =>
	{
		const apiParentPath = toApiParentPath(parentPath)
		await apiPost("/content/folders", { parentPath: apiParentPath, name })
		await load()
	}

	const addRootFolder = async () =>
	{
		const folderName = newRootFolder.value.trim()
		if (!folderName) return

		await addFolder(rootParentPath.value, folderName)
		newRootFolder.value = ""
		isEditing.value = false
	}

	const cancelEdit = () =>
	{
		newRootFolder.value = ""
		isEditing.value = false
	}

	onMounted(load)
	
</script>

<template>

	<div class="p-4 bg-white w-full">

		<h2 class="flex items-center text-lg font-bold mb-3">
			Folder Explorer
			<div class="text-sm ml-[10px] border border-gray-400 size-4
					rounded-full flex justify-center items-center"
				@click="isEditing=!isEditing">
				<IconSymbol class="text-color-dark-gray" width="20px" icon="heroicons:plus-20-solid" />
			</div>
		</h2>

		<!-- add root-level folder -->
		<div v-if="isEditing"
			class="flex flex-wrap items-center gap-1 mb-3">

			<TextInput name="addFolder" v-model="newRootFolder" hideLabel
				class="ml-[2px] !mb-0 h-6 px-2 py-0" placeholder="new folder" 
				@keyup.enter="addRootFolder" />
			<PrimaryButton compact @click="addRootFolder">Add Folder</PrimaryButton>
			<PrimaryButton compact @click="cancelEdit">Cancel</PrimaryButton>
		</div>

		<FolderNode v-for="(node, idx) in rootChildren" 
			:key="(node.name ?? node.Name ?? 'node') + '-' + idx" 
			:node="node" :parent-path="rootParentPath" 
			@add="addFolder" @delete="load" />

	</div> 

</template>