export function KeyboardListeners(keys, enabled = true) 
{
	const isEnabled = isRef(enabled) ? enabled : ref(enabled)

	let isAttached = false

	const addKeyListeners = () => 
	{
		if (isAttached) return
		document.addEventListener('keydown', keys, false)
		isAttached = true
	}

	const removeKeyListeners = () => 
	{
		if (!isAttached) return
		document.removeEventListener('keydown', keys, false)
		isAttached = false
	}

	onMounted(() => { if (isEnabled.value) addKeyListeners() })
	onUnmounted(() => { removeKeyListeners() })

	watch(isEnabled, (newVal, oldVal) => 
	{
		if (newVal === oldVal) return
		newVal ? addKeyListeners() : removeKeyListeners()
	})
}

/* EXAMPLE CODE:

	import { KeyboardListeners } from './helpers/KeyboardListeners'

	const keys = function (e)   // EXAMPLE LOGIC
	{
		// console.log(e.code);    
		if      (e.code === 'ArrowUp')   { listPager.value.goToPrevious();     e.preventDefault();}
		else if (e.code === 'ArrowDown') { listPager.value.goToNext();         e.preventDefault();}
		else if (e.code === 'Home')      { listPager.value.goToFirstPage();    e.preventDefault();}
		else if (e.code === 'End')       { listPager.value.goToLastPage();     e.preventDefault();}
		else if (e.code === 'PageDown')  { listPager.value.goToPreviousPage(); e.preventDefault();}
		else if (e.code === 'PageUp')    { listPager.value.goToNextPage();     e.preventDefault();} 
	}

	KeyboardListeners(keys, enabled); // enabled defaults to is optional
*/

/*
export function KeyboardListeners(keys, enabled = true)
{
	const addKeyListeners     = () => document.addEventListener('keydown', keys, false)
	const removeKeyListeners  = () => document.removeEventListener('keydown', keys, false)
	
	console.log('KeyboardListeners enabled: ', enabled)

	onMounted(()   => addKeyListeners())
	onUnmounted(() => removeKeyListeners())
}*/