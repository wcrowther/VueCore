export function DisableGlobalKeys(disable)
{	
	const appStore   		= useAppStore()
    const { globalKeysOn }	= storeToRefs(appStore)

	const disabled = computed(() => unref(disable) ?? false )
	globalKeysOn.value  = !disabled.value 
	
	onUnmounted(() => { globalKeysOn.value  = true; })
}

/* 	USAGE: 

	import { globalKeysOn } from '@/composables/DisableGlobalKeys.js' 	// (if needed) 

	DisableGlobalKeys(showConfirm.value);
*/


