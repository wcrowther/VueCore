// browserGuard give a warning if leaving the page at the browser level 

export function useUnsavedGuard(isDirtyRef, confirmFn, browserGuard = true) 
{
	// Internal helper
	async function checkConfirm() 
	{
		if (isDirtyRef.value) 
		{
			// call your custom confirm dialog instead of window.confirm
			return await confirmFn('You have unsaved changes. Continue?')
		}
		return true
	}

	// Guard against route changes
	onBeforeRouteLeave(async (to, from, next) => 
	{
		const ok = await checkConfirm()
		if (ok) 
			next()
		else 
			next(false)
	})

	// ===========================================================================
	// Guard against browser close / refresh if browserGuard is true
	// ===========================================================================

	function handleBeforeUnload(e) 
	{
		if (isDirtyRef.value && browserGuard)
		{
			e.preventDefault()
			e.returnValue = '' // Chrome requires this
		}
	}

	onMounted(() => 
	{
		if(browserGuard)
			window.addEventListener('beforeunload', handleBeforeUnload)
	})

	onBeforeUnmount(() => 
	{
		if(browserGuard)
			window.removeEventListener('beforeunload', handleBeforeUnload)
	})
}

/* Example:

    const isDirty               = ref(false)
	const { createConfirm }     = useConfirmControl();

	// default message: 'You have unsaved changes. Continue?'
    useUnsavedGuard(isDirty, createConfirm, false) 

	or 

	// pass a custom message function
    useUnsavedGuard(isDirty, () => createConfirm('Custom Confirm message...'))

*/