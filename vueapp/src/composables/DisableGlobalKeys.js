// Module-level (not per-component) so multiple simultaneous callers don't clobber each other's request

const activeDisablers = new Set()
let nextDisablerId = 0

export function DisableGlobalKeys(disable)
{	
	const appStore   			= useAppStore()
    const { disableGlobalKeys }	= storeToRefs(appStore)

	const disabled = typeof disable === 'function'
		? computed(disable)
		: computed(() => Boolean(unref(disable)))

	const id = nextDisablerId++

	const applyState = () => { disableGlobalKeys.value = activeDisablers.size > 0 }

	watch(disabled, (isDisabled) =>
	{
		isDisabled ? activeDisablers.add(id) : activeDisablers.delete(id)
		applyState()
	}, 
	{ immediate: true })

	onUnmounted(() => 
	{ 
		activeDisablers.delete(id)
		applyState()
	})
}

/* 	USAGE: 

	import { disableGlobalKeys } from '@/composables/DisableGlobalKeys.js' 	// (if needed) 

	DisableGlobalKeys(showConfirm)
*/


