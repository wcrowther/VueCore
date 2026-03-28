
export const useFolderStore = defineStore('FolderStore', () =>
{
	const rootNodeName = "FolderRoot"

	// STATE ------------------------------------------------------------------

	const tree 			= ref([])
	const newRootFolder = ref("")
	const editingPath 	= ref(null)
	const selectedPath 	= ref("")
	const renamingPath 	= ref(null)

	// PRIVATE HELPERS ---------------------------------------------------------

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

	// GETTERS ----------------------------------------------------------------

	const isEditing = computed(() => editingPath.value === "root")

	const rootNode = computed(() =>
	{
		const nodes = Array.isArray(tree.value) ? tree.value : []
		return nodes.find(node =>
		{
			const name = node?.name ?? node?.Name
			return isRootName(name)
		})
	})

	const rootParentPath = computed(() => rootNode.value?.name ?? rootNode.value?.Name ?? rootNodeName)

	const rootChildren = computed(() =>
	{
		if (!rootNode.value)
			return Array.isArray(tree.value) ? tree.value : []

		const children = rootNode.value?.children ?? rootNode.value?.Children ?? []
		return Array.isArray(children) ? children : []
	})

	const displaySelectedPath = computed(() =>
	{
		if (!selectedPath.value) return ""

		const segments = selectedPath.value.split("/").filter(Boolean)
		if (segments.length > 0 && isRootName(segments[0]))
			segments.shift()

		return "/" + segments.join("/")
	})

	// ACTIONS ----------------------------------------------------------------

	const load = async () =>
	{
		const res = await apiGet("/content/folders")
		tree.value = Array.isArray(res.data) ? res.data : []

		if (selectedPath.value && !hasPath(rootChildren.value, selectedPath.value, rootParentPath.value))
			selectedPath.value = ""
	}

	const addFolder = async (parentPath, name) =>
	{
		const trimmedName = String(name ?? "").trim()
		if (!trimmedName) return

		const apiParentPath = toApiParentPath(parentPath)
		await apiPost("/content/folders", { parentPath: apiParentPath, name: trimmedName })
		await load()

		selectedPath.value = `${parentPath}/${trimmedName}`
	}

	const renameFolder = async (currentPath, parentPath, oldName, newName) =>
	{
		const trimmed = String(newName ?? "").trim()
		if (!trimmed || trimmed === oldName) return

		const apiParentPath = toApiParentPath(parentPath)
		const oldPathFull   = currentPath
		const newPathFull   = `${parentPath}/${trimmed}`

		await apiPut("/content/renamefolder", { parentPath: apiParentPath, oldName, newName: trimmed })
		await load()

		if (selectedPath.value === oldPathFull)
			selectedPath.value = newPathFull
		else if (selectedPath.value.startsWith(oldPathFull + "/"))
			selectedPath.value = newPathFull + selectedPath.value.slice(oldPathFull.length)
	}

	const deleteFolder = async (parentPath, name) =>
	{
		const folderName = String(name ?? "").trim()
		if (!folderName) return false

		const apiParentPath = toApiParentPath(parentPath)
		const currentPath = parentPath ? `${parentPath}/${folderName}` : folderName

		const result = await apiDelete("/content/folders", 
		{
			parentPath: apiParentPath,
			name: folderName
		})

		if (!result?.success)
			return false

		await load()

		if (selectedPath.value === currentPath)
			selectedPath.value = ""
		else if (selectedPath.value.startsWith(currentPath + "/"))
			selectedPath.value = ""

		if (editingPath.value && (editingPath.value === currentPath || editingPath.value.startsWith(currentPath + "/")))
			editingPath.value = null

		if (renamingPath.value && (renamingPath.value === currentPath || renamingPath.value.startsWith(currentPath + "/")))
			renamingPath.value = null

		return true
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

	const selectFolder = (path) => selectedPath.value = String(path ?? "")

	// EXPOSE PUBLIC API -------------------------------------------------------

	return {
		// state
		tree,
		newRootFolder,
		editingPath,
		selectedPath,
		renamingPath,

		// getters
		isEditing,
		rootParentPath,
		rootChildren,
		displaySelectedPath,

		// actions
		load,
		addFolder,
		renameFolder,
		deleteFolder,
		toggleRootEdit,
		addRootFolder,
		cancelEdit,
		selectFolder
	}
})
