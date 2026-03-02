<script setup>

    const { createConfirm } = useConfirmControl()
    const showConfirmedText = ref(false)

	async function tryConfirm() 
	{
		const confirmed = await createConfirm('Confirm this record?')

		if (confirmed) 
        {
			console.log('Confirmed by User')
            showConfirmedText.value = true
        } 
        else 
        {
			console.log('Canceled by User')
        }
	}	

</script>

<template>

    <div class="font-bold mb-5">UseConfirmControl Composable</div>
    <div class="mb-5">
        This is a sample of how to programmatically create Confirm Control using the 
        <b>UseConfirmControl Composable</b>. See the messages in the browser console.
    </div>
    <PrimaryButton class="mt-5" @click="tryConfirm">Try Confirm</PrimaryButton>
    <div v-if="showConfirmedText" @click="showConfirmedText=false"
        class="mt-5 font-bold text-orange" title="Click to reset">
        Confirmed!
    </div>

</template>