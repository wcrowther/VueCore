<script setup>

	import {useScroll, useResizeObserver } from '@vueuse/core'

	const props = defineProps(
	{
		tabs: 	  		{ type: Array, required: true },
		overflow: 		{ type: String, 
							default: 'scroll',
							validator: value => ['scroll', 'menu'].includes(value) 
						},
		scrollStepMode:	{ type: String, 
							default: 'edge',
							validator: value => ['edge', 'fixed'].includes(value) 
						}
	})

	const selectedTabId = defineModel({ type: [String, Number], required: true })

	let observer
	const tabRefs 			 = new Map()
	const containerRef 		 = ref(null)
	const visibility 		 = ref({})
	const isOverflowing 	 = ref(false)
	const overflowTriggerRef = ref(null)
	const isOverflowMenuOpen = ref(false)

	const OPEN_DELAY_MS = 120
	const CLOSE_DELAY_MS = 180	
	const FIXED_SCROLL_STEP_PX = 250

	let openMenuTimeoutId
	let closeMenuTimeoutId

	const { arrivedState } 	= useScroll(containerRef)
	const overflowMode 		= computed(() => props.overflow === 'menu' ? 'menu' : 'scroll')
	const scrollStepMode 	= computed(() => props.scrollStepMode === 'fixed' ? 'fixed' : 'edge')
	const useScrollOverflow = computed(() => overflowMode.value === 'scroll')
	const useMenuOverflow 	= computed(() => overflowMode.value === 'menu')

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

	function getContainerGapPx()
	{
		if (!containerRef.value) return 0

		const styles = getComputedStyle(containerRef.value)
		return Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
	}

	function getTabEdgeState(id)
	{
		const containerEl = containerRef.value
		const tabEl = tabRefs.get(id)
		if (!containerEl || !tabEl) return null

		const EDGE_TOLERANCE_PX = 1
		const containerRect = containerEl.getBoundingClientRect()
		const tabRect = tabEl.getBoundingClientRect()

		return {
			tabEl,
			hiddenLeft: tabRect.right <= containerRect.left + EDGE_TOLERANCE_PX,
			hiddenRight: tabRect.left >= containerRect.right - EDGE_TOLERANCE_PX,
			visible: tabRect.right > containerRect.left + EDGE_TOLERANCE_PX
				&& tabRect.left < containerRect.right - EDGE_TOLERANCE_PX
		}
	}

	function getScrollStepPx(direction)
	{
		if (scrollStepMode.value === 'fixed')
			return FIXED_SCROLL_STEP_PX

		const tabs = normalizedTabs.value
		if (!tabs.length) return 0

		let targetTab

		if (direction === 'right')
		{
			targetTab = [...tabs].reverse().find(tab => getTabEdgeState(tab.id)?.hiddenLeft)
				?? tabs.find(tab => getTabEdgeState(tab.id)?.visible)
		}
		else
		{
			targetTab = tabs.find(tab => getTabEdgeState(tab.id)?.hiddenRight)
				?? [...tabs].reverse().find(tab => getTabEdgeState(tab.id)?.visible)
		}

		const tabEl = targetTab ? tabRefs.get(targetTab.id) : null
		if (!tabEl) return 0

		return tabEl.offsetWidth + getContainerGapPx()
	}

	function scrollLeft() 
	{
		const amount = getScrollStepPx('left')
		if (!amount) return

		containerRef.value?.scrollBy(
		{
			left: -amount,
			behavior: 'smooth'
		})
	}

	function scrollRight() 
	{
		const amount = getScrollStepPx('right')
		if (!amount) return

		containerRef.value?.scrollBy
		({
			left: amount,
			behavior: 'smooth'
		})
	}

	function activateTab(tab) 
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
	}

	function closeOverflowMenuNow()
	{
		clearOpenMenuTimer()
		clearCloseMenuTimer()
		isOverflowMenuOpen.value = false
	}

	function onOverflowFocusOut(event)
	{
		if (!event.currentTarget?.contains(event.relatedTarget))
			closeOverflowMenuNow()
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

	const hasHiddenTabs 	= computed(() => isOverflowing.value)
	const canScrollLeft 	= computed(() => !arrivedState.left)
	const canScrollRight 	= computed(() => !arrivedState.right)

	onMounted(async () => 
	{
		await nextTick()
		createObserver()
	})

	watch(() => props.tabs,
		async () =>
		{
			await nextTick()
			createObserver()
		},
		{ deep: true }
	)

	watch( hiddenTabs, tabs => { if (!tabs.length) closeOverflowMenuNow() } )
	watch(useMenuOverflow, isMenuMode => { if (!isMenuMode) closeOverflowMenuNow() })

	useResizeObserver(containerRef, () => { createObserver() })

	onBeforeUnmount(() =>
	{
		observer?.disconnect()
		clearOpenMenuTimer()
		clearCloseMenuTimer()
	})

</script>

<template>
	<div class="relative flex h-9 gap-2 overflow-visible">

		<div class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gray-400 z-0"></div>

		<div v-if="useScrollOverflow" class="shrink-0 w-7 flex items-center justify-center">
			<button type="button"
				class="h-7 w-7 transition-opacity"
				:class="hasHiddenTabs
					? (canScrollLeft ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canScrollLeft"
				aria-label="Scroll tabs left"
				@click="scrollLeft">◀</button>
		</div>

		<div ref="containerRef"
			class="relative flex flex-1 gap-1 items-end min-w-0 z-[90] scroll-smooth"
			:class="useMenuOverflow
				? 'overflow-x-hidden'
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

		<div v-if="useScrollOverflow" 
		class="shrink-0 w-7 flex items-center justify-center">
			<button type="button"
				class="h-7 w-7 transition-opacity"
				:class="hasHiddenTabs
					? (canScrollRight ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canScrollRight"
				aria-label="Scroll tabs right"
				@click="scrollRight">▶</button>
		</div>

		<div v-if="useMenuOverflow && hiddenTabs.length" class="shrink-0"
			@mouseenter="openOverflowMenuWithDelay"	@mouseleave="closeOverflowMenuWithDelay"
			@focusin="openOverflowMenuNow"	@focusout="onOverflowFocusOut">

			<div ref="overflowTriggerRef">

				<slot name="overflow-trigger" 
				:is-open="isOverflowMenuOpen" :hidden-count="hiddenTabs.length">
					<button type="button"
						class="inline-flex size-7 items-center justify-center rounded border
						border-gray-400 bg-white text-gray-700 hover:bg-gray-50"
						aria-label="Show hidden tabs">⋯</button>
				</slot>

			</div>

		</div>

		<DropListControl v-if="useMenuOverflow"
			v-model="isOverflowMenuOpen" :list="hiddenTabs" :anchorEl="overflowTriggerRef"
			@select="activateTab" @hover-enter="openOverflowMenuNow" 
			@hover-leave="closeOverflowMenuWithDelay" />

	</div>
</template>

<style lang="postcss" scoped>
	.tab-active { @apply mt-0 px-4 pb-2 pt-[.4rem] rounded-t-md border bg-white border-gray-400 border-b-0
		text-sm z-[100] font-bold select-none relative bottom-[-1px] whitespace-nowrap cursor-pointer }
	.tab-other  { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border
		border-transparent text-sm font-bold hover:bg-gray-200 whitespace-nowrap cursor-pointer }
</style>