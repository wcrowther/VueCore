<script setup>

	const selectedStates 	= ref([])
	
</script>

<template>

	<MultiSelectInput labelName="U.S. States" v-model="selectedStates" :optionsList="usStatesList" 
		class="mt-10" mode="capsule" :hideSelected="false" />

</template>