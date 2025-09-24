
export function DisableLayoutEscapeKey(disable)
{	
	const appStore   			= useAppStore()
    const { layoutEscapeKeyOn }	= storeToRefs(appStore)

	const disabled = computed(() => unref(disable) ?? false )
	layoutEscapeKeyOn.value  = !disabled.value 
	
	onUnmounted(() => { layoutEscapeKeyOn.value  = true; })
}

/* 	USAGE: 

	// (if needed) 
	import { DisableLayoutEscapeKey } from '@/composables/DisableLayoutEscapeKey.js'

	DisableLayoutEscapeKey(showConfirm.value);
*/


