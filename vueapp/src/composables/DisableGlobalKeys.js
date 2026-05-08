export function DisableGlobalKeys(disable)
{	
	const appStore   			= useAppStore()
    const { disableGlobalKeys }	= storeToRefs(appStore)

	const disabled = computed(() => unref(disable) ?? false )
	disableGlobalKeys.value  = disabled.value 
	
	onUnmounted(() => { disableGlobalKeys.value  = false; })
}

/* 	USAGE: 

	import { disableGlobalKeys } from '@/composables/DisableGlobalKeys.js' 	// (if needed) 

	DisableGlobalKeys(showConfirm.value);
*/


