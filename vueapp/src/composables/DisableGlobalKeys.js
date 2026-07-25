export function DisableGlobalKeys(disable)
{	
	const appStore   			= useAppStore()
    const { disableGlobalKeys }	= storeToRefs(appStore)

	const disabled = typeof disable === 'function'
		? computed(disable)
		: computed(() => Boolean(unref(disable)))

	watch(disabled, (isDisabled) =>
	{
		disableGlobalKeys.value = isDisabled
	}, { immediate: true })

	onUnmounted(() => { disableGlobalKeys.value = false })
}

/* 	USAGE: 

	import { disableGlobalKeys } from '@/composables/DisableGlobalKeys.js' 	// (if needed) 

	DisableGlobalKeys(showConfirm)
*/


