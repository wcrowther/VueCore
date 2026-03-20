<script setup>

	const props = defineProps(
	{
		items: { type: Array, required: true } // [{ label, action, disabled?, icon? }]	
	})

	const visible = ref(false)
	const x = ref(0)
	const y = ref(0)

	function open(event) 
	{
		event.preventDefault()

		x.value = event.clientX
		y.value = event.clientY
		visible.value = true
	}

	function close() 
	{
		visible.value = false
	}

	function onClickOutside(e) 
	{
		if (visible.value) close()
	}

	function onEscape(e) 
	{
		if (e.key === 'Escape') close()
	}

	function onItemClick(item) 
	{
		if (item.disabled) return
		item.action?.()
		close()
	}

	onMounted(() => 
	{
		window.addEventListener('click', onClickOutside)
		window.addEventListener('keydown', onEscape)
	})

	onBeforeUnmount(() => 
	{
		window.removeEventListener('click', onClickOutside)
		window.removeEventListener('contextmenu', close)
		window.removeEventListener('keydown', onEscape)
	})

	defineExpose({ open, close })

</script>
<template>
	<Teleport to="body">
		<div v-if="visible" 
			:style="{ top: y + 'px', left: x + 'px' }"
			class="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-lg min-w-[180px] py-1">
			<div v-for="(item, i) in items" 
				@click="onItemClick(item)" :key="i" 
				class="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer select-none" 
				:class="[ item.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-700']">
				<span v-if="item.icon" class="w-4">
					{{ item.icon }}
				</span>
				<span>{{ item.label }}</span>
			</div>
		</div>
	</Teleport>
</template>

<style scoped>

	/* Optional smooth appearance */
	div {
		animation: fadeIn 0.08s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>