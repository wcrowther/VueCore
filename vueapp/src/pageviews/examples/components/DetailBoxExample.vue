<script setup>

	import { openAllDetailBoxes, closeAllDetailBoxes, toggleAllDetailBoxes } from '@/composables/UseDetailBoxEvents'

	const openFaqGroup = () => openAllDetailBoxes('faq') 
	const closeFaqGroup = () => closeAllDetailBoxes('faq') 
	const toggleFaqGroup = () => toggleAllDetailBoxes('faq')

	const allOpen = ref(false)

</script>

<template>

	<div class="mb-10">

		<div class="text-lg font-bold mb-5">DetailBox</div>

		<div class="mb-3 flex flex-wrap gap-2">
			<PrimaryButton v-if="!allOpen" title="Open All" @click="openAllDetailBoxes(); allOpen = true" />
			<PrimaryButton v-if="allOpen" title="Close All" @click="closeAllDetailBoxes(); allOpen = false" />
			<PrimaryButton title="Toggle All" @click="toggleAllDetailBoxes" />
		</div>

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

		<div class="mb-3 flex flex-wrap gap-2">
			<PrimaryButton title="Open FAQ Group" @click="openFaqGroup" />
			<PrimaryButton title="Close FAQ Group" @click="closeFaqGroup" />
			<PrimaryButton title="Toggle FAQ Group" @click="toggleFaqGroup" />
		</div>

		<div class="grid gap-3 max-w-xl">
			<InfoBox>FAQ group uses accordion behavior (open one closes others in same group).</InfoBox>

			<DetailBox id="faqOne" title="FAQ One" group="faq">
				FAQ content one
			</DetailBox>

			<DetailBox id="faqTwo" title="FAQ Two" group="faq">
				FAQ content two
			</DetailBox>
			
			<DetailBox id="faqThree" title="FAQ Three" group="faq">
				FAQ content three
			</DetailBox>
		</div>
		
	</div>

</template>