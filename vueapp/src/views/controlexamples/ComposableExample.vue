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

    <AccordionControl :multiple="false" :defaultOpen="[0]" class="mt-5 mb-7">

        <AccordionItem>
            <template #header>
                What is Vue?
            </template>
            <template #body>
                Vue is a progressive JavaScript framework.
            </template>
        </AccordionItem>

        <AccordionItem>
            <template #header>
                What is Tailwind?
            </template>
            <template #body>
                Tailwind is a utility-first CSS framework.
            </template>
        </AccordionItem>

        <AccordionItem>
            <template #header>
                Why use an accordion?
            </template>
            <template #body>
                Accordions organize large content into collapsible sections.
            </template>
        </AccordionItem>

    </AccordionControl>

</template>

