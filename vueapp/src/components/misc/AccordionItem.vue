<script setup>

	const accordion = inject('accordion')

	const index = ref(-1)

	onMounted(() => { index.value = accordion.registerItem() })

	const isOpen = computed(() => accordion.openSet.value.has(index.value) )

	const toggle = () => accordion.toggle(index.value)

</script>

<template>
	<div>
		<!-- Header -->
		<button class="w-full flex justify-between items-center p-4 mb-2
			text-left font-medium bg-blue-100 hover:bg-gray-100"
			@click="toggle">
			<slot name="header" />

			<svg class="w-4 h-4 transition-transform duration-300" 
				:class="{ 'rotate-180': isOpen }" fill="none"
				stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

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
					<slot name="body" />
				</div>
			</div>
		</transition>
	</div>
</template>
