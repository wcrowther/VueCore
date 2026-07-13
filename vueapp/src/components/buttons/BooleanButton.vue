
<script setup>

	const props = defineProps(
	{
		trueText:   { type: String, required: true },
		falseText:  { type: String, required: true },
	})

	const modelValue = defineModel ({ type: Boolean, default: false })

</script>

<template>
	
	<div class="flex items-center cursor-pointer rounded-full px-4 py-2 h-6 text-xs 
		leading-[1.3rem] select-none text-white font-bold tracking-wider align-middle 
		text-center bg-color-primary hover:bg-orange"
		@click="modelValue = !modelValue">
		{{ modelValue ? trueText : falseText }}
	</div>  

</template>


<!-- USAGE

	const rangeValue = ref(false)
	<BooleanButton v-model="rangeValue" trueText="Show On" falseText="Show Off" />
-->

