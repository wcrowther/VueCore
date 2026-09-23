<script setup>

	const drawerHidden = defineModel('drawerHidden', { type: Boolean, default: false })

	const props = defineProps(
	{
		id: 		{ type: String, default: '' },
		maxHeight:	{ type: Number, default: 500 } // caps the open height; the drawer still only grows as tall as its content
	});

</script>

<template>

	<div class="flex flex-col" :id="props.id">

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
-->
