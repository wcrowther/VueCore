<script setup>

	const props = defineProps({ title: { type: String } })

	const accordion		= inject('accordion')
	const index 		= ref(-1)
	const isOpen 		= computed(() => accordion.openSet.value.has(index.value) )
	const toggleItem	= () => accordion.toggle(index.value)

	onMounted(() => { index.value = accordion.registerItem() })

</script>

<template>
	<div>
		<!-- Header -->
		<div class="w-full flex justify-between items-center px-3 py-2 mb-2
			text-left font-medium bg-blue-100 hover:bg-gray-100"
			@click="toggleItem">

			<!-- Header w/ default title as content -->
			<slot name="header">
				<span v-if="title">{{ title }}</span>
			</slot>

			<RotateButton v-model="isOpen" rotation="rotate-180" 
				no-click size="18px" icon="heroicons:chevron-down-solid" /> 	
		</div>

		<!-- Body -->
		<transition 
			enter-active-class="transition-all duration-300 ease"
			leave-active-class="transition-all duration-300 ease" 
			enter-from-class="max-h-0 opacity-0"
			enter-to-class="max-h-96 opacity-100" 
			leave-from-class="max-h-96 opacity-100"
			leave-to-class="max-h-0 opacity-0">

			<div v-show="isOpen" class="overflow-hidden border-t">
				<div class="p-4 text-gray-600">
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>
