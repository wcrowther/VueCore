
<script setup>

	const vmIndex	= defineModel('index', { type: Number, default: 0 })
	const vmValue	= defineModel('value', { default: null })

	const props = defineProps(
	{
		rangeList: 	{ type: Array, default: () => ['One', 'Two', 'Three'] },
		wrapBack: 	{ type: Boolean, default: true },
		textName:   { type: String, default: null}
	})

	const min  = 0 
	const max  = computed(() => props.rangeList.length-1)

	let syncing = false // bidirectional sync between index and item; syncing guards against feedback loops

	watch(vmIndex, (idx) =>
	{
		syncing = true
		vmValue.value = props.rangeList[idx]
		syncing = false
	}, { immediate: true })

	watch(vmValue, (val) =>
	{
		if (syncing) return

		const idx = props.rangeList.indexOf(val)
		if (idx !== -1) vmIndex.value = idx
	})

	const setRangeValue = (delta) => 
	{
		let val = vmIndex.value + delta

		if (val < min) 
			val = props.wrapBack ? max.value : min
		else if (val > max.value) 
			val = props.wrapBack ? min : max.value

		vmIndex.value = val
	}

	const rangeText = computed(() => 
	{
		const item = props.rangeList[vmIndex.value]
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

<!-- USAGE

	// index only
	<ListButton v-model:index="rangeValue" :rangeList="['One', 'Two', 'Three']" />

	// item only (no index needed by the parent)
	<ListButton v-model:value="rangeItem" :rangeList="['One', 'Two', 'Three']" />

	// both index and item kept in sync
	<ListButton v-model:index="rangeValue" v-model:value="rangeItem" :rangeList="['One', 'Two', 'Three']" />

	// object list; value is the whole matching object
	<ListButton v-model:value="selectedPage" :rangeList="webPages" textName="url" />
-->

