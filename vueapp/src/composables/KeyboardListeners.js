export function KeyboardListeners(keys, disabled = false) 
{
	const isDisabled = typeof disabled === 'function' 
						? computed(disabled) 
						: (isRef(disabled) ? disabled : ref(disabled))

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

	onMounted(() => { if (!isDisabled.value) addKeyListeners() })
	onUnmounted(() => { removeKeyListeners() })

	watch(isDisabled, (newVal, oldVal) => 
	{
		if (newVal === oldVal) return
		newVal ? removeKeyListeners() : addKeyListeners()
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

	KeyboardListeners(keys, disabled); // disabled defaults to false - is optional
*/
