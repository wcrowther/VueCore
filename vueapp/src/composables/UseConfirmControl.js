import ConfirmControl from '@/components/controls/ConfirmControl.vue'

let instance = null;
let container = null;

export function useConfirmControl() 
{
	if (!instance) 
	{
		container = document.createElement('div')
		document.body.appendChild(container)

		const exposedRef = ref(null)

		instance = createApp(
		{
			setup() 
			{
				return () => h(ConfirmControl, { ref: exposedRef })
			},

		}).mount(container)

		// attach exposed methods to instance
		instance.exposedRef = exposedRef;
	}

	// onConfirm
	const createConfirm = async (message, onConfirm) => 
	{
		const confirmed = await instance.exposedRef.value.confirmPromise(message)
		if (confirmed && onConfirm)
			await onConfirm()
		return confirmed
	}

	return {  createConfirm };
}


/* Example:

	const { createConfirm } = useConfirmControl()

	const tryConfirm = async () =>
	{
		const confirmed = await createConfirm('Confirm this record?')

		if (confirmed) 
			console.log('Confirmed by User')
		else 
			console.log('Cancelled by User')
	} 	

	// In template:
	<button @click="tryConfirm">Try Confirm</button>

	// Inline callback function:
	<button @click="createConfirm('Confirm this record?', () => console.log('Confirmed by User'))">Try Confirm</button>

*/
