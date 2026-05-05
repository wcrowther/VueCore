<script setup>

    const { createConfirm } = useConfirmControl()
    const showConfirmedText = ref(false)

	const tryConfirm = async () =>
	{
		const confirmed = await createConfirm('Confirm this record?')

		if (confirmed) 
        {
			console.log('Confirmed by user')
            showConfirmedText.value = true
        } 
        else 
        {
			console.log('Canceled by user')
            showConfirmedText.value = false
        }
	}	

	const { createAlert } = useAlertControl()

	const showAlert = async () =>
	{
		const alertDisplayed = await createAlert('Alert for the user.')

		if(alertDisplayed)
			console.log('Alert displayed')
	}	

</script>

<template>

    <div>
        <PrimaryButton class="mt-5 mr-3" @click="showAlert">Show Alert</PrimaryButton>
        
        <PrimaryButton class="mt-5" @click="tryConfirm">Try Confirm</PrimaryButton>
        <div v-if="showConfirmedText" @click="showConfirmedText=false"
            class="mt-5 font-bold text-orange" title="Click to reset">
            Confirmed!
        </div>
    </div>
	
</template>

