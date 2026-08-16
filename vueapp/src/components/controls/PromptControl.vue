<script setup>

	const emits = defineEmits(['promptResult'])
	const props = defineProps(
	{
		textSuggestion: { type: String, default: '' },
		message:         { type: String, default: 'Enter text' },
		labelName:       { type: String, default: 'Text' },
		confirmText:     { type: String, default: 'Confirm' },
		cancelText:      { type: String, default: 'Cancel' },
		zIndex:          { type: Number, default: 1000 }
	})

	const showPrompt     = defineModel({ type: Boolean, default: false })
	const textValue      = ref(props.textSuggestion)
	const textInput      = ref(null)
	const disableKeys    = computed(() => !showPrompt.value)

    const keys =
    {
		'Escape': () => onCancel()
    }

	KeyboardListeners(keys, disableKeys)
	DisableGlobalKeys(showPrompt)
	useScrollLock(showPrompt)

	let resolvePromise

	const promptPromise = async (suggestedText) =>
	{
		textValue.value = suggestedText ?? props.textSuggestion
		showPrompt.value = true

		await nextTick()
		textInput.value?.focus()

		return new Promise((resolve) =>
		{
			resolvePromise = resolve
		})
	}

	defineExpose({ promptPromise })

	const onConfirm = () =>
	{
		const enteredText = textValue.value?.trim() || props.textSuggestion

		resolvePromise?.(enteredText)
		showPrompt.value = false
		emits('promptResult', enteredText)
	}

	const onCancel = () =>
	{
		resolvePromise?.(null)
		showPrompt.value = false
		emits('promptResult', null)
	}

	onBeforeUnmount(() =>
	{
		resolvePromise?.(null)
	})

</script>

<template>

	<Teleport to="#modals">
		<div v-if="showPrompt"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			:style="{ zIndex: props.zIndex }">

			<div class="bg-white p-5 pb-7 rounded shadow-md min-w-[320px]">

				<div class="mb-4 w-full">{{ props.message }}</div>
				<TextInput ref="textInput" v-model="textValue"
					hideLabel :labelName="props.labelName" autocomplete="off" :spellCheck="false"
					@keydown.enter.prevent.stop="onConfirm"
				/>
				<div class="flex justify-end">

					<button @click="onConfirm" @keydown.enter.prevent.stop="onConfirm"
						class="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 focus:outline-none">
						{{ props.confirmText }}
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