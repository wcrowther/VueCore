<script setup>

	const props = defineProps({
		selectedPath: {
			type: String,
			default: ""
		}
	})

	const files = ref([])
	const isLoading = ref(false)

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

	const currentFolderPath = computed(() => String(props.selectedPath ?? ""))
	const apiFolderPath = computed(() => toApiParentPath(currentFolderPath.value))
	const displaySelectedPath = computed(() =>
	{
		if (!currentFolderPath.value) return ""
		const normalizedPath = apiFolderPath.value
		return normalizedPath ? `/${normalizedPath}` : "/"
	})

	const formatSize = (value) =>
	{
		const bytes = Number(value)
		if (!Number.isFinite(bytes) || bytes < 0) return "-"
		if (bytes < 1024) return `${bytes} B`

		const kb = bytes / 1024
		if (kb < 1024) return `${kb.toFixed(1)} KB`

		const mb = kb / 1024
		if (mb < 1024) return `${mb.toFixed(1)} MB`

		const gb = mb / 1024
		return `${gb.toFixed(1)} GB`
	}

	const formatDate = (value) =>
	{
		if (!value) return "-"
		const parsed = new Date(value)
		if (Number.isNaN(parsed.getTime())) return "-"

		return parsed.toLocaleString()
	}

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

	const loadFiles = async () =>
	{
		if (!currentFolderPath.value || !apiFolderPath.value)
		{
			files.value = []
			return
		}

		isLoading.value = true
		const result = await apiGet(`/content/files/${encodeURIComponent(apiFolderPath.value)}`)
		files.value = Array.isArray(result.data) ? result.data : []
		isLoading.value = false
	}

	watch(() => props.selectedPath, loadFiles, { immediate: true })

</script>

<template>

	<div>
		<div v-if="!selectedPath" class="text-color-dark-gray pt-4 px-4">
			Select a folder to view files.
		</div>

		<div v-else-if="isLoading" class="text-color-dark-gray pt-4 px-4">
			Loading files...
		</div>

		<div v-else-if="fileRows.length === 0" class="text-color-dark-gray pt-4 px-4">
			No files found in this folder.
		</div>

		<div v-else class="overflow-x-auto">
			<table class="min-w-full text-sm">
				<thead class="bg-gray-100">
					<tr>
						<th class="text-left pl-6 pr-3 py-2 border-b border-gray-300">Name</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Extension</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Size</th>
						<th class="text-left px-3 py-2 border-b border-gray-300">Last Modified</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(file, idx) in fileRows"
						:key="`${file.name}-${idx}`"
						class="odd:bg-white even:bg-gray-50">
						<td class="pl-6 px-3 py-2 border-b border-gray-200">{{ file.name || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ file.extension || "-" }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ formatSize(file.size) }}</td>
						<td class="px-3 py-2 border-b border-gray-200">{{ formatDate(file.lastModified) }}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

</template>

<style scoped></style>