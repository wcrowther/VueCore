<script setup>

	import {useScroll, useResizeObserver } from '@vueuse/core'

	const props = defineProps(
	{
		tabs: 				{ type: Array, required: true },
		modelValue: 		{ type: [String, Number], required: true },
		showOverflowMenu: 	{ type: Boolean, default: true }
	})

	const emit = defineEmits(['update:modelValue'])

	let observer
	const tabRefs 		= new Map()
	const containerRef 	= ref(null)
	const visibility 	= ref({})
	const isOverflowing = ref(false)
	const overflowTriggerRef = ref(null)
	const isOverflowMenuOpen = ref(false)
	const overflowMenuPosition = ref({ top: 0, left: 0 })

	const OPEN_DELAY_MS = 120
	const CLOSE_DELAY_MS = 180
	let openMenuTimeoutId
	let closeMenuTimeoutId

	const { arrivedState } = useScroll(containerRef)

	const normalizedTabs = computed(() =>
	{
		return props.tabs.map((tab, index) =>
		{
			if (tab && typeof tab === 'object')
			{
				const id = tab.id ?? index
				const label = tab.label ?? String(tab.id ?? index)
				return { ...tab, id, label }
			}

			return {
				id: tab,
				label: String(tab)
			}
		})
	})

	function setTabRef(id, el) 
	{
		if (el) 
			tabRefs.set(id, el)
		else 
			tabRefs.delete(id)
	}

	function createObserver() 
	{
		observer?.disconnect()

		if (!containerRef.value) return
		isOverflowing.value = containerRef.value.scrollWidth > (containerRef.value.clientWidth + 1)

		observer = new IntersectionObserver
		(
			entries => 
			{
				const next = { ...visibility.value }

				entries.forEach(entry => 
				{
					next[entry.target.dataset.tabId] = 
					{
						visible: entry.isIntersecting,
						ratio: entry.intersectionRatio
					}
				})
				visibility.value = next
			},
			{
				root: containerRef.value,
				threshold: [0, 0.01, 0.5, 1]
			}
		)

		tabRefs.forEach(el => observer.observe(el))
	}

	function scrollLeft() 
	{
		containerRef.value?.scrollBy(
		{
			left: -250,
			behavior: 'smooth'
		})
	}

	function scrollRight() 
	{
		containerRef.value?.scrollBy
		({
			left: 250,
			behavior: 'smooth'
		})
	}

	function activateTab(tab) 
	{
		if (!tab) return

		emit('update:modelValue', tab.id)
		const el = tabRefs.get(tab.id)

		el?.scrollIntoView
		({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest'
		})

		closeOverflowMenuNow()
	}

	function clearOpenMenuTimer()
	{
		if (openMenuTimeoutId)
		{
			clearTimeout(openMenuTimeoutId)
			openMenuTimeoutId = undefined
		}
	}

	function clearCloseMenuTimer()
	{
		if (closeMenuTimeoutId)
		{
			clearTimeout(closeMenuTimeoutId)
			closeMenuTimeoutId = undefined
		}
	}

	function openOverflowMenuWithDelay()
	{
		clearCloseMenuTimer()
		if (isOverflowMenuOpen.value) return

		clearOpenMenuTimer()
		openMenuTimeoutId = setTimeout(() =>
		{
			isOverflowMenuOpen.value = true
			updateOverflowMenuPosition()
			openMenuTimeoutId = undefined
		}, OPEN_DELAY_MS)
	}

	function closeOverflowMenuWithDelay()
	{
		clearOpenMenuTimer()

		clearCloseMenuTimer()
		closeMenuTimeoutId = setTimeout(() =>
		{
			isOverflowMenuOpen.value = false
			closeMenuTimeoutId = undefined
		}, CLOSE_DELAY_MS)
	}

	function openOverflowMenuNow()
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		isOverflowMenuOpen.value = true
		updateOverflowMenuPosition()
	}

	function closeOverflowMenuNow()
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		isOverflowMenuOpen.value = false
	}

	function updateOverflowMenuPosition()
	{
		if (!overflowTriggerRef.value) return

		const rect = overflowTriggerRef.value.getBoundingClientRect()
		overflowMenuPosition.value =
		{
			top: rect.bottom + 4,
			left: Math.max(8, rect.right - 176)
		}
	}

	function onOverflowFocusOut(event)
	{
		if (!event.currentTarget?.contains(event.relatedTarget))
			closeOverflowMenuNow()
	}

	function onViewportChange()
	{
		if (isOverflowMenuOpen.value)
			updateOverflowMenuPosition()
	}

	const hiddenTabs = computed(() => 
	{
		if (!isOverflowing.value) return []

		return normalizedTabs.value.filter(tab => 
		{
			const state = visibility.value[tab.id]
			if (!state) return false

			// Treat as hidden only when measured and meaningfully clipped.
			return !state.visible || state.ratio < 0.99
		})
	})

	const showLeftButton 	= computed(() => !arrivedState.left)
	const showRightButton 	= computed(() => !arrivedState.right)

	const overflowMenuStyle = computed(() =>
	({
		position: 'fixed',
		top: `${overflowMenuPosition.value.top}px`,
		left: `${overflowMenuPosition.value.left}px`
	}))

	onMounted(async () => 
	{
		await nextTick()
		createObserver()
		window.addEventListener('resize', onViewportChange)
		window.addEventListener('scroll', onViewportChange, true)
	})

	watch(
		() => props.tabs,
		async () =>
		{
			await nextTick()
			createObserver()
		},
		{ deep: true }
	)

	watch(
		isOverflowMenuOpen,
		isOpen =>
		{
			if (isOpen)
				updateOverflowMenuPosition()
		}
	)

	watch(hiddenTabs, tabs =>
	{
		if (!tabs.length)
			closeOverflowMenuNow()
	})

	useResizeObserver(containerRef, () => { createObserver() })
	onBeforeUnmount(() =>
	{
		observer?.disconnect()
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		window.removeEventListener('resize', onViewportChange)
		window.removeEventListener('scroll', onViewportChange, true)
	})

