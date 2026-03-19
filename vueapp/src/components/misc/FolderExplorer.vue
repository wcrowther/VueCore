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

	onMounted(load)
	
</script>

<template>

	<div class="p-4 bg-white w-full max-w-lg">

		<h2 class="text-lg font-bold mb-3">
			Folder Explorer
		</h2>

		<!-- add root-level folder -->
		<div class="mt-2 mb-5 flex gap-1">

			<template v-if="isEditing">

				<input v-model="newRootFolder" placeholder="new folder" 
					class="border px-1 text-sm" @keyup.enter="addRootFolder" />

				<button class="text-xs bg-blue-500 text-white px-2" 
					@click="addRootFolder">Save</button>

				<button class="text-xs bg-gray-400 text-white px-2" 
					@click="() => { isEditing = false; newRootFolder = '' }">Cancel</button>

			</template>

			<button v-else class="text-xs bg-gray-500 text-white px-2" 
				@click="isEditing = true">Edit</button>
		</div>

		<FolderNode v-for="(node, idx) in rootChildren" 
			:key="(node.name ?? node.Name ?? 'node') + '-' + idx" 
			:node="node" :parent-path="rootParentPath" 
			@add="addFolder" @delete="load" />

	</div> 

</template>