export const useFileStore = defineStore('FileStore', () =>
{
	const folderStore 	= useFolderStore()
	const appStore 		= useAppStore()

	// const { selectedFolder }      = storeToRefs(folderStore)

	// STATE ------------------------------------------------------------------

	const files 				= ref([])
	const isLoadingFile 		= ref(false)
	const fileLoadError 		= ref('')
	const selectedFileIndexes 	= ref([])
	const lastSelectedIndex 	= ref(null)
	const fileThumbnailSize 	= useLocalStorage('fileThumbnailSize', 100)
	const useFileThumbnail 		= useLocalStorage('useFileThumbnail', false)

	// GETTERS ----------------------------------------------------------------

	const apiFolderPath = computed(() => toApiFolderPath(folderStore.selectedFolder))
	const selectedFolder = computed(() => folderStore.selectedFolder)

	const fileRows = computed(() =>
	{
		const source = Array.isArray(files.value) ? files.value : []
		return source.map(file => (
		{
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

	const selectedIndexes = computed(() =>
		Array.isArray(selectedFileIndexes.value) ? selectedFileIndexes.value : []
	)

	const selectedIndexSet = computed(() => new Set(selectedIndexes.value))

	const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'])
	const isImageFile = (ext) => imageExtensions.has((ext ?? '').toLowerCase())
	const getFileUrl  = (file) => `${appStore.baseApiUrl}/content/file/${toApiFolderPath(selectedFolder.value)}/${encodeURIComponent(file.name)}`

	// ACTIONS ----------------------------------------------------------------

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

	const toggleSelectedIndex = (index) =>
	{
		const currentIndexes = Array.isArray(selectedFileIndexes.value)
			? [...selectedFileIndexes.value]
			: []
		const existingIndex = currentIndexes.indexOf(index)

		if (existingIndex >= 0)
			currentIndexes.splice(existingIndex, 1)
		else
			currentIndexes.push(index)

		selectedFileIndexes.value = currentIndexes.sort((left, right) => left - right)
		lastSelectedIndex.value = index
	}

	const selectFileIndex = (index, options = {}) =>
	{
		const { shiftKey = false, metaKey = false, ctrlKey = false } = options
		const total = fileRows.value.length
		if (index < 0 || index >= total) return
		const currentIndexes = Array.isArray(selectedFileIndexes.value)
			? selectedFileIndexes.value
			: []

		if (metaKey || ctrlKey)
		{
			toggleSelectedIndex(index)
			return
		}

		if (!shiftKey || lastSelectedIndex.value === null)
		{
			if (currentIndexes.length === 1 && currentIndexes[0] === index)
			{
				clearSelection()
				return
			}

			selectSingleIndex(index)
			return
		}

		const start = Math.min(lastSelectedIndex.value, index)
		const end = Math.max(lastSelectedIndex.value, index)
		selectedFileIndexes.value = Array.from({ length: end - start + 1 }, (_, i) => start + i)
		lastSelectedIndex.value = index
	}

	const handleFileClick = (index, event) =>
	{
		selectFileIndex(index,
		{
			shiftKey: !!event?.shiftKey,
			metaKey: !!event?.metaKey,
			ctrlKey: !!event?.ctrlKey
		})
	}

	const startFileDrag = (index, file, event) =>
	{
		if (!selectedIndexSet.value.has(index))
			selectFileIndex(index)

		const names = selectedIndexes.value
			.map(idx => fileRows.value[idx]?.name)
			.filter(name => !!name)

		const payload = {
			sourcePath: selectedFolder.value,
			fileNames: names
		}

		event.dataTransfer.effectAllowed = "move"
		event.dataTransfer.setData("application/x-vueapp-files", JSON.stringify(payload))
		event.dataTransfer.setData("text/plain", file?.name || "")
	}

	const loadFiles = async () =>
	{
		fileLoadError.value = ""
		clearSelection()
		files.value = []

		if (!folderStore.selectedFolder || !apiFolderPath.value)
			return

		isLoadingFile.value = true
		try
		{
			const result = await apiGet(`/content/files/${encodeURIComponent(apiFolderPath.value)}`)
			files.value = Array.isArray(result.data) ? result.data : []
		}
		catch (error)
		{
			files.value = []
			fileLoadError.value = error?.message ?? "Failed to load files."
		}
		finally
		{
			isLoadingFile.value = false
		}
	}

	watch(() => folderStore.selectedFolder, () =>
	{
		clearSelection()
		loadFiles()
	}, { immediate: true })

	const refresh = async () =>
	{
		await loadFiles()
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

	const moveSelectedFiles = async (targetFolderPath, sourceFolderPath = folderStore.selectedFolder, explicitFileNames = null) =>
	{
		const names = Array.isArray(explicitFileNames)
			? explicitFileNames.map(name => String(name ?? "").trim()).filter(Boolean)
			: selectedFileNames.value

		if (!names.length) 
			return { success: false, message: "No files selected." }

		const normalizedSource = normalizePath(sourceFolderPath)
		const normalizedTarget = normalizePath(targetFolderPath)
		
		if (!normalizedSource || !normalizedTarget || normalizedSource === normalizedTarget)
			return { success: false, message: "Invalid move request." }

		const result = await apiPost("/content/movefiles", {
			sourcePath: toApiFolderPath(normalizedSource),
			targetPath: toApiFolderPath(normalizedTarget),
			fileNames: names
		})
		const moveData = result?.data ?? {}
		const moveSucceeded = moveData?.Success ?? moveData?.success ?? false
		const failedFiles = Array.isArray(moveData?.FailedFiles)
			? moveData.FailedFiles
			: Array.isArray(moveData?.failedFiles)
				? moveData.failedFiles
				: []
		const firstFailure = failedFiles[0] ?? null
		const normalizedResult = {
			success: moveSucceeded,
			message: firstFailure?.reason ?? firstFailure?.Reason ?? result?.message ?? "Unable to move the selected files.",
			movedCount: moveData?.MovedCount ?? moveData?.movedCount ?? 0,
			failedFiles,
			data: moveData
		}

		if (!normalizedResult.success)
			return normalizedResult

		// Refresh folder counts and visible lists impacted by the move.
		await folderStore.load()

		if (folderStore.selectedFolder === normalizedSource || folderStore.selectedFolder === normalizedTarget)
			await loadFiles()

		clearSelection()
		return normalizedResult
	}

	// EXPOSE PUBLIC API -------------------------------------------------------

	return {
		// state
		selectedFolder,
		files,
		isLoadingFile,
		fileLoadError,
		selectedFileIndexes,
		lastSelectedIndex,
		fileThumbnailSize,
		useFileThumbnail,

		// getters
		apiFolderPath,
		fileRows,
		selectedFileNames,
		selectedIndexes,
		selectedIndexSet,
		isImageFile,
		getFileUrl,

		// actions
		clearSelection,
		selectFileIndex,
		handleFileClick,
		startFileDrag,
		loadFiles,
		refresh,
		deleteFile,
		moveSelectedFiles
	}
})
