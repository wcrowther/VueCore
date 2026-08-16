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

    const { createPromptControl } = usePromptControl(
    {
        message: 'Enter some text',
        labelName: 'Text',
        confirmText: 'Submit'
    })
    const promptedText = ref('')

	const tryPrompt = async () =>
	{
        const textSuggestion = 'Example text'
        const enteredText = await createPromptControl(textSuggestion)
        promptedText.value = enteredText || ''
        console.log(`Entered text: ${promptedText.value}`)
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

// Code to display PromptControl with custom props
const { createPromptControl } = usePromptControl({ message: 'Enter some text', confirmText: 'Submit' })
const enteredText = await createPromptControl('Example text')

// In <template> Create Confirm control inline
<PrimaryButton @click="createConfirm('Confirm this record?', () => console.log('Inline Callback!'))">
    Confirm With Callback
</PrimaryButton>
`

// ======================================================================

</script>

<template>

    <div>

        <PageTitleBox pageTitle="Dialog Composables" />
        
        <InfoBox>
            These composables allow you to programmatically trigger <b>Alert</b>, <b>Confirm</b>, and
            <b>PromptControl</b> dialogs from anywhere in your code — no component markup required. Each
            returns a Promise, so you can <code>await</code> the result inline and branch logic based on the
            user's response. Check the browser console to see the resolved values after interacting with each dialog.
        </InfoBox>

        <div class="mt-5">
            <p class="mb-3">
                <b>AlertControl</b> shows a message and resolves after the user acknowledges it.
            </p>
            <p class="mb-3">
                <b>ConfirmControl</b> asks the user to confirm or cancel an action and resolves to a boolean. A second parameter can be used for an inline callback.
            </p>
            <p class="mb-3">
                <b>PromptControl</b> prompts for text and resolves to the entered value or <code>null</code>
                when the user cancels.
            </p>
        </div>
        
        <div class="mb-7">
            <PrimaryButton class="mt-5 mr-3" @click="showAlert">Alert</PrimaryButton>
            <PrimaryButton class="mr-3" @click="tryConfirm">Confirm</PrimaryButton>
            <PrimaryButton class="mr-3" @click="createConfirm('Confirm this record?', () => console.log('Inline callback!'))">
                Confirm with Callback
            </PrimaryButton>
            <PrimaryButton class="mt-5 mr-3" @click="tryPrompt">Prompt for Text</PrimaryButton>
        </div>

        <div v-if="showConfirmedText" 
            class="mt-5 font-bold text-orange" title="Click to reset"
            @click="showConfirmedText=false">
            Confirmed!
        </div>

        <div v-if="promptedText" 
            class="mt-5 font-bold text-orange" title="Click to reset"
            @click="promptedText=''">
            Entered: {{ promptedText }}
        </div>

        <CodeBlock :codeContent="codeContent" title="vuejs code" />

    </div>
	
</template>

