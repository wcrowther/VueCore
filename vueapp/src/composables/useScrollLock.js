export function useScrollLock(showModalRef) 
{

	let scrollY = 0

	const lock = () => 
	{
		scrollY = window.scrollY
		document.body.style.position = 'fixed'
		document.body.style.top = `-${scrollY}px`
		document.body.style.left = '0'
		document.body.style.right = '0'
	}

	const unlock = () => 
	{
		document.body.style.position = ''
		document.body.style.top = ''
		document.body.style.left = ''
		document.body.style.right = ''
		window.scrollTo(0, scrollY)
	}

	watch (
		showModalRef,
		(open) => 
		{
			console.log('ScrollLock watch triggered:', open)
			open ? lock() : unlock()
		},
		{ immediate: true }
	)

	onUnmounted(unlock)
}