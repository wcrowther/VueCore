<script setup>

	import { useConfirmControl } from "@/composables/UseConfirmControl"

	const { createConfirm } = useConfirmControl()

	const props = defineProps({
		node: Object,
		parentPath: String,
		selectedPath: String
	})

	const emit = defineEmits(["add", "delete", "select", "rename"])

	const expanded = ref(false)
	const newFolder = ref("")
	const addFolderInput = ref(null)
	const editingPath = inject("folderEditingPath", ref(null))
	const renamingPath = inject("folderRenamingPath", ref(null))
	const renameName = ref("")


	const nodeName 		= computed(() => props.node?.name ?? props.node?.Name ?? "")
	const nodeChildren 	= computed(() => 
	{
		const children = props.node?.children ?? props.node?.Children ?? []
		return Array.isArray(children) ? children : []
	})
	const normalizedNodeName = computed(() => nodeName.value.toLowerCase().replace(/[\s_-]/g, ""))
	const normalizedParentPath = computed(() =>
	{
		const rawPath = String(props.parentPath ?? "").trim()
		if (!rawPath) return ""

		const segments = rawPath.split("/").filter(Boolean)
		if (segments.length === 0) return ""

		const firstSegment = segments[0].toLowerCase().replace(/[\s_-]/g, "")
		if (firstSegment === "rootfolder" || firstSegment === "folderroot")
			segments.shift()

		return segments.join("/")
	})
	const isRootFolder 	= computed(() => 
	{
		return normalizedNodeName.value === "rootfolder" || normalizedNodeName.value === "folderroot"
	})
	const showContent 	= computed(() => expanded.value || (isRootFolder.value && nodeChildren.value.length === 0))
	const currentPath 	= computed(() => 
	{
		if (!props.parentPath) return nodeName.value
		return props.parentPath + "/" + nodeName.value
	})
	const isEditing = computed(() => editingPath.value === currentPath.value)
	const isRenaming = computed(() => renamingPath.value === currentPath.value)
	const isSelected = computed(() => currentPath.value === props.selectedPath)
	const isParentOfSelected = computed(() =>
	{
		const selected = String(props.selectedPath ?? "")
		if (!selected) return false
		return selected.startsWith(currentPath.value + "/")
	})

	const toggle = () => expanded.value = !expanded.value
	const selectNode = () => emit("select", currentPath.value)

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
			selectNode()
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

	const saveRename = () =>
	{
		const trimmed = renameName.value.trim()
		if (!trimmed) return
		emit("rename", currentPath.value, props.parentPath, nodeName.value, trimmed)
		renamingPath.value = null
		renameName.value = ""
	}

	const cancelRename = () =>
	{
		renamingPath.value = null
		renameName.value = ""
	}

	const addFolder = () =>
	{
		if (!newFolder.value) return

		emit("add", currentPath.value, newFolder.value)
		newFolder.value = ""
		editingPath.value = null
	}

	const cancelEdit = () =>
	{
		newFolder.value = ""
		editingPath.value = null
	}

	watch(() => props.selectedPath, (nextSelectedPath) =>
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

		const confirmed = await createConfirm(`Delete ${nodeName.value}?`)
		if (!confirmed) return

		const result = await apiDelete("/content/folders", {
			parentPath: normalizedParentPath.value,
			name: nodeName.value
		})

		if (result.success)
			emit("delete")
	}

</script>

<template>

	<div class="ml-3 mb-1">

		<div class="folder-row flex items-center gap-1 py-1"
			:class="isSelected ? 'folder-row-selected text-black' : 'folder-row-unselected'">

			<template v-if="!isRenaming">
				<span class="flex items-center cursor-pointer font-medium select-none"
					:class="isSelected ? 'text-black' : ''"
					@click="onNodeClick"
					@dblclick="startRename">
					<IconSymbol width="20px"
						:class="isSelected ? 'text-black mr-2' : 'text-color-mid-blue mr-2'"
						:icon="expanded ? 'fa7-solid:folder-open' : 'fa7-solid:folder'" />
					{{ nodeName }}
				</span>

				<div v-if="isSelected"
					class="ml-2 text-sm border border-gray-400 size-4 rounded-full flex justify-center items-center" 
					@click="toggleAddEditor">
					<IconSymbol class="text-color-dark-gray" width="20px" icon="heroicons:plus-20-solid" />
				</div>

				<button v-if="isSelected && !isRootFolder" 
					class="text-red-500 p-[2px] text-xs border border-red-500 size-4 rounded-full flex justify-center items-center" 
					@click="removeFolder">
					<IconSymbol class="text-red-500" width="20px" icon="heroicons:x-mark" />
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
						@keyup.enter="addFolder" />
					<PrimaryButton compact @click="addFolder">Add</PrimaryButton>
					<PrimaryButton compact @click="cancelEdit">Cancel</PrimaryButton>
			</div>

			<!-- children -->
			<FolderNode v-for="child in nodeChildren" :key="child.name ?? child.Name" 
				:node="child" :parent-path="currentPath" :selected-path="selectedPath"
				@add="(parentPath, name) => emit('add', parentPath, name)"
				@delete="() => emit('delete')"
				@select="(path) => emit('select', path)"
				@rename="(cp, pp, on, nn) => emit('rename', cp, pp, on, nn)" />

		</div>

	</div>

</template>

<style scoped></style>