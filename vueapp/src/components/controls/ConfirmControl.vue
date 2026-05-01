<script setup>

	import { useScrollLock } from '@/composables/UseScrollLock'

	const emits = defineEmits(['confirmResult'])
	const props = defineProps(
	{
		message: 		{ type: String, default: 'Confirm your changes?' }, 
		confirmText:	{ type: String, default: 'Confirm' }, 
		cancelText: 	{ type: String, default: 'Cancel' },
		zIndex:         { type: Number, default: 1000 }
	});

	const showConfirm 	= defineModel({ type: Boolean, default: false })
	const message 		= ref(props.message)

    // Keyboard Listeners  ================================================
	
	DisableGlobalKeys(showConfirm) // disable global Esc key if confirm is showing

    const keys = function (e)   
    {
		if (e.code === 'Escape'){ onCancel(); e.preventDefault(); } 
    }

	KeyboardListeners(keys, showConfirm)

	useScrollLock(showConfirm)

    const vFocus = {  mounted: (el) => el.focus() } // Custom Directive (note casing)

	// ================================================================================
	// See 'useConfirmControl' composable for programmatically creating a confirm control
	// ================================================================================

	let resolvePromise; // promise resolver

	const confirmPromise = (msg) => 
	{
		message.value = msg
		showConfirm.value    = true

		return new Promise((resolve) => 
		{
			resolvePromise = resolve
		})
	}

	defineExpose({ confirmPromise }) // must be after function

	// ==================================================================================

	const onConfirm = () => 
	{
		resolvePromise?.(true)
		showConfirm.value = false

		emits('confirmResult', true)
	}

	const onCancel  = () => 
	{
		resolvePromise?.(false)
		showConfirm.value = false

		emits('confirmResult', false)
	}

	// Clean up ========================================================================

	onBeforeUnmount(() => 
	{
    	resolvePromise?.(false)
	})

</script>

<template>

	<Teleport to="#modals">
		<div v-if="showConfirm"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			:style="{ zIndex: props.zIndex }">

			<div class="bg-white p-5 pb-7 rounded shadow-md">

				<div class="mb-5 w-full">{{ message }}</div>
				<div class="flex justify-end">

					<button @click="onConfirm" v-focus @keydown.enter.prevent.stop="onConfirm"  
						class="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 focus:outline-none">
						{{props.confirmText}}
					</button>

					<button @click="onCancel" @keydown.enter.prevent.stop="onCancel"  
						class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none">
						{{props.cancelText}}
					</button>

				</div>
			</div>
		</div>
	</Teleport>

</template>

<!-- Example: 

	// Also see 'useConfirmControl' composable for programmatically creating a confirm control

	const showConfirm = ref(false)

    <ConfirmControl v-model="showConfirm" message="Save User Data?" @confirmResult="SaveChanges" />
-->
