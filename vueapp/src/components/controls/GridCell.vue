
<script setup>

	const props = defineProps(
	{
		rangeList: { type: Array, default: () => ['One', 'Two', 'Three'] }
	})

	const min  = 0 
	const max  = computed(() => props.rangeList.length-1)

	const modelValue = defineModel (
	{
		type: Number,
		default: 0
	})

	watch (
		[modelValue, max], () => 
		{
			if (modelValue.value < min) 
			{
				modelValue.value = max.value
			} 
			else if (modelValue.value > max.value) 
			{
				modelValue.value = min
			}
		},{ immediate: true }
	)

	const setRangeValue = (delta) => 
	{
		modelValue.value += delta
	}

	const rangeText = computed(() => props.rangeList[modelValue.value])

</script>

<template>
	
	<div class="badge-button cursor-pointer text-white bg-color-primary hover:bg-orange"
		@click="setRangeValue(1)"  @click.right.prevent="setRangeValue(-1)">
		{{ rangeText }}
	</div>  

</template>
