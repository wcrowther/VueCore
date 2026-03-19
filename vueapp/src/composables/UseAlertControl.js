import AlertControl from '@/components/controls/AlertControl.vue'

let instance = null;
let container = null;

export function useAlertControl() 
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
				return () => h(AlertControl, { ref: exposedRef, message: '' })
			},

		}).mount(container)

		instance.exposedRef = exposedRef;
	}

	const createAlert = async (message) => await instance.exposedRef.value.alertPromise(message)

	return { createAlert };
}


/* Example:

	const { createAlert } = useAlertControl()

	const showAlert = async () =>
	{
		const alertDisplayed = await createAlert('Alert for the user.')

		if(alertDisplayed)
			console.log('Alert displayed')
	} 	

	// In template:
	<button @click="showAlert">Show Alert</button>
	or
	<PrimaryButton @click="createAlert('Alert for the user.')">Show Alert</PrimaryButton>
*/
