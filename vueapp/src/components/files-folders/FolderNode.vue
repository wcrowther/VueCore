<script setup>

	const { createConfirm } = useConfirmControl()
		const toastStore = useToastStore()

	const props = defineProps(
	{
		node: Object,
		parentPath: String,
	})

	const folderStore = useFolderStore()
	const { editingPath, renamingPath, selectedPath } = storeToRefs(folderStore)
	const { addFolder, renameFolder, selectFolder, deleteFolder, canDeleteFolder } = folderStore
	const fileStore = useFileStore()
	const { moveSelectedFiles } = fileStore

	const expanded = ref(false)
	const newFolder = ref("")
	const addFolderInput = ref(null)
	const renameName = ref("")
	const isDragOver = ref(false)

	const nodeName 			= computed(() => props.node?.name ?? props.node?.Name ?? '')
	const fileCount			= computed(() => props.node?.FileCount ?? 0)
	const fileCountDisplay	= computed(() => fileCount.value > 0 ? ` (${fileCount.value})` : '')
	const nodeChildren 		= computed(() => 
	{
		const children = props.node?.children ?? props.node?.Children ?? []
		return Array.isArray(children) ? children : []
	})
	const toPathSegments = (path) => String(path ?? "").split("/").filter(Boolean)
	const joinPath = (parentPath, name) =>
	{
		const parentSegments = toPathSegments(parentPath)
		const childName = String(name ?? "").trim()
		if (!childName)
			return parentSegments.length ? `/${parentSegments.join("/")}` : "/"

		return `/${[...parentSegments, childName].join("/")}`
	}
	const isRootFolder 	= computed(() => 
	{
		return nodeName.value === "/"
	})
	const showContent 	= computed(() => expanded.value || (isRootFolder.value && nodeChildren.value.length === 0))
	const currentPath 	= computed(() => 
	{
		return joinPath(props.parentPath, nodeName.value)
	})
	const isEditing = computed(() => editingPath.value === currentPath.value)
	const isRenaming = computed(() => renamingPath.value === currentPath.value)
	const isSelected = computed(() => currentPath.value === selectedPath.value)
	const isParentOfSelected = computed(() =>
	{
		if (!selectedPath.value) return false
		return selectedPath.value.startsWith(currentPath.value + "/")
	})

	const toggle = () => expanded.value = !expanded.value

	let clickTimer = null

	const onNodeClick = () =>
	{
		if (clickTimer)
		{
			clearTimeout(clickTimer)
			clickTimer = null
			return
		}
		clickTimer = setTimeout(() =>
		{
			clickTimer = null
			selectFolder(currentPath.value)
			// If this node is a parent of the selected folder and already expanded,
			// keep it open when switching selection to the parent.
			if (isParentOfSelected.value && expanded.value) return
			toggle()
		}, 250)
	}

	const startRename = () =>
	{
		if (isRootFolder.value) return
		renameName.value = nodeName.value
		renamingPath.value = currentPath.value
	}

	const saveRename = async () =>
	{
		const trimmed = renameName.value.trim()
		if (!trimmed) return
		renamingPath.value = null
		renameName.value = ""
		await renameFolder(currentPath.value, props.parentPath, nodeName.value, trimmed)
	}

	const cancelRename = () =>
	{
		renamingPath.value = null
		renameName.value = ""
	}

	const addChildFolder = async () =>
	{
		if (!newFolder.value) return

		const name = newFolder.value
		newFolder.value = ""
		editingPath.value = null
		await addFolder(currentPath.value, name)
	}

	const cancelEdit = () =>
	{
		newFolder.value = ""
		editingPath.value = null
	}

	watch(selectedPath, (nextSelectedPath) =>
	{
		if (!isEditing.value) return
		if (nextSelectedPath === currentPath.value) return

		cancelEdit()
	})

	watch(() => isEditing.value && isSelected.value, async (shouldFocus) =>
	{
		if (!shouldFocus) return

		await nextTick()
		addFolderInput.value?.focus?.()
	})

	const toggleAddEditor = () =>
	{
		expanded.value = true
		editingPath.value = editingPath.value === currentPath.value ? null : currentPath.value
	}

	const removeFolder = async () =>
	{
		if (isRootFolder.value) return
		if (!canDeleteFolder(props.parentPath, nodeName.value))
		{
			toastStore.showWarning("Cannot delete folder because it contains files (or nested files).")
			return
		}

		const confirmed = await createConfirm(`Delete ${nodeName.value}?`)
		if (!confirmed) return

		await deleteFolder(props.parentPath, nodeName.value)
	}

	const onDragOver = (event) =>
	{
		event.preventDefault()
		isDragOver.value = true
		event.dataTransfer.dropEffect = "move"
	}

	const onDragLeave = () =>
	{
		isDragOver.value = false
	}

	const onDrop = async (event) =>
	{
		event.preventDefault()
		isDragOver.value = false

		const raw = event.dataTransfer?.getData("application/x-vueapp-files")
		if (!raw) return

		let payload = null
		try
		{
			payload = JSON.parse(raw)
		}
		catch
		{
			return
		}

		const fileNames = Array.isArray(payload?.fileNames)
			? payload.fileNames.map(name => String(name ?? "").trim()).filter(Boolean)
			: []

		if (!fileNames.length) return

		const sourcePath = String(payload?.sourcePath ?? "")
		if (!sourcePath || sourcePath === currentPath.value) return

		await moveSelectedFiles(currentPath.value, sourcePath, fileNames)
		expanded.value = true
	}

