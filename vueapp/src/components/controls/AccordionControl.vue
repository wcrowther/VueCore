<script setup>

	const props = defineProps(
	{
		id: { type: String, default: '' },
		defaultOpen: { type: Array, default: () => [0] },
		multiple: { type: Boolean, default: false }
	})

	const storageKey = computed(() => props.id ? `accordion_open_${props.id}` : '')

	const normalizeOpenIndices = (value) =>
	{
		const list = Array.isArray(value) ? value.filter((v) => Number.isInteger(v) && v >= 0) : []

		if (props.multiple)
			return list

		return list.length ? [list[0]] : []
	}

	const getInitialOpen = () =>
	{
		const defaultOpen = normalizeOpenIndices(props.defaultOpen)

		if (!storageKey.value || typeof window === 'undefined')
			return defaultOpen

		try
		{
			const raw = window.localStorage.getItem(storageKey.value)
			if (!raw)
				return defaultOpen

			const parsed = JSON.parse(raw)
			return normalizeOpenIndices(parsed)
		}
		catch
		{
			return defaultOpen
		}
	}

	const openSet = ref(new Set(getInitialOpen()))
	let indexCounter = 0

	const registerItem = () => indexCounter++

	const toggle = (index) =>
	{
		const set = new Set(openSet.value)

		if (props.multiple) 
		{
			if (set.has(index)) 
				set.delete(index)
			else 
				set.add(index)
		} 
		else 
		{
			if (set.has(index)) 
			{
				set.clear()
			} 
			else 
			{
				set.clear()
				set.add(index)
			}
		}
		openSet.value = set
	}

	watch(openSet, (set) =>
	{
		if (!storageKey.value || typeof window === 'undefined')
			return

		window.localStorage.setItem(storageKey.value, JSON.stringify([...set]))
	})

	provide('accordion',  { openSet, toggle, registerItem })

</script>

<template>
	<div :id="props.id || undefined" class="w-full divide-y bg-white">
		<slot />
	</div>
</template>

<!-- Usage:

	<AccordionControl>
		<AccordionItem title="What is Vue?">Vue is a progressive JavaScript framework.</AccordionItem>
		<AccordionItem title="What is Tailwind?">Tailwind is a utility-first CSS framework.</AccordionItem>
	</AccordionControl>

	<AccordionControl id="help-accordion" :multiple="false" :defaultOpen="[0]">
		<AccordionItem title="First item opens by default">This state will persist by id in localStorage.</AccordionItem>
		<AccordionItem title="Second item">Only one item stays open when multiple=false.</AccordionItem>
	</AccordionControl>

	<AccordionControl id="faq-accordion" :multiple="true" :defaultOpen="[0, 2]">
		<AccordionItem title="Multiple open items">With multiple=true, many items can stay open.</AccordionItem>
	</AccordionControl>
-->