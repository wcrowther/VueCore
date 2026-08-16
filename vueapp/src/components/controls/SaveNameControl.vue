<script setup>

	// ================================================================================
	// See 'useSaveNameControl' composable to programmatically create a SaveNameControl
	// ================================================================================

	const emits = defineEmits(['saveNameResult'])
	const props = defineProps(
	{
		saveNameSuggestion: { type: String, default: '' },
		message: 			{ type: String, default: 'Enter save name' },
		saveText: 			{ type: String, default: 'Save' },
		cancelText: 		{ type: String, default: 'Cancel' },
		zIndex: 			{ type: Number, default: 1000 }
	})

	const showSaveNameEntry = defineModel({ type: Boolean, default: false })
	const saveName 			= ref(props.saveNameSuggestion)
	const saveNameInput 	= ref(null)
	const disableKeys 		= computed(() => !showSaveNameEntry.value)

    const keys =
    {
		'Escape': () => onCancel()
    }

	KeyboardListeners(keys, disableKeys)
	DisableGlobalKeys(showSaveNameEntry)
	useScrollLock(showSaveNameEntry)

	let resolvePromise

	const saveNamePromise = async (suggestedFileName) =>
	{
		saveName.value = suggestedFileName || props.saveNameSuggestion
		showSaveNameEntry.value = true

		await nextTick()
		saveNameInput.value?.focus()

		return new Promise((resolve) =>
		{
			resolvePromise = resolve
		})
	}

	defineExpose({ saveNamePromise })

	const onSave = () =>
	{
		const nextSaveName = saveName.value?.trim() || props.saveNameSuggestion

		resolvePromise?.(nextSaveName)
		showSaveNameEntry.value = false
		emits('saveNameResult', nextSaveName)
	}

	const onCancel = () =>
	{
		resolvePromise?.(null)
		showSaveNameEntry.value = false
		emits('saveNameResult', null)
	}

	onBeforeUnmount(() =>
	{
		resolvePromise?.(null)
	})

</script>

<template>

	<Teleport to="#modals">
		<div v-if="showSaveNameEntry"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			:style="{ zIndex: props.zIndex }">

			<div class="bg-white p-5 pb-7 rounded shadow-md min-w-[320px]">

				<div class="mb-4 w-full">{{ props.message }}</div>
				<TextInput ref="saveNameInput" v-model="saveName"
					hideLabel labelName="File Name" autocomplete="off" :spellCheck="false"
					@keydown.enter.prevent.stop="onSave"
				/>
				<div class="flex justify-end">

					<button @click="onSave" @keydown.enter.prevent.stop="onSave"
						class="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 focus:outline-none">
						{{ props.saveText }}
					</button>

					<button @click="onCancel" @keydown.enter.prevent.stop="onCancel"
						class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">
						{{ props.cancelText }}
					</button>

				</div>
			</div>
		</div>
	</Teleport>

</template>

