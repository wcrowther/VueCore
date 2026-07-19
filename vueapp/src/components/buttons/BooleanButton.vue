<script setup>
	const props = defineProps(
	{
		trueText:   { type: String, required: true },
		falseText:  { type: String, required: true },
	})

	const modelValue = defineModel ({ type: Boolean, default: false })

</script>

<template>
	
	<PrimaryButton @click="modelValue = !modelValue">

		<slot>
			{{ modelValue ? trueText : falseText }}		
		</slot>

	</PrimaryButton>  

</template>


<!-- USAGE
	const boolValue = ref(false)
	<BooleanButton v-model="boolValue" trueText="Show On" falseText="Show Off" />
-->

