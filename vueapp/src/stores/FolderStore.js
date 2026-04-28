 import { isRootName, toPathSegments, joinPath, 
		  normalizePath, toApiParentPath, hasPath, 
		  findNodeByPath, hasFilesInSubtree } 		from '@/helpers/fileFolderHelpers'

export const useFolderStore = defineStore('FolderStore', () =>
{
	const rootNodeName = "/"

	// STATE ------------------------------------------------------------------

	const tree 			= ref([])
	const newRootFolder = ref("")
	const editingPath 	= ref(null)
	const selectedPath 	= ref("")
	const renamingPath 	= ref(null)

	// GETTERS ----------------------------------------------------------------

	const rootParentPath = computed(() => rootNodeName)
	const isEditing 	 = computed(() => editingPath.value === "root")

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

	const displaySelectedPath = computed(() =>
	{
		if (!selectedPath.value) return ""

		const segments = toPathSegments(selectedPath.value)
		return "/" + segments.join("/")
	})

	// ACTIONS ----------------------------------------------------------------

	const toggleRootEdit = () => editingPath.value = editingPath.value === "root" ? null : "root"

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
