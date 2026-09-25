<script setup>

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 		{ type: String, default: '' },
		maxHeight:	{ type: Number, default: 500 }, // caps the open height; the drawer still only grows as tall as its content
		flipVertical:	{ type: Boolean, default: false },
		divider:	{ type: Boolean, default: false } // draws a single border-y + divide-y line instead of relying on slot content borders, which double up at the seam
	});

</script>

<template>

	<div :class="['flex', props.flipVertical ? 'flex-col-reverse' : 'flex-col',
		props.divider ? 'border-y divide-y border-gray-300 divide-gray-300' : '',
		props.divider && props.flipVertical ? 'divide-y-reverse' : '']" :id="props.id">

		<div class="flex-none transition-all duration-[300ms] overflow-hidden"
			:style="{ maxHeight: drawerHidden ? '0px' : props.maxHeight + 'px' }">
			<slot name="drawer" />
		</div>

		<div class="relative grow w-full overflow-hidden">
			<div class="relative z-10">
				<slot name="default" />
			</div>
		</div>

	</div>

</template>

<!-- Usage: 

	<TopDrawerControl v-model:drawerHidden="hidden">
		<template #drawer>
			// Drawer content here, slides down from the top
		</template>
		// Main content here
	</TopDrawerControl>

	Pass :flipVertical="true" to put the drawer at the bottom instead of the top:

	<TopDrawerControl v-model:drawerHidden="hidden" flipVertical>
		<template #drawer>
			// Drawer content here, slides up from the bottom
		</template>
		// Main content here
	</TopDrawerControl>
-->