</script>

<template>

	<div class="ml-3 mb-1">

		<div class="folder-row flex items-center gap-1 py-1"
			:class="isSelected ? 'folder-row-selected text-black' : 'folder-row-unselected'">

			<template v-if="!isRenaming">
				<span class="flex items-center cursor-pointer font-medium select-none rounded px-1"
					:class="[isSelected ? 'text-black' : '', isDragOver ? 'bg-blue-100 border border-blue-400' : '']"
					@click="onNodeClick" @dblclick="startRename"
					@dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
					<IconSymbol width="20px"
						:class="isSelected ? 'text-black mr-2' : 'text-color-mid-blue mr-2'"
						:icon="expanded ? 'fa7-solid:folder-open' : 'fa7-solid:folder'" />
					<div :class="{'font-bold':isSelected}">{{ nodeName }}{{ fileCountDisplay }}</div>
				</span>

				<div v-if="isSelected"
					class="ml-2 text-sm border border-gray-400 size-4 rounded-full flex justify-center items-center" 
					@click="toggleAddEditor">
					<IconSymbol class="text-color-dark-gray" width="20px" icon="heroicons:plus-20-solid" />
				</div>

				<button v-if="isSelected && !isRootFolder" 
					class="text-red-500 p-[2px] text-xs border border-red-500 size-4 rounded-full flex justify-center items-center" 
					@click="removeFolder">
					<IconSymbol class="text-red-500" width="20px" icon="heroicons:x-mark-20-solid" />
				</button>
			</template>

			<template v-else>
				<IconSymbol width="20px"
					class="text-color-mid-blue mr-2 shrink-0"
					:icon="expanded ? 'fa7-solid:folder-open' : 'fa7-solid:folder'" />
				<div class="flex flex-wrap gap-1 items-center">
					<TextInput name="renameFolder" v-model="renameName" hideLabel
						class="ml-[-2px] !mb-0 h-6 pr-1 py-0" placeholder="folder name"
						@keyup.enter="saveRename" @keyup.escape="cancelRename" />
					<PrimaryButton compact @click="saveRename">Save</PrimaryButton>
					<PrimaryButton compact @click="cancelRename">Cancel</PrimaryButton>
				</div>
			</template>

		</div>

		<div v-if="showContent" class="ml-4 border-l border-color-mid-blue pl-3">

			<div v-if="isEditing && isSelected"
				class="flex flex-wrap gap-1 items-center">
					<TextInput ref="addFolderInput" name="addFolder" v-model="newFolder" hideLabel
						class="ml-1 !mb-0 h-6 px-2 py-0" placeholder="new folder" 
						@keyup.enter="addChildFolder" />
					<PrimaryButton compact @click="addChildFolder">Add</PrimaryButton>
					<PrimaryButton compact @click="cancelEdit">Cancel</PrimaryButton>
			</div>

			<!-- children -->
			<FolderNode v-for="child in nodeChildren" :key="child.name ?? child.Name" 
				:node="child" :parent-path="currentPath" />

		</div>

	</div>

</template>

<style scoped></style>