<script setup>

	const modelValue = defineModel({ type: Boolean, default: false })
	const props = defineProps({
		icon: { type: String, default: 'heroicons:bars-3'}
	})
</script>

<template>

  <span :class="['inline-flex items-center justify-center ' + 
  	'transform transition-transform duration-300', { 'rotate-90': modelValue }]" 
    @click="modelValue = !modelValue">

    <IconSymbol class="block text-color-dark-gray hover:text-color-mid-gray"
    	width="26px" :icon="props.icon" />
  </span>

</template>


<!-- RotateButton USAGE
	const sideBarHidden = ref(0)

	<RotateButton v-model="sideBarHidden" class="" title="toggle search"  /> 
-->