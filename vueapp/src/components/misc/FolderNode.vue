<script setup>

	import { useConfirmControl } from "@/composables/UseConfirmControl"

	const { createConfirm } = useConfirmControl()

	const props = defineProps({
		node: Object,
		parentPath: String,
		selectedPath: String
	})

	const emit = defineEmits(["add", "delete", "select"])

	const expanded = ref(false)
	const newFolder = ref("")
	const editingPath = inject("folderEditingPath", ref(null))


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
	const isSelected = computed(() => currentPath.value === props.selectedPath)
	const isParentOfSelected = computed(() =>
	{
		const selected = String(props.selectedPath ?? "")
		if (!selected) return false
		return selected.startsWith(currentPath.value + "/")
	})

	const toggle = () => expanded.value = !expanded.value
	const selectNode = () => emit("select", currentPath.value)
	const onNodeClick = () =>
	{
		selectNode()

		// If this node is a parent of the selected folder and already expanded,
		// keep it open when switching selection to the parent.
		if (isParentOfSelected.value && expanded.value)
			return

		toggle()
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

			<span class="flex items-center cursor-pointer font-medium"
				:class="isSelected ? 'text-black' : ''"
				@click="onNodeClick">
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

		</div>

		<div v-if="showContent" class="ml-4 border-l border-gray-300 pl-3">

			<div v-if="isEditing"
				class="flex flex-wrap gap-1 items-center">
					<TextInput name="addFolder" v-model="newFolder" hideLabel
						class="ml-1 !mb-0 h-6 px-2 py-0" placeholder="new folder" 
						@keyup.enter="addFolder" />
					<PrimaryButton compact @click="addFolder">Add Folder</PrimaryButton>
					<PrimaryButton compact @click="cancelEdit">Cancel</PrimaryButton>
			</div>

			<!-- children -->
			<FolderNode v-for="child in nodeChildren" :key="child.name ?? child.Name" 
				:node="child" :parent-path="currentPath" :selected-path="selectedPath"
				@add="(parentPath, name) => emit('add', parentPath, name)"
				@delete="() => emit('delete')"
				@select="(path) => emit('select', path)" />

		</div>

	</div>

</template>

<style scoped></style>