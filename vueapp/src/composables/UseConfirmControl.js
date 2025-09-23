import ConfirmControl from '@/components/controls/ConfirmControl.vue'

let instance = null;
let container = null;

export function useConfirmControl() 
{
	if (!instance) {
		container = document.createElement('div')
		document.body.appendChild(container)

		const exposedRef = ref(null)

		instance = createApp(
		{
			setup() {
				return () => h(ConfirmControl, { ref: exposedRef })
			},

		}).mount(container)

		// attach exposed methods to instance
		instance.exposedRef = exposedRef;
	}

	const createConfirm = async (message) => 
	{
		return await instance.exposedRef.value.confirmPromise(message)
	}

	return { createConfirm };
}


/* Example:

	const { createConfirm } = useConfirmControl()

	async function tryConfirm() 
	{
		const confirmed = await createConfirm('Confirm this record?')

		if (confirmed) 
			console.log('Confirmed by User')
		else 
			console.log('Cancelled by User')
	}	const { createConfirm } = useConfirmControl()

	// In template:
	<button @click="tryConfirm">Try Confirm</button>
*/
