
import { imageToolbarList } from '@/datalists/imagesToolbarList'

export const useImageStore = defineStore('ImageStore', () =>
{
	const fileStore = useFileStore()

	// STATE ------------------------------------------------------------------

	const activeTool = ref(null)
	const requestedEditorTab = ref('')
	const lastNonImageSelection = ref('')
	const imageCropperSource = useLocalStorage('imageCropperSource', '')
	const toolbarTools = ref(imageToolbarList)

	// GETTERS ----------------------------------------------------------------

	const selectedFileIndex = computed(() =>
	{
		const index = fileStore.lastSelectedIndex
		const total = Array.isArray(fileStore.fileRows) ? fileStore.fileRows.length : 0
		return typeof index === 'number' && index >= 0 && index < total ? index : null
	})

	const selectedFile = computed(() =>
	{
		if (selectedFileIndex.value === null) return null
		return fileStore.fileRows[selectedFileIndex.value] ?? null
	})

	const hasSelection = computed(() => !!selectedFile.value)
	const selectedFileName = computed(() => selectedFile.value?.name ?? '')
	const selectedFileExtension = computed(() => selectedFile.value?.extension ?? '')
	const selectedFileIsImage = computed(() =>
		selectedFile.value ? fileStore.isImageFile(selectedFile.value.extension) : false
	)
	const selectedImageUrl = computed(() =>
		selectedFileIsImage.value ? fileStore.getFileUrl(selectedFile.value) : ''
	)

	// ACTIONS ----------------------------------------------------------------

	const setActiveTool = (toolKey) =>
	{
		const tool = toolbarTools.value.find(item => item.key === toolKey)
		if (!tool || tool.disabled)
			return

		activeTool.value = tool.key
	}

	const clearActiveTool = () =>
	{
		activeTool.value = null
	}

	const requestEditorTab = (tabName) =>
	{
		requestedEditorTab.value = String(tabName ?? '').trim()
	}

	const consumeRequestedEditorTab = () =>
	{
		const nextTab = requestedEditorTab.value
		requestedEditorTab.value = ''
		return nextTab
	}

	const onNonImageFileSelected = (file) =>
	{
		// Placeholder hook: later this can trigger MarkdownEditor navigation.
		lastNonImageSelection.value = file?.name ?? ''
	}

	const onPreviewAreaClick = (file) =>
	{
		if (!file) return

		if (fileStore.isImageFile(file.extension))
		{
			requestEditorTab('Images')
			return
		}

		onNonImageFileSelected(file)
	}

	// EXPOSE PUBLIC API ------------------------------------------------------

	return {
		// state
		activeTool,
		requestedEditorTab,
		lastNonImageSelection,
		imageCropperSource,
		toolbarTools,

		// getters
		selectedFileIndex,
		selectedFile,
		hasSelection,
		selectedFileName,
		selectedFileExtension,
		selectedFileIsImage,
		selectedImageUrl,

		// actions
		setActiveTool,
		clearActiveTool,
		requestEditorTab,
		consumeRequestedEditorTab,
		onNonImageFileSelected,
		onPreviewAreaClick
	}
})
