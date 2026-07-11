<script setup>

	const defaultTransitionMs = 500
	const props = defineProps(
	{
		title: { type: String },
		transitionMs: { type: Number, default: defaultTransitionMs} 
	})

	const accordion			= inject('accordion', null)
	const index 			= accordion?.registerItem?.() ?? -1
	const isOpen 			= computed(() => accordion.openSet.value.has(index) )
	const transitionSpeed	= computed(() => Number(props.transitionMs) || defaultTransitionMs)
	const transitionEase 	= 'ease'

	// Test if AccordionItem is in required AccordionControl
	if (!accordion) 
		throw new Error('[AccordionItem] Missing accordion context. You must wrap an AccordionItem inside an AccordionControl.')

	const toggleItem		= () => accordion.toggle(index)

	const setTransitionStyles = (el) =>
	{
		el.style.transition = `height ${transitionSpeed.value}ms ${transitionEase}, opacity ${transitionSpeed.value}ms ${transitionEase}`
		el.style.overflow = 'hidden'
	}

	const runTransition = (el, height, opacity, done) =>
	{
		let finished = false

		const finish = () =>
		{
			if (finished) return
			finished = true
			el.removeEventListener('transitionend', onTransitionEnd)
			done()
		}

		const onTransitionEnd = (event) =>
		{
			if (event.target === el && event.propertyName === 'height')
				finish()
		}

		el.addEventListener('transitionend', onTransitionEnd)

		// Fallback in case transitionend does not fire (e.g., reduced-motion settings).
		setTimeout(finish, transitionSpeed.value + 60)

		requestAnimationFrame(() =>
		{
			el.style.height = height
			el.style.opacity = opacity
		})
	}

	const clearTransitionStyles = (el) =>
	{
		el.style.height = ''
		el.style.opacity = ''
		el.style.overflow = ''
		el.style.transition = ''
	}

	const onBeforeEnter = (el) =>
	{
		setTransitionStyles(el)
		el.style.height = '0px'
		el.style.opacity = '0'
	}

	const onEnter = (el, done) =>
	{
		void el.offsetHeight
		runTransition(el, `${el.scrollHeight}px`, '1', done)
	}

	const onAfterEnter = (el) =>
	{
		clearTransitionStyles(el)
	}

	const onBeforeLeave = (el) =>
	{
		setTransitionStyles(el)
		el.style.height = `${el.scrollHeight}px`
		el.style.opacity = '1'
	}

	const onLeave = (el, done) =>
	{
		void el.offsetHeight
		runTransition(el, '0px', '0', done)
	}

	const onAfterLeave = (el) =>
	{
		// Keep collapsed dimensions until v-show fully hides the element to avoid a final frame jump.
		el.style.transition = ''
	}

</script>

<template>
	<div>
		<!-- Header -->
		<div class="w-full flex justify-between  items-center 
			px-3 py-2 text-left font-medium bg-blue-100 hover:bg-gray-100"
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
			:css="false"
			@before-enter="onBeforeEnter"
			@enter="onEnter"
			@after-enter="onAfterEnter"
			@before-leave="onBeforeLeave"
			@leave="onLeave"
			@after-leave="onAfterLeave">

			<div v-show="isOpen" class="overflow-hidden">
				<div class="p-4 border border-t-0">
					<slot />
				</div>
			</div>
		</transition>
	</div>
</template>

<!-- Usage:

	<AccordionControl>
		<AccordionItem title="What is Vue?">
			Vue is a progressive JavaScript framework.
		</AccordionItem>
	</AccordionControl>

	<AccordionControl :multiple="true">
		<AccordionItem :transitionMs="300">
			<template #header>
				Custom Header Content
			</template>
			Custom body content with slot markup.
		</AccordionItem>
	</AccordionControl>

	- Must be rendered inside an AccordionControl.
	- Header can use title prop or custom #header slot.
	- transitionMs controls open/close animation speed.
-->
