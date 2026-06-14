<script setup>

	import {useScroll, useResizeObserver } from '@vueuse/core'

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

	let observer
	const tabRefs 			 = new Map()
	const containerRef 		 = ref(null)
	const visibility 		 = ref({})
	const isOverflowing 	 = ref(false)
	const overflowTriggerRef = ref(null)
	const isOverflowMenuOpen = ref(false)

	const OPEN_DELAY_MS = 120
	const CLOSE_DELAY_MS = 180	

	let openMenuTimeoutId
	let closeMenuTimeoutId

	const { arrivedState } 	= useScroll(containerRef)
	const overflowMode 		= computed(() => props.overflow === 'menu' ? 'menu' : 'scroll')
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

	function getScrollTargetLeft(direction)
	{
		const containerEl = containerRef.value
		if (!containerEl) return null

		const currentLeft = containerEl.scrollLeft
		const viewportWidth = containerEl.clientWidth
		const currentRight = currentLeft + viewportWidth
		const maxScroll = Math.max(0, containerEl.scrollWidth - containerEl.clientWidth)
		const EPSILON = 1
		const tabs = normalizedTabs.value
			.map(tab => tabRefs.get(tab.id))
			.filter(Boolean)

		if (!tabs.length) return null

		if (direction === 'right')
		{
			const nextHiddenOnRight = tabs.find(tabEl =>
				(tabEl.offsetLeft + tabEl.offsetWidth) > (currentRight + EPSILON)
			)

			if (!nextHiddenOnRight)
				return maxScroll

			const tabLeft = nextHiddenOnRight.offsetLeft
			const tabRight = tabLeft + nextHiddenOnRight.offsetWidth

			if (nextHiddenOnRight.offsetWidth <= viewportWidth)
				return Math.min(Math.max(0, tabRight - viewportWidth), maxScroll)

			// Oversized tab cannot be fully shown; align its left edge.
			return Math.min(Math.max(0, tabLeft), maxScroll)
		}

		const previousHiddenOnLeft = [...tabs].reverse().find(tabEl =>
			tabEl.offsetLeft < (currentLeft - EPSILON)
		)

		if (!previousHiddenOnLeft)
			return 0

		return Math.min(Math.max(0, previousHiddenOnLeft.offsetLeft), maxScroll)
	}

	function scrollLeft() 
	{
		const target = getScrollTargetLeft('left')
		if (target == null) return

		containerRef.value?.scrollTo({ left: target, behavior: 'smooth' })
	}

	function scrollToStart()
	{
		containerRef.value?.scrollTo({ left: 0, behavior: 'smooth' })
	}

	function scrollToEnd()
	{
		const containerEl = containerRef.value
		if (!containerEl) return

		const maxScroll = Math.max(0, containerEl.scrollWidth - containerEl.clientWidth)
		containerEl.scrollTo({ left: maxScroll, behavior: 'smooth' })
	}

	function scrollRight() 
	{
		const target = getScrollTargetLeft('right')
		if (target == null) return

		containerRef.value?.scrollTo({ left: target, behavior: 'smooth' })
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

	function resolveTab(tabOrId)
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

	function selectOverflowTab(tabOrId)
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
		const containerEl = containerRef.value
		if (!containerEl || !isOverflowing.value) return []

		const containerRect = containerEl.getBoundingClientRect()
		const EDGE_TOLERANCE_PX = 1.5

		return normalizedTabs.value.filter(tab =>
		{
			const el = tabRefs.get(tab.id)
			if (!el) return false

			const tabRect = el.getBoundingClientRect()
			const hiddenOnLeft = tabRect.left < (containerRect.left - EDGE_TOLERANCE_PX)
			const hiddenOnRight = tabRect.right > (containerRect.right + EDGE_TOLERANCE_PX)

			return hiddenOnLeft || hiddenOnRight
		})
	})

	const hasHiddenTabs 	= computed(() => isOverflowing.value)
	const canScrollLeft 	= computed(() => !arrivedState.left)
	const canScrollRight 	= computed(() => !arrivedState.right)
	const disableShortcuts = computed(() => !props.enableShortcuts || !useScrollOverflow.value)

	const keys = function (e)
	{
		if (e.code === 'ArrowLeft')      { scrollLeft();    e.preventDefault() }
		else if (e.code === 'ArrowRight'){ scrollRight();   e.preventDefault() }
		else if (e.code === 'Home')      { scrollToStart(); e.preventDefault() }
		else if (e.code === 'End')       { scrollToEnd();   e.preventDefault() }
	}

	KeyboardListeners(keys, disableShortcuts)

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

		<div class="shrink-0 w-7 flex items-center justify-center">
			<button v-if="useScrollOverflow" type="button"
				class="h-7 w-7 transition-opacity"
				:class="hasHiddenTabs
					? (canScrollLeft ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canScrollLeft"
				aria-label="Scroll tabs left"
				@contextmenu.prevent="scrollToStart"
				@click="scrollLeft">◀</button>
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
					? (canScrollRight ? 'opacity-100' : 'opacity-40')
					: 'opacity-0 pointer-events-none'"
				:disabled="!canScrollRight"
				aria-label="Scroll tabs right"
				@contextmenu.prevent="scrollToEnd"
				@click="scrollRight">▶</button>

			<div v-else-if="useMenuOverflow"
				ref="overflowTriggerRef"
				:class="hiddenTabs.length ? '' : 'pointer-events-none'"
				@mouseenter="openOverflowMenuWithDelay"
				@mouseleave="closeOverflowMenuWithDelay"
				@focusin="openOverflowMenuNow"
				@focusout="onOverflowFocusOut">

				<slot name="overflow-trigger"
					:is-open="isOverflowMenuOpen" :hidden-count="hiddenTabs.length">
					<button type="button"
						class="inline-flex rounded-full size-6 m-1 items-center justify-center border border-gray-400 bg-white text-gray-700 hover:bg-gray-50 transition-opacity"
						:class="hiddenTabs.length ? 'opacity-100' : 'opacity-0 pointer-events-none'"
						aria-label="Show hidden tabs">⋮</button>
				</slot>
			</div>
		</div>

		<DropListControl v-if="useMenuOverflow"
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