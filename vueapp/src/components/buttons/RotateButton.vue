<script setup>

	const modelValue = defineModel({ type: Boolean, default: false })
	const props = defineProps(
	{
		icon: { type: String, default: 'heroicons:bars-3'},
		noClick: { type: Boolean, default: false },
		rotation: { type: String, default: 'rotate-90'},
		size: { type: String, default: '26px'},
	})

	const handleClick = () => { if(!props.noClick ) modelValue.value = !modelValue.value }

</script>

<template>

  <span :class="['inline-flex items-center justify-center ' + 
  	'transform transition-transform duration-100', { [props.rotation] : modelValue }]" 
    @click="handleClick">

    <IconSymbol class="block text-color-dark-gray hover:text-color-mid-gray"
    	:width="props.size" :icon="props.icon" />
  </span>

</template>


<!-- RotateButton USAGE
	const sideBarHidden = ref(0)

	<RotateButton v-model="sideBarHidden" icon="heroicons:chevron-down-solid" rotation="rotate-180" /> 	
	<RotateButton v-model="sideBarHidden" class="" title="toggle search" /> 	
	<RotateButton v-model="sideBarHidden" :noClick="true" title="toggle search" /> 
-->