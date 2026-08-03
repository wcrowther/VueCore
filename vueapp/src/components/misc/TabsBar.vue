<script setup>

	import { useEventListener, useResizeObserver, useScroll } from '@vueuse/core'

	const HIDDEN_EDGE_TOLERANCE_PX 	= 1.5
	const OPEN_DELAY_MS 			= 120
	const CLOSE_DELAY_MS 			= 180
	const RESIZE_END_DELAY_MS 		= 140
		
	let openMenuTimeoutId
	let closeMenuTimeoutId
	let resizeEndTimeoutId

	const props = defineProps(
	{
		tabs: 	  		{ type: Array, required: true },
		overflow: 		{ type: String, 
							default: 'scroll',
							validator: value => ['scroll', 'menu'].includes(value) 
						},
		enableShortcuts:{ type: Boolean, default: false },
		overflowMenuMaxHeight: { type: [Number, String], default: null }
	})

	const selectedTabId = defineModel({ type: [String, Number], required: true })

	const tabRefs 			 	= new Map()
	const containerRef 		 	= ref(null)
	const isOverflowing 	 	= ref(false)
	const layoutRecalcTick 		= ref(0)
	const overflowTriggerRef 	= ref(null)
	const isOverflowMenuOpen 	= ref(false)
	const { x } 				= useScroll(containerRef)
	
	const overflowMode 			= computed(() => props.overflow === 'menu' ? 'menu' : 'scroll')
	const useScrollOverflow 	= computed(() => overflowMode.value === 'scroll')
	const useMenuOverflow 		= computed(() => overflowMode.value === 'menu')

	const normalizedTabs = computed(() =>
		props.tabs.map((tab, index) =>
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
	)

	const setTabRef = (id, el) =>
	{
		if (el) 
			tabRefs.set(id, el)
		else 
			tabRefs.delete(id)
	}

	const updateOverflowState = () =>
	{
		if (!containerRef.value) return
		isOverflowing.value = containerRef.value.scrollWidth > (containerRef.value.clientWidth + 1)
		layoutRecalcTick.value += 1
	}

	const selectedTabIndex 	= computed(() => normalizedTabs.value.findIndex(tab => tab.id === selectedTabId.value) )
	const canSelectPrevious = computed(() => selectedTabIndex.value > 0)
	const canSelectNext 	= computed(() => selectedTabIndex.value >= 0 && selectedTabIndex.value < (normalizedTabs.value.length - 1) )

	const selectTabAtIndex = index =>
	{
		const tab = normalizedTabs.value[index]
		if (!tab) return

		activateTab(tab)
	}

	const selectFirstTab 	= () => selectTabAtIndex(0)
	const selectLastTab 	= () => selectTabAtIndex(normalizedTabs.value.length - 1)

	const selectPreviousTab = () =>
	{
		if (!normalizedTabs.value.length) return
		if (selectedTabIndex.value === -1)
		{
			selectLastTab()
			return
		}

		if (!canSelectPrevious.value) return
		selectTabAtIndex(selectedTabIndex.value - 1)
	}

	const selectNextTab = () =>
	{
		if (!normalizedTabs.value.length) return
		if (selectedTabIndex.value === -1)
		{
			selectFirstTab()
			return
		}

		if (!canSelectNext.value) return
		selectTabAtIndex(selectedTabIndex.value + 1)
	}

	const activateTab = tab =>
	{
		if (!tab) return

		selectedTabId.value = tab.id
		const el = tabRefs.get(tab.id)

		el?.scrollIntoView
		({
			behavior: 'smooth',
			inline: 'center',
			block: 'nearest'
		})

		closeOverflowMenuNow()
	}

	const resolveTab = tabOrId =>
	{
		if (tabOrId == null) return null

		if (typeof tabOrId === 'object')
		{
			if (tabOrId.id != null)
				return normalizedTabs.value.find(tab => tab.id === tabOrId.id) ?? null

			if (tabOrId.label != null)
				return normalizedTabs.value.find(tab => tab.label === tabOrId.label) ?? null

			return null
		}

		return normalizedTabs.value.find(tab => tab.id === tabOrId) ?? null
	}

	const selectOverflowTab = tabOrId =>
	{
		const tab = resolveTab(tabOrId)
		if (!tab) return

		selectedTabId.value = tab.id

		const el = tabRefs.get(tab.id)
		el?.scrollIntoView
		({
			behavior: 'smooth',
			inline: 'nearest',
			block: 'nearest'
		})

		closeOverflowMenuNow()
	}

	const clearOpenMenuTimer = () =>
	{
		if (openMenuTimeoutId)
		{
			clearTimeout(openMenuTimeoutId)
			openMenuTimeoutId = undefined
		}
	}

	const clearCloseMenuTimer = () =>
	{
		if (closeMenuTimeoutId)
		{
			clearTimeout(closeMenuTimeoutId)
			closeMenuTimeoutId = undefined
		}
	}

	const openOverflowMenuWithDelay = () =>
	{
		clearCloseMenuTimer()
		if (isOverflowMenuOpen.value) return

		clearOpenMenuTimer()
		openMenuTimeoutId = setTimeout(() =>
		{
			isOverflowMenuOpen.value = true
			openMenuTimeoutId = undefined
		}, OPEN_DELAY_MS)
	}

	const closeOverflowMenuWithDelay = () =>
	{
		clearOpenMenuTimer()

		clearCloseMenuTimer()
		closeMenuTimeoutId = setTimeout(() =>
		{
			isOverflowMenuOpen.value = false
			closeMenuTimeoutId = undefined
		}, CLOSE_DELAY_MS)
	}

	const openOverflowMenuNow = () =>
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		isOverflowMenuOpen.value = true
	}

	const closeOverflowMenuNow = () =>
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		isOverflowMenuOpen.value = false
	}

	const toggleOverflowMenu = () =>
	{
		if (isOverflowMenuOpen.value)
			closeOverflowMenuNow()
		else
			openOverflowMenuNow()
	}

	const ensureActiveTabInView = () =>
	{
		const el = tabRefs.get(selectedTabId.value)
		el?.scrollIntoView
		({
			behavior: 'auto',
			inline: 'nearest',
			block: 'nearest'
		})
	}

	const scheduleEnsureActiveTabInView = () =>
	{
		if (resizeEndTimeoutId)
			clearTimeout(resizeEndTimeoutId)

		resizeEndTimeoutId = setTimeout(() =>
		{
			ensureActiveTabInView()
			resizeEndTimeoutId = undefined
		}, RESIZE_END_DELAY_MS)
	}

	const onOverflowFocusOut = event =>
	{
		if (!event.currentTarget?.contains(event.relatedTarget))
			closeOverflowMenuNow()
	}

	const hiddenTabs = computed(() => 
	{
		const containerEl = containerRef.value
		if (!containerEl || !isOverflowing.value) return []

		const currentLayoutTick = layoutRecalcTick.value
		void currentLayoutTick

		const currentX = x.value
		void currentX

		const containerRect = containerEl.getBoundingClientRect()

		return normalizedTabs.value.filter(tab =>
		{
			const el = tabRefs.get(tab.id)
			if (!el) return false

			const tabRect = el.getBoundingClientRect()
			const hiddenOnLeft = tabRect.left < (containerRect.left - HIDDEN_EDGE_TOLERANCE_PX)
			const hiddenOnRight = tabRect.right > (containerRect.right + HIDDEN_EDGE_TOLERANCE_PX)

			return hiddenOnLeft || hiddenOnRight
		})
	})

	const hasHiddenTabs 	= computed(() => isOverflowing.value)
	const disableShortcuts 	= computed(() => !props.enableShortcuts)

	// =============================================================================

	const keys = 
	{
		'ArrowLeft': 	() => selectPreviousTab(),
		'ArrowRight': 	() => selectNextTab(),
		'Home':     	() => selectFirstTab(),
		'End':      	() => selectLastTab()
	}

	KeyboardListeners(keys, disableShortcuts)

	// =============================================================================

	onMounted(async () => 
	{
		await nextTick()
		updateOverflowState()
	})

	watch(() => props.tabs,
		async () =>
		{
			await nextTick()
			updateOverflowState()
		},
		{ deep: true }
	)

	watch(hiddenTabs, 		tabs => { if (!tabs.length) closeOverflowMenuNow() })
	watch(useMenuOverflow, 	isMenuMode => { if (!isMenuMode) closeOverflowMenuNow() })

	useResizeObserver(containerRef, () =>
	{
		updateOverflowState()
		scheduleEnsureActiveTabInView()
	})

	useEventListener(window, 'resize', () =>
	{
		updateOverflowState()
		scheduleEnsureActiveTabInView()
	})

	onBeforeUnmount(() =>
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()

		if (resizeEndTimeoutId)
			clearTimeout(resizeEndTimeoutId)
	})

</script>

<template>
	<div class="relative flex h-9 gap-2 overflow-visible">

		<div class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gray-400 z-0"></div>

		<div class="shrink-0 w-7 flex items-center justify-center">
			<button v-if="useScrollOverflow" type="button"
				class="h-7 w-7 transition-opacity"
				:class="hasHiddenTabs
					? (canSelectPrevious ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canSelectPrevious"
				aria-label="Select previous tab"
				@contextmenu.prevent="selectFirstTab"
				@click="selectPreviousTab">◀</button>
		</div>

		<div ref="containerRef"
			class="relative flex flex-1 gap-1 items-end min-w-0 z-[90] scroll-smooth"
			:class="useMenuOverflow
				? 'overflow-hidden'
				: 'overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'">
			
			<!-- List of Tabs -->
			<div v-for="tab in normalizedTabs" :key="tab.id"
				:ref="el => setTabRef(tab.id, el)"
				:data-tab-id="tab.id" class="shrink-0 flex items-end z-[100]">

				<slot name="tab-button" :tab :is-active="selectedTabId === tab.id"
					:activate="() => activateTab(tab)">
					<div :class="selectedTabId === tab.id ? 'tab-active' : 'tab-other'"
						@click="activateTab(tab)">
						{{ tab.label }}
					</div>
				</slot>

			</div>

		</div>

		<div class="shrink-0 w-7 flex items-center justify-center">
			<button v-if="useScrollOverflow" type="button"
				class="h-7 w-7 transition-opacity"
				:class="hasHiddenTabs
					? (canSelectNext ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canSelectNext"
				aria-label="Select next tab"
				@contextmenu.prevent="selectLastTab"
				@click="selectNextTab">▶</button>

			<div v-else-if="useMenuOverflow"
				ref="overflowTriggerRef"
				:class="hiddenTabs.length ? '' : 'pointer-events-none'"
				@mouseenter="openOverflowMenuWithDelay"
				@mouseleave="closeOverflowMenuWithDelay"
				@focusin="openOverflowMenuNow"
				@focusout="onOverflowFocusOut"
				@click="toggleOverflowMenu">

				<slot name="overflow-trigger"
					:is-open="isOverflowMenuOpen" :hidden-count="hiddenTabs.length">
					<button type="button"
						class="inline-flex rounded-full size-6 m-1 items-center justify-center border border-gray-400
						bg-white text-gray-700 hover:bg-gray-50 transition-opacity"
						:class="hiddenTabs.length ? 'opacity-100' : 'opacity-0 pointer-events-none'"
						aria-label="Show hidden tabs">⋮</button>
				</slot>
			</div>
		</div>

		<DropList v-if="useMenuOverflow"
			v-model="isOverflowMenuOpen" :list="hiddenTabs" :anchorEl="overflowTriggerRef"
			:maxHeight="props.overflowMenuMaxHeight"
			@select="selectOverflowTab" @hover-enter="openOverflowMenuNow" 
			@hover-leave="closeOverflowMenuWithDelay" />

	</div>
</template>

<style lang="postcss" scoped>
	.tab-active { @apply mt-0 px-4 pb-2 pt-[.4rem] rounded-t-md border bg-white border-gray-400 border-b-0
		text-sm z-[100] font-bold select-none relative bottom-[-1px] whitespace-nowrap cursor-pointer }
	.tab-other  { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border
		border-transparent text-sm font-bold hover:bg-gray-200 whitespace-nowrap cursor-pointer }
</style>