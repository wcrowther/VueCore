<script setup>

	import { useConfirmControl } from "@/composables/UseConfirmControl"

	const { createConfirm } = useConfirmControl()

	const props = defineProps({
		node: Object,
		parentPath: String
	})

	const emit = defineEmits(["add", "delete"])

	const expanded = ref(false)
	const newFolder = ref("")
	const isEditing = ref(false)


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

	const toggle = () => expanded.value = !expanded.value

	const addFolder = () =>
	{
		if (!newFolder.value) return

		emit("add", currentPath.value, newFolder.value)
		newFolder.value = ""
		isEditing.value = false
	}

	const cancelEdit = () =>
	{
		newFolder.value = ""
		isEditing.value = false
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

	<div class="ml-3">

		<div class="flex items-center gap-2 py-1">

			<span class="cursor-pointer font-medium" @click="toggle">
				📁 {{ nodeName }}
			</span>

			<button v-if="!isRootFolder" class="text-red-500 text-xs" @click="removeFolder">
				delete
			</button>

		</div>

		<div v-if="showContent" class="ml-4 border-l border-gray-300 pl-3">

			<!-- add folder -->
			<div class="flex gap-1 mb-2">
				<template v-if="isEditing">
					<input v-model="newFolder" placeholder="new folder" class="border px-1 text-sm" @keyup.enter="addFolder" />
					<button class="text-xs bg-blue-500 text-white px-2" @click="addFolder">Save</button>
					<button class="text-xs bg-gray-400 text-white px-2" @click="cancelEdit">Cancel</button>
				</template>
				<div v-else 
					class="textsm border border-gray-400 p-[5px] size-6 rounded-full flex justify-center items-center" 
					@click="isEditing = true">
					<IconSymbol class="text-color-dark-gray"
						icon="heroicons:pencil-square-solid" />
				</div>
			</div>

			<!-- children -->
			<FolderNode v-for="child in nodeChildren" :key="child.name ?? child.Name" 
				:node="child" :parent-path="currentPath"
				@add="(parentPath, name) => emit('add', parentPath, name)"
				@delete="() => emit('delete')" />

		</div>

	</div>

</template>

<style scoped></style>