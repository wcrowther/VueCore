
export function ShowSideButtonInSubNav()
{
	const appStore   			= useAppStore()
    const { showSideButton }	= storeToRefs(appStore)

	onMounted(() => showSideButton.value = true)
	onUnmounted(() => showSideButton.value = false)
}

/* EXAMPLE CODE: ShowSideButtonInSubNav() */