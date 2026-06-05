import SaveNameControl from '@/components/controls/SaveNameControl.vue'

let instance = null
let container = null

export function useSaveNameControl()
{
	if (!instance)
	{
		container = document.createElement('div')
		document.body.appendChild(container)

		const exposedRef = ref(null)

		instance = createApp(
		{
			setup() { return () => h(SaveNameControl, { ref: exposedRef }) },

		}).mount(container)

		instance.exposedRef = exposedRef
	}

	const createSaveNameControl = async (saveNameSuggestion) =>
	{
		return await instance.exposedRef.value.saveNamePromise(saveNameSuggestion)
	}

	return { createSaveNameControl }
}