</script>

<template>
	<div class="flex items-center gap-2 overflow-visible">

		<button v-if="showLeftButton" 
			class="shrink-0" @click="scrollLeft">◀</button>

		<div ref="containerRef" class="flex flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] scroll-smooth [&::-webkit-scrollbar]:hidden">
			<template v-for="tab in normalizedTabs" :key="tab.id" >
				<button :ref="el => setTabRef(tab.id, el)" 
					:data-tab-id="tab.id"
					class="shrink-0 whitespace-nowrap rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800"
					:class="{ 'border-blue-500 bg-blue-50 font-bold text-blue-700': modelValue === tab.id }" 
					@click="activateTab(tab)">
					{{ tab.label }}
				</button>
			</template>

		</div>

		<button v-if="showRightButton" 
			class="shrink-0" @click="scrollRight">▶</button>

		<div v-if="showOverflowMenu && hiddenTabs.length" 
			class="shrink-0"
			@mouseenter="openOverflowMenuWithDelay"
			@mouseleave="closeOverflowMenuWithDelay"
			@focusin="openOverflowMenuNow"
			@focusout="onOverflowFocusOut">
			<div ref="overflowTriggerRef">
				<slot name="overflow-trigger" :is-open="isOverflowMenuOpen" :hidden-count="hiddenTabs.length">
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
						aria-label="Show hidden tabs">
						⋯
					</button>
				</slot>
			</div>
		</div>

		<Teleport to="body">
			<div v-if="showOverflowMenu && hiddenTabs.length && isOverflowMenuOpen"
				:style="overflowMenuStyle"
				class="z-[999] min-w-[11rem] rounded border border-gray-200 bg-white p-1 shadow-lg"
				@mouseenter="openOverflowMenuNow"
				@mouseleave="closeOverflowMenuWithDelay">
				<button
					v-for="tab in hiddenTabs"
					:key="tab.id"
					type="button"
					class="block w-full rounded px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					@click="activateTab(tab)">
					{{ tab.label }}
				</button>
			</div>
		</Teleport>

	</div>
</template>