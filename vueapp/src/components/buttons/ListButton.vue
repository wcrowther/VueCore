
<script setup>

	const modelValue = defineModel ({ type: Number, default: 0	})

	const props = defineProps(
	{
		rangeList: 	{ type: Array, default: () => ['One', 'Two', 'Three'] },
		wrapBack: 	{ type: Boolean, default: true },
		textName:   { type: String, default: null}
	})

	const min  = 0 
	const max  = computed(() => props.rangeList.length-1)

	const setRangeValue = (delta) => 
	{
		let val = modelValue.value + delta

		if (val < min) 
			val = props.wrapBack ? max.value : min
		else if (val > max.value) 
			val = props.wrapBack ? min : max.value

		modelValue.value = val
	}

	const rangeText = computed(() => 
	{
		const item = props.rangeList[modelValue.value]
		if(typeof item === 'object' && item !== null)
		{
			if(props.textName !== null && item[props.textName] !== null)
			{
				return item[props.textName]
			}
			return Object.values(item)[0]
		}
		else
		{
			return item
		}
	})

</script>

<template>
	
	<div class="flex items-center cursor-pointer rounded-full px-4 py-2 h-6 text-xs leading-[1.3rem] select-none
		text-white font-bold tracking-wider align-middle text-center bg-color-primary hover:bg-orange"
		@click="setRangeValue(1)"  @click.right.prevent="setRangeValue(-1)">
		{{ rangeText }}
	</div>  

</template>


		@apply rounded-full h-5 px-2 text-xs leading-[1.3rem] tracking-wider cursor-pointer
			inline-block font-bold select-none text-center align-middler
<!-- USAGE

	const rangeValue = ref(0)
	<ListButton v-model="rangeValue" :rangeList="['One', 'Two', 'Three']" />
-->

