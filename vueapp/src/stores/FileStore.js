import { normalizePath } from '@/helpers/fileFolderHelpers'

export const useFileStore = defineStore('FileStore', () =>
{
	// STATE ------------------------------------------------------------------

	const selectedPath = ref('/uploads')
	const files = ref([])
	const isLoading = ref(false)
	const loadError = ref('')
	const selectedFileIndexes = ref([])
	const lastSelectedIndex = ref(null)

	// GETTERS ----------------------------------------------------------------

	const apiFolderPath = computed(() => toApiFolderPath(selectedPath.value))

	const fileRows = computed(() =>
	{
		const source = Array.isArray(files.value) ? files.value : []
		return source.map(file => ({
			name: file?.name ?? file?.Name ?? "",
			extension: file?.extension ?? file?.Extension ?? "",
			size: file?.size ?? file?.Size ?? null,
			lastModified: file?.lastModified ?? file?.LastModified ?? file?.modified ?? file?.Modified ?? null
		}))
	})

	const selectedFileNames = computed(() =>
	{
		const indexes = Array.isArray(selectedFileIndexes.value) ? selectedFileIndexes.value : []
		return indexes
			.map(idx => fileRows.value[idx]?.name)
			.filter(name => !!name)
	})

	// ACTIONS ----------------------------------------------------------------

	const setSelectedPath = async (path) =>
	{
		selectedPath.value = normalizePath(path)
		clearSelection()
		await loadFiles()
	}

	const clearSelection = () =>
	{
		selectedFileIndexes.value = []
		lastSelectedIndex.value = null
	}

	const selectSingleIndex = (index) =>
	{
		selectedFileIndexes.value = [index]
		lastSelectedIndex.value = index
	}

	const selectFileIndex = (index, shiftKey = false) =>
	{
		const total = fileRows.value.length
		if (index < 0 || index >= total) return

		if (!shiftKey || lastSelectedIndex.value === null)
		{
			selectSingleIndex(index)
			return
		}

		const start = Math.min(lastSelectedIndex.value, index)
		const end = Math.max(lastSelectedIndex.value, index)
		selectedFileIndexes.value = Array.from({ length: end - start + 1 }, (_, i) => start + i)
	}

	const loadFiles = async () =>
	{
		loadError.value = ""
		clearSelection()

		if (!selectedPath.value || !apiFolderPath.value)
		{
			files.value = []
			return
		}

		isLoading.value = true
		try
		{
			const result = await apiGet(`/content/files/${encodeURIComponent(apiFolderPath.value)}`)
			files.value = Array.isArray(result.data) ? result.data : []
		}
		catch (error)
		{
			files.value = []
			loadError.value = error?.message ?? "Failed to load files."
		}
		finally
		{
			isLoading.value = false
		}
	}

	const deleteFile = async (fileName) =>
	{
		if (!fileName || !apiFolderPath.value) return { success: false, message: "Invalid delete request." }

		const result = await apiDelete("/content/files",
		{
			folderPath: apiFolderPath.value,
			fileNames: [fileName]
		})

		if (result?.success !== false)
			await loadFiles()

		return result
	}

	const moveSelectedFiles = async (targetFolderPath, sourceFolderPath = selectedPath.value, explicitFileNames = null) =>
	{
		const names = Array.isArray(explicitFileNames)
			? explicitFileNames.map(name => String(name ?? "").trim()).filter(Boolean)
			: selectedFileNames.value
		if (!names.length) return { success: false, message: "No files selected." }

		const normalizedSource = normalizePath(sourceFolderPath)
		const normalizedTarget = normalizePath(targetFolderPath)
		if (!normalizedSource || !normalizedTarget || normalizedSource === normalizedTarget)
			return { success: false, message: "Invalid move request." }

		const result = await apiPost("/content/movefiles", {
			sourcePath: toApiFolderPath(normalizedSource),
			targetPath: toApiFolderPath(normalizedTarget),
			fileNames: names
		})

		if (!result?.success)
			return result

		// Refresh folder counts and visible lists impacted by the move.
		const folderStore = useFolderStore()
		await folderStore.load()

		if (selectedPath.value === normalizedSource || selectedPath.value === normalizedTarget)
			await loadFiles()

		clearSelection()
		return result
	}

	// EXPOSE PUBLIC API -------------------------------------------------------

	return {
		// state
		selectedPath,
		files,
		isLoading,
		loadError,
		selectedFileIndexes,
		lastSelectedIndex,

		// getters
		apiFolderPath,
		fileRows,
		selectedFileNames,

		// actions
		setSelectedPath,
		clearSelection,
		selectFileIndex,
		loadFiles,
		deleteFile,
		moveSelectedFiles
	}
})
