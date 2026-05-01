<script setup>

	import { useScrollLock } from '@/composables/UseScrollLock'

	const emits = defineEmits(['alertResult'])
	const props = defineProps(
	{
		message: 		{ type: String, required: true }, 
		closeText:		{ type: String, default: 'Close' }, 
		zIndex:         { type: Number, default: 1000 }
	});

	const showAlert 	= defineModel({ type: Boolean, default: false })
	const message 		= ref(props.message)

    // Keyboard Listeners  ================================================
	
	DisableGlobalKeys(showAlert) // disable global Esc key if confirm is showing

    const keys = function (e)   
    {
		if (e.code === 'Escape'){ onClose(); e.preventDefault(); } 
    }

	KeyboardListeners(keys, showAlert)

    const vFocus = {  mounted: (el) => el.focus() } // Custom Directive (note casing)

	// ================================================================================
	// See 'useAlertControl' composable for programmatically creating an alert control
	// ================================================================================

	let resolvePromise; // promise resolver

	const alertPromise = (msg) => 
	{
		message.value 	= msg
		showAlert.value	= true

		return new Promise((resolve) => 
		{
			resolvePromise = resolve
		})
	}

	defineExpose({ alertPromise }) // must be after function

	useScrollLock(showAlert)

	// ==================================================================================

	const onClose  = () => 
	{
		resolvePromise?.(true)
		showAlert.value = false

		emits('alertResult', true)
	}

	// Clean up ========================================================================

	onBeforeUnmount(() => { resolvePromise?.(false) })

</script>

<template>

	<Teleport to="#modals">
		<div v-if="showAlert"
			class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
			:style="{ zIndex: props.zIndex }">

			<div class="bg-white p-5 pb-7 max-w-[300px] min-w-[200px] rounded shadow-md">

				<div class="mb-5 w-full">{{ message }}</div>
				<div class="flex justify-end">

					<button @click="onClose" v-focus @keydown.enter.prevent.stop="onClose"  
						class="mr-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-700 focus:outline-none">
						{{props.closeText}}
					</button>

				</div>
			</div>
		</div>
	</Teleport>

</template>

<!-- Example: 

	// Also see 'useAlertControl' composable for programmatically creating an Alert control

	const showAlert = ref(false)
    const SaveChanges = () => console.log('Save Changes')

    <AlertControl v-model="showAlert" message="Info to show to the user." @confirmResult="SaveChanges" />
-->
