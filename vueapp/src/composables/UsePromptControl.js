import PromptControl from '@/components/controls/PromptControl.vue'

let instance = null
let container = null
let promptProps = null

export function usePromptControl(defaultProps = {})
{
	if (!instance)
	{
		container = document.createElement('div')
		document.body.appendChild(container)

		const exposedRef = ref(null)
		promptProps = ref({})

		instance = createApp(
		{
			setup() { return () => h(PromptControl, { ...promptProps.value, ref: exposedRef }) },

		}).mount(container)

		instance.exposedRef = exposedRef
	}

	const createPromptControl = async (textSuggestion, props = {}) =>
	{
		promptProps.value = { ...defaultProps, ...props }
		await nextTick()

		return await instance.exposedRef.value.promptPromise(textSuggestion)
	}

	return { createPromptControl }
}