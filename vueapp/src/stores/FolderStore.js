
export const useFolderStore = defineStore('FolderStore', () =>
{
	const rootNodeName = "/"

	// STATE ------------------------------------------------------------------

	const tree 			= ref([])
	const newRootFolder = ref("")
	const editingPath 	= ref(null)
	const selectedPath 	= ref("")
	const renamingPath 	= ref(null)

	// PRIVATE HELPERS ---------------------------------------------------------

	const isRootName = (value) => String(value ?? "").trim() === "/"

	const toPathSegments = (path) =>
	{
		const rawPath = String(path ?? "").trim()
		if (!rawPath || rawPath === "/") return []

		return rawPath.split("/").filter(Boolean)
	}

	const joinPath = (parentPath, name) =>
	{
		const parentSegments = toPathSegments(parentPath)
		const childName = String(name ?? "").trim()
		if (!childName)
			return parentSegments.length ? `/${parentSegments.join("/")}` : "/"

		return `/${[...parentSegments, childName].join("/")}`
	}

	const normalizePath = (path) =>
	{
		const segments = toPathSegments(path)
		return segments.length ? `/${segments.join("/")}` : "/"
	}

	const toApiParentPath = (path) =>
	{
		return toPathSegments(path).join("/")
	}

	const hasPath = (nodes, targetPath, parentPath = "/") =>
	{
		if (!targetPath) return false
		const normalizedTargetPath = normalizePath(targetPath)
		const sourceNodes = Array.isArray(nodes) ? nodes : []

		for (const node of sourceNodes)
		{
			const name = String(node?.name ?? node?.Name ?? "")
			if (!name) continue

			const currentPath = joinPath(parentPath, name)
			if (currentPath === normalizedTargetPath)
				return true

			const children = node?.children ?? node?.Children ?? []
			
			if (hasPath(children, targetPath, currentPath))
				return true
		}

		return false
	}

	const findNodeByPath = (nodes, targetPath, parentPath = "/") =>
	{
		if (!targetPath) return null

		const normalizedTargetPath = normalizePath(targetPath)
		const sourceNodes = Array.isArray(nodes) ? nodes : []

		for (const node of sourceNodes)
		{
			const name = String(node?.name ?? node?.Name ?? "")
			if (!name) continue

			const currentPath = joinPath(parentPath, name)
			if (currentPath === normalizedTargetPath)
				return node

			const children = node?.children ?? node?.Children ?? []
			const foundNode = findNodeByPath(children, normalizedTargetPath, currentPath)
			if (foundNode)
				return foundNode
		}

		return null
	}

	const hasFilesInSubtree = (node) =>
	{
		if (!node) return false

		const directFileCount = Number(node?.FileCount ?? node?.fileCount ?? 0)
		if (directFileCount > 0)
			return true

		const children = node?.children ?? node?.Children ?? []
		for (const child of Array.isArray(children) ? children : [])
		{
			if (hasFilesInSubtree(child))
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

	const rootParentPath = computed(() => rootNodeName)

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

		const segments = toPathSegments(selectedPath.value)
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

		selectedPath.value = joinPath(parentPath, trimmedName)
	}

	const renameFolder = async (currentPath, parentPath, oldName, newName) =>
	{
		const trimmed = String(newName ?? "").trim()
		if (!trimmed || trimmed === oldName) return

		const apiParentPath = toApiParentPath(parentPath)
		const oldPathFull   = normalizePath(currentPath)
		const newPathFull   = joinPath(parentPath, trimmed)

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
		const currentPath = joinPath(parentPath, folderName)
		const nodeToDelete = findNodeByPath(rootChildren.value, currentPath, rootParentPath.value)

		if (nodeToDelete && hasFilesInSubtree(nodeToDelete))
			return false

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

	const canDeleteFolder = (parentPath, name) =>
	{
		const folderName = String(name ?? "").trim()
		if (!folderName) return false

		const currentPath = joinPath(parentPath, folderName)
		const nodeToDelete = findNodeByPath(rootChildren.value, currentPath, rootParentPath.value)
		if (!nodeToDelete) return false

		return !hasFilesInSubtree(nodeToDelete)
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

	const selectFolder = (path) => selectedPath.value = normalizePath(path)

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
		canDeleteFolder,
		toggleRootEdit,
		addRootFolder,
		cancelEdit,
		selectFolder
	}
})
