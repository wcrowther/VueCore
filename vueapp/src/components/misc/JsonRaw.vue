<script setup>

	const isOpen = defineModel('isOpen', { type: Boolean, default: false })

	const props = defineProps(
	{
		json:  { type: [Object, Array, String, Number, Boolean, null], required: true },
		label: { type: [Object, Array, String, Number, Boolean, null], default: '' },
	})

</script>

<template>

	<div @click.stop.prevent="isOpen = !isOpen"
		class="border-b-[3px] border-b-color-primary">

		<div class="bg-transparent border-t-[3px] font-bold select-none flex items-center border-color-primary">
			<RotateButton v-model="isOpen" :noClick="true" icon="material-symbols-light:play-arrow" />
			<div class="p-1">{{ props.label }}
				<span class="text-gray-400 ml-1 hidden sm:inline">- Raw Json View</span>
			</div>
		</div>

		<pre v-show="isOpen" class="w-full ml-[10px] mt-0 pt-2 border-t border-t-gray-300 "
			>{{ JSON.stringify(props.json, null, 5) }}
		</pre>
	</div>

</template>
