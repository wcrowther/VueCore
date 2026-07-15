<script setup>

    const { createConfirm } = useConfirmControl()
    const showConfirmedText = ref(false)
  
	const { createAlert } = useAlertControl()
	const showAlert = async () =>
	{
		const alertDisplayed = await createAlert('Alert for the user.')

		if(alertDisplayed)
			console.log('Alert displayed')
	}

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

// ======================================================================
// CodeBlock Example
// ======================================================================

const codeContent = 
`
// In <script setup>

// Code to display Alert control
const alertDisplayed = await createAlert('Alert for the user.')

// Code to display Confirm control
const confirmed = await createConfirm('Confirm this record?')

// In <template> Create Confirm control inline
<PrimaryButton @click="createConfirm('Confirm this record?', () => console.log('Inline Callback!'))">
    Try Confirm
</PrimaryButton>
`

// ======================================================================

</script>

<template>

    <div>

        <div class="text-lg font-bold mb-5">
            Alert &amp; Confirm Composables
        </div>
        <div class="mb-7">
            These composables allow you to programmatically trigger <b>Alert</b> and <b>Confirm</b> dialogs 
            from anywhere in your code — no component markup required. Both return a Promise, so you can 
            <code>await</code> the result inline and branch logic based on the user's response.
            Check the browser console to see the resolved values after interacting with each dialog.
        </div>

        <CodeBlock :codeContent title="vuejs code" />
        
        <PrimaryButton class="mt-5 mr-3" @click="showAlert">Try Alert</PrimaryButton>      
        <PrimaryButton class="mr-3" @click="tryConfirm">Try Confirm</PrimaryButton>
        <PrimaryButton class="mr-3" @click="createConfirm('Confirm this record?', () => console.log('Inline callback!'))">
            Try Confirm with Callback
        </PrimaryButton>

        <div v-if="showConfirmedText" 
            class="mt-5 font-bold text-orange" title="Click to reset"
            @click="showConfirmedText=false">
            Confirmed!
        </div>

    </div>
	
</template>

