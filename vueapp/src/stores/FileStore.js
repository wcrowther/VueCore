export const useFileStore = defineStore('FileStore', () =>
{
	// STATE ------------------------------------------------------------------

	const selectedPath = ref("")
	const files = ref([])
	const isLoading = ref(false)
	const loadError = ref("")

	// PRIVATE HELPERS ---------------------------------------------------------

	const toPathSegments = (path) =>
	{
		const rawPath = String(path ?? "").trim()
		if (!rawPath || rawPath === "/") return []

		return rawPath.split("/").filter(Boolean)
	}

	const normalizePath = (path) =>
	{
		const segments = toPathSegments(path)
		return segments.length ? `/${segments.join("/")}` : ""
	}

	const toApiFolderPath = (path) => toPathSegments(path).join("/")

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

	// ACTIONS ----------------------------------------------------------------

	const setSelectedPath = async (path) =>
	{
		selectedPath.value = normalizePath(path)
		await loadFiles()
	}

	const loadFiles = async () =>
	{
		loadError.value = ""

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

	// EXPOSE PUBLIC API -------------------------------------------------------

	return {
		// state
		selectedPath,
		files,
		isLoading,
		loadError,

		// getters
		apiFolderPath,
		fileRows,

		// actions
		setSelectedPath,
		loadFiles
	}
})
