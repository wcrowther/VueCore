<script setup>

	import { openAllDetailBoxes, closeAllDetailBoxes, toggleAllDetailBoxes } from '@/composables/UseDetailBoxEvents'

	const openAccordionGroup 	= () => openAllDetailBoxes('accordion') 
	const closeAccordionGroup 	= () => closeAllDetailBoxes('accordion') 
	const toggleAccordionGroup 	= () => toggleAllDetailBoxes('accordion') 

	const allOpen 				= ref(false)
	const accordionOpen 		= ref(false)

</script>

<template>

	<div class="mb-10">

		<PageTitleBox pageTitle="DetailBox">
			<PrimaryButton v-if="!allOpen" title="Open All" @click="openAllDetailBoxes(); allOpen = true" />
			<PrimaryButton v-if="allOpen" title="Close All" @click="closeAllDetailBoxes(); allOpen = false" />
			<PrimaryButton title="Toggle All" @click="toggleAllDetailBoxes" />
		</PageTitleBox>

		<InfoBox>
			Each DetailBox can be opened or closed by clicking its header. The top buttons control all
			boxes in this section: <b>Open All</b> expands every box, <b>Close All</b> collapses every box,
			and <b>Toggle All</b> flips each box to the opposite of its current state.
			This section also shows a custom header slot and a <b>hideCaret</b> example.
		</InfoBox>

		<div class="flex flex-wrap justify-between mt-10 mb-5">

			<DetailBox id="detailOne" title="Detail One" class="bg-white">
				Content One
			</DetailBox>

			<DetailBox id="detail2"  title="Detail Two" class="bg-white">
				<template #header>Customized Header Title</template>
				Content Two
			</DetailBox>

			<DetailBox title="Detail Three" hideCaret class="bg-white">
				Content Three
			</DetailBox>

		</div>

		<div class="mb-7 flex flex-wrap justify-end gap-2">
			<PrimaryButton v-if="!accordionOpen" title="Open Accordion" @click="openAccordionGroup(); accordionOpen = !accordionOpen" />
			<PrimaryButton v-if="accordionOpen" title="Close Accordion" @click="closeAccordionGroup(); accordionOpen = !accordionOpen" />
			<PrimaryButton title="Toggle Accordion" @click="toggleAccordionGroup" />
		</div>

		<InfoBox>
			These boxes share the same <b>group</b>, so they behave like an accordion:
			opening one automatically closes the others. Use <b>Open Accordion</b> to open all,
			<b>Close Accordion</b> to collapse all, and <b>Toggle Accordion</b> to invert each Accordion item's state.
		</InfoBox>

		<DetailBox id="accordionOne" title="Accordion One" group="accordion">
			FAQ content one
		</DetailBox>

		<DetailBox id="accordionTwo" title="Accordion Two" group="accordion">
			FAQ content two
		</DetailBox>
		
		<DetailBox id="accordionThree" title="Accordion Three" group="accordion">
			FAQ content three
		</DetailBox>
		
	</div>

</template>