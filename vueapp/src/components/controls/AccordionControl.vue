<script setup>

	const props = defineProps(
	{
		defaultOpen: { type: Array, default: () => [] },
		multiple: { type: Boolean, default: false }
	})

	const openSet = ref(new Set(props.defaultOpen))
	let indexCounter = 0

	const registerItem = () => indexCounter++

	const toggle = (index) =>
	{
		const set = new Set(openSet.value)

		if (props.multiple) 
		{
			if (set.has(index)) 
				set.delete(index)
			else 
				set.add(index)
		} 
		else 
		{
			if (set.has(index)) 
			{
				set.clear()
			} 
			else 
			{
				set.clear()
				set.add(index)
			}
		}
		openSet.value = set
	}

	provide('accordion',  { openSet, toggle, registerItem })

</script>

<template>
	<div class="w-full divide-y bg-white">
		<slot />
	</div>
</template>