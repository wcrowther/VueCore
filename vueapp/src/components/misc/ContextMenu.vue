<script setup>

	const props = defineProps(
	{
		items: Array
	})

	const visible 	= ref(false)
	const context 	= ref(null)
	const x 		= ref(0)
	const y 		= ref(0)

	const open = (event, ctx) =>
	{
		event.preventDefault()

		x.value = event.clientX
		y.value = event.clientY
		context.value = ctx

		visible.value = true

		setTimeout(() => 
		{
			window.addEventListener('click', onClickOutside)
		}, 
		0)
	}

	const close = 			() => visible.value = false; 	context.value = null
	const onClickOutside = 	() => close()
	const onEscape = 		(e) => { if (e.key === 'Escape') close() }
	const onItemClick = 	(item) =>
	{
		if (item.disabled) return
		item.action?.(context.value)
		close()
	}

	onMounted(() => { window.addEventListener('keydown', onEscape) })

	onBeforeUnmount(() => 
	{
		window.removeEventListener('click', onClickOutside)
		window.removeEventListener('keydown', onEscape)
	})

	defineExpose({ open, close })

	const menuItemClasses = (item) => { return item.disabled 
										? 'text-gray-400 cursor-not-allowed'
										: 'hover:bg-gray-100 text-gray-700 cursor-not-allowed' }

</script>

<template>
	<Teleport to="#modals">

		<div v-if="visible" 
			:style="{ top: y + 'px', left: x + 'px' }"
			class="fixed z-[9999] bg-white border border-gray-200 shadow-lg min-w-[200px] py-1">

			<div v-for="(item, i) in props.items" :key="i" 
				class="flex items-center gap-2 px-4 py-2 text-sm select-none" 
				:class="menuItemClasses(item)" @click="onItemClick(item)">
				 
				<span v-if="item.icon" class="w-4">
					{{ item.icon }}
				</span>
				<span>{{ item.label }}</span>
			</div>
		</div>

	</Teleport>
</template>

