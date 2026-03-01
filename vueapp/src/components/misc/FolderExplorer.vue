<script setup>

	const rootNodeName = "FolderRoot"

	const tree 			= ref([])
	const newRootFolder = ref("")
	const editingPath 	= ref(null)
	const isEditing 	= computed(() => editingPath.value === "root")
	const selectedPath  = ref("")

	const renamingPath = ref(null)
	provide("folderEditingPath", editingPath)
	provide("folderRenamingPath", renamingPath)

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

	const hasPath = (nodes, targetPath, parentPath = "") =>
	{
		if (!targetPath) return false
		const sourceNodes = Array.isArray(nodes) ? nodes : []

		for (const node of sourceNodes)
		{
			const name = String(node?.name ?? node?.Name ?? "")
			if (!name) continue

			const currentPath = parentPath ? `${parentPath}/${name}` : name
			if (currentPath === targetPath)
				return true

			const children = node?.children ?? node?.Children ?? []
			if (hasPath(children, targetPath, currentPath))
				return true
		}

		return false
	}

	const load = async () =>
	{
		const res = await apiGet("/content/folders")
		tree.value = Array.isArray(res.data) ? res.data : []

		if (selectedPath.value && !hasPath(rootChildren.value, selectedPath.value, rootParentPath.value))
			selectedPath.value = ""
	}

	const addFolder = async (parentPath, name) =>
	{
		const apiParentPath = toApiParentPath(parentPath)
		await apiPost("/content/folders", { parentPath: apiParentPath, name })
		await load()
		selectedPath.value = parentPath + "/" + name
	}

	const renameFolder = async (currentPath, parentPath, oldName, newName) =>
	{
		const trimmed = newName.trim()
		if (!trimmed || trimmed === oldName) return

		const apiParentPath = toApiParentPath(parentPath)
		const oldPathFull   = currentPath
		const newPathFull   = parentPath + "/" + trimmed

		await apiPut("/content/renamefolder", { parentPath: apiParentPath, oldName, newName: trimmed })
		await load()

		if (selectedPath.value === oldPathFull)
			selectedPath.value = newPathFull
		else if (selectedPath.value.startsWith(oldPathFull + "/"))
			selectedPath.value = newPathFull + selectedPath.value.slice(oldPathFull.length)
	}

	const toggleRootEdit = () => editingPath.value = editingPath.value === "root" ? null : "root"

	const addRootFolder = async () =>
	{
		const folderName = newRootFolder.value.trim()
		if (!folderName) return

		await addFolder(rootParentPath.value, folderName)
		newRootFolder.value = ""
		editingPath.value = null
	}

	const cancelEdit = () =>
	{
		newRootFolder.value = ""
		editingPath.value = null
	}

	const displaySelectedPath = computed(() =>
	{
		if (!selectedPath.value) return ""
		const segments = selectedPath.value.split("/").filter(Boolean)
		if (segments.length > 0 && isRootName(segments[0]))
			segments.shift()
		return "/" + segments.join("/")
	})

	const selectFolder = (path) => selectedPath.value = String(path ?? "")

	onMounted(load)
	
</script>

<template>

	<div class="p-4 bg-white w-full">

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
			:node="node" :parent-path="rootParentPath" :selected-path="selectedPath"
			@add="addFolder" @delete="load" @select="selectFolder" @rename="renameFolder" />

	</div> 

</template>