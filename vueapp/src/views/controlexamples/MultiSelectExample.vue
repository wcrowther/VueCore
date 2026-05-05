<script setup>

	const selected = ref([])
	const optionsList =
	{
		apple: 'Apple',
		banana: 'Banana',
		orange: 'Orange',
		grape: 'Grape'
	}

</script>

<template>


	<MultiSelectInput v-model="selected" :optionsList="optionsList" class="mt-10" />

</template>