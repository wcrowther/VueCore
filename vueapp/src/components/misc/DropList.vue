<script setup>

	import { useDropdownPlacement } from '@/composables/UseDropdownPlacement'

	const MENU_MIN_WIDTH = 176
	const MENU_GAP = 4
	const VIEWPORT_PADDING = 8

	const props = defineProps(
	{
		list: 			{ type: Array, required: true },
		anchorEl: 		{ type: Object, default: null },  // DOM element the list positions relative to
		maxHeight: 		{ type: [Number, String], default: null }
	})

	const isOpen = defineModel({ type: Boolean, required: true })

	const emit = defineEmits(['select', 'hover-enter', 'hover-leave'])

	const menuRef 	= ref(null)
	const position 	= ref({ top: 0, left: 0 })
	const resolvedMaxHeight = ref(null)
	const { resolveVerticalPlacement, resolveTop } = useDropdownPlacement(
	{
		gap: MENU_GAP,
		viewportPadding: VIEWPORT_PADDING
	})

	const hasExplicitMaxHeight = () =>
		props.maxHeight !== null && props.maxHeight !== undefined && props.maxHeight !== ''

	const resolvedMaxHeightCss = computed(() =>
	{
		if (resolvedMaxHeight.value == null)
			return undefined

		return typeof resolvedMaxHeight.value === 'number'
			? `${resolvedMaxHeight.value}px`
			: resolvedMaxHeight.value
	})

	const menuStyle = computed(() =>
	({
		position: 'fixed',
		top: `${position.value.top}px`,
		left: `${position.value.left}px`,
		maxHeight: resolvedMaxHeightCss.value
	}))

	const updatePosition = () =>
	{
		if (!props.anchorEl) return

		const triggerRect = props.anchorEl.getBoundingClientRect()
		const naturalMenuHeight = menuRef.value?.scrollHeight ?? 0
		const menuWidth = menuRef.value?.offsetWidth ?? MENU_MIN_WIDTH

		const maxLeft = window.innerWidth - menuWidth - VIEWPORT_PADDING
		const preferredLeft = triggerRect.right - menuWidth
		const left = Math.max(VIEWPORT_PADDING, Math.min(preferredLeft, maxLeft))

		const verticalPlacement = resolveVerticalPlacement(
		{
			triggerRect,
			naturalMenuHeight,
			explicitMaxHeight: hasExplicitMaxHeight() ? props.maxHeight : null
		})

		const shouldOpenUpward = verticalPlacement.shouldOpenUpward
		resolvedMaxHeight.value = verticalPlacement.resolvedMaxHeight

		const renderedMenuHeight = resolvedMaxHeight.value == null
			? naturalMenuHeight
			: (typeof resolvedMaxHeight.value === 'number'
				? resolvedMaxHeight.value
				: (menuRef.value?.offsetHeight ?? naturalMenuHeight))

		const top = resolveTop(
		{
			triggerRect,
			shouldOpenUpward,
			renderedMenuHeight
		})

		position.value = { top, left }
	}

	const onViewportChange = () => { if (isOpen.value) updatePosition() }

	const selectItem = (item) =>
	{
		emit('select', item)
		isOpen.value = false
	}

	watch(isOpen, async isMenuOpen =>
	{
		if (!isMenuOpen) return

		// Position after Teleport content renders so the first click target stays stable.
		await nextTick()
		updatePosition()
	})

	watch(() => props.list, async () =>
	{
		if (isOpen.value && props.list.length)
		{
			await nextTick()
			updatePosition()
		}
	})

	watch(() => props.maxHeight, () => { if (isOpen.value) updatePosition() })

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
			ref="menuRef" :style="menuStyle"
			class="z-[999] min-w-[11rem] scrollbar-thin overflow-y-auto rounded border border-gray-200 bg-white p-1 shadow-lg"
			@mouseenter="emit('hover-enter')" @mouseleave="emit('hover-leave')">

			<slot :items="list" :select="selectItem">
				<button v-for="item in list" :key="item.id"
					class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					type="button" @click="selectItem(item)">
					{{ item.label }}
				</button>
			</slot>

		</div>
	</Teleport>
</template>
