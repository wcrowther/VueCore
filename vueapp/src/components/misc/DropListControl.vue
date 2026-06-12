<script setup>

	const MENU_MIN_WIDTH = 176
	const MENU_GAP = 4
	const VIEWPORT_PADDING = 8

	const props = defineProps(
	{
		list: 			{ type: Array, required: true },
		anchorEl: 		{ type: Object, default: null }  // DOM element the list positions relative to
	})

	const isOpen = defineModel({ type: Boolean, required: true })

	const emit = defineEmits(['select', 'hover-enter', 'hover-leave'])

	const menuRef 	= ref(null)
	const position 	= ref({ top: 0, left: 0 })

	const menuStyle = computed(() =>
	({
		position: 	'fixed',
		top: 		`${position.value.top}px`,
		left: 		`${position.value.left}px`
	}))

	function updatePosition()
	{
		if (!props.anchorEl) return

		const triggerRect = props.anchorEl.getBoundingClientRect()
		const menuHeight = menuRef.value?.offsetHeight ?? 0
		const menuWidth = menuRef.value?.offsetWidth ?? MENU_MIN_WIDTH

		const maxLeft = window.innerWidth - menuWidth - VIEWPORT_PADDING
		const preferredLeft = triggerRect.right - menuWidth
		const left = Math.max(VIEWPORT_PADDING, Math.min(preferredLeft, maxLeft))

		const spaceBelow = window.innerHeight - triggerRect.bottom - VIEWPORT_PADDING
		const spaceAbove = triggerRect.top - VIEWPORT_PADDING
		const shouldOpenUpward = menuHeight > 0 && spaceBelow < menuHeight && spaceAbove > spaceBelow

		const top = shouldOpenUpward
			? Math.max(VIEWPORT_PADDING, triggerRect.top - menuHeight - MENU_GAP)
			: Math.min(window.innerHeight - VIEWPORT_PADDING, triggerRect.bottom + MENU_GAP)

		position.value = { top, left }
	}

	const onViewportChange = () => { if (isOpen.value) updatePosition() }

	const selectItem = (item) =>
	{
		emit('select', item)
		isOpen.value = false
	}

	watch(isOpen, isMenuOpen =>
	{
		if (isMenuOpen)
		{
			updatePosition()
			nextTick(() => updatePosition())
		}
	})

	watch(() => props.list, async () =>
	{
		if (isOpen.value && props.list.length)
		{
			await nextTick()
			updatePosition()
		}
	})

	onMounted(() =>
	{
		window.addEventListener('resize', onViewportChange)
		window.addEventListener('scroll', onViewportChange, true)
	})

	onBeforeUnmount(() =>
	{
		window.removeEventListener('resize', onViewportChange)
		window.removeEventListener('scroll', onViewportChange, true)
	})

</script>

<template>
	<Teleport to="body">
		<div v-if="isOpen && list.length"
			ref="menuRef"
			:style="menuStyle"
			class="z-[999] min-w-[11rem] rounded border border-gray-200 bg-white p-1 shadow-lg"
			@mouseenter="emit('hover-enter')"
			@mouseleave="emit('hover-leave')">
			<slot :items="list" :select="selectItem">
				<button
					v-for="item in list"
					:key="item.id"
					type="button"
					class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					@click="selectItem(item)">
					{{ item.label }}
				</button>
			</slot>
		</div>
	</Teleport>
</template>
