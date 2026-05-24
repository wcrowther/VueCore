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
// Code to display Alert control
const alertDisplayed = await createAlert('Alert for the user.')

// Code to display Confirm control
const confirmed = await createConfirm('Confirm this record?')

// In <template> Create Confirm control inline
<PrimaryButton @click="createConfirm('Confirm this record?', () => console.log('Inline Callback!'))">
    Try Confirm
</PrimaryButton>`

// ======================================================================

</script>

<template>

    <div>

        <CodeBlock :codeContent language="vuejs in <script>" showLineNumbers  />
        
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

