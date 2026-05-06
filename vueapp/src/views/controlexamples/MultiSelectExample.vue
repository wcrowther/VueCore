<script setup>

	const selectedItems 	= ref([])
	const selectedStates 	= ref([])
	const accountName 		= ref('')
	const optionsList =
	{
		apples: 	'Apples',
		bananas: 	'Bananas',
		oranges: 	'Oranges',
		grapes: 	'Grapes',
		raspberry: 	'Raspberrys',
		gooseberry: 'Gooseberrys',
		strawberry: 'Strawberrys',
		watermelon: 'Watermelons',
		rhubarb: 	'Rhubarb',
		tangerines: 'Tangerines',
		pears:		'Pears'
	}

</script>

<template>

	<MultiSelectInput labelName="U.S. States" v-model="selectedStates" :optionsList="usStatesList" 
		class="mt-10" mode="comma" :hideSelected="false" />

	<SelectInput labelName="Fruits" v-model="selectedItems" :optionsList placeholder="Fruits" />

	<TextInput labelName="Account Name" v-model="accountName" />

</template>