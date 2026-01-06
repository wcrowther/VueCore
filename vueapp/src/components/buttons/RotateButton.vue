<script setup>

	const modelValue = defineModel({ type: Boolean, default: false })

</script>

<template>
	<span class="block transition duration-300" :class="{ 'rotate-90' : modelValue }"
		title="props.title" @click="modelValue = !modelValue">
		<IconSymbol width="26px" class="text-color-dark-gray hover:text-color-mid-gray" icon="heroicons:bars-4" />
	</span> 
</template>

<!-- RotateButton USAGE
	const sideBarHidden = ref(0)

	<RotateButton v-model="sideBarHidden" class="" title="toggle search"  /> 
-->