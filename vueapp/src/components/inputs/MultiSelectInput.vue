<script setup>

	const props = defineProps(
	{
		items: 			{ type: Array, 	default: () => [] }, // [{ label, value }]
		optionsList:	{ type: Object, 	default: null }, // { value: label }
		modelValue: 	{ type: Array, 	default: () => [] },
		placeholder: 	{ type: String, default: 'Search...' },
		mode: 			{ type: String, default: 'capsule' } // 'capsule' | 'comma'
	})

	const emit = defineEmits(['update:modelValue'])

	const search 			= ref('')
	const isOpen 			= ref(false)
	const highlightedIndex 	= ref(-1)
	const selected 			= ref([])
	const recentlyCheckedValues = ref([])
	const filterInput = ref(null)

	const normalizedItems = computed(() =>
	{
		if (props.optionsList)
		{
			return Object.entries(props.optionsList)
						 .map(([value, label]) => ({ value, label: String(label) }))
		}

		return props.items.map(item =>
		{
			if (item && typeof item === 'object')
			{
				return {
					label: String(item.label ?? item.text ?? item.value ?? ''),
					value: item.value ?? item.id ?? item.label ?? item.text
				}
			}

			return { label: String(item), value: item }
		})
	})

	const mapModelValueToItems = (value = []) => 
		value
		.map(item =>
		{
			if (item && typeof item === 'object')
			{
				return {
					label: String(item.label ?? item.text ?? item.value ?? ''),
					value: item.value ?? item.id ?? item.label ?? item.text
				}
			}

			return normalizedItems.value.find(option => option.value === item)
		})
		.filter(Boolean)

	watch 
	(
		[() => props.modelValue, normalizedItems],
		([value]) => { selected.value = mapModelValueToItems(value) },{ immediate: true }
	)

	const selectedValues = computed(() => new Set(selected.value.map(item => item.value)))
	const hiddenSelectedValues = computed(() => new Set([...selectedValues.value, ...recentlyCheckedValues.value]))

	const filteredItems = computed(() => 
	{
		const searchValue = search.value.trim().toLowerCase()

		return normalizedItems.value.filter(item =>
		{
			const matchesSearch = !searchValue || item.label.toLowerCase().includes(searchValue)
			return matchesSearch && !hiddenSelectedValues.value.has(item.value)
		})
	})

	const closeDropdown = () =>
	{
		isOpen.value = false
		highlightedIndex.value = -1
	}

	const openDropdown = () =>
	{
		isOpen.value = true
	}

	const clearAll = () =>
	{
		search.value = ''
		selected.value = []
		recentlyCheckedValues.value = []
		emitSelected()
		filterInput.value?.focus()
		openDropdown()
	}

	const emitSelected = () =>
	{
		emit(
			'update:modelValue',
			props.optionsList
				? selected.value.map(item => item.value)
				: selected.value
		)
	}

	const hideItemAfterFeedback = (item) =>
	{
		recentlyCheckedValues.value = [...recentlyCheckedValues.value, item.value]

		window.setTimeout(() =>
		{
			selected.value = [...selected.value, item]
			recentlyCheckedValues.value = recentlyCheckedValues.value.filter(value => value !== item.value)
			emitSelected()
			search.value = ''
			openDropdown()
		}, 120)
	}

	const selectItem = (item) => 
	{
		if (!selectedValues.value.has(item.value) && !recentlyCheckedValues.value.includes(item.value)) 
		{
			hideItemAfterFeedback(item)
		}
	}

	const removeItem = (item) => 
	{
		selected.value = selected.value.filter(s => s.value !== item.value)
		emitSelected()
		openDropdown()
	}

	const onKeyDown = (e) => 
	{
		if (!isOpen.value)
		{
			openDropdown()
		}

		if (!filteredItems.value.length)
		{
			if (e.key === 'Backspace' && !search.value)
			{
				selected.value = selected.value.slice(0, -1)
				emitSelected()
			}
			else if (e.key === 'Escape')
			{
				closeDropdown()
			}
			return
		}

		if (e.key === 'ArrowDown') 
		{
			e.preventDefault()
			highlightedIndex.value = highlightedIndex.value < 0
				? 0
				: (highlightedIndex.value + 1) % filteredItems.value.length
		} 
		else if (e.key === 'ArrowUp') 
		{
			e.preventDefault()
			highlightedIndex.value = highlightedIndex.value < 0
				? filteredItems.value.length - 1
				: (highlightedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length
		} 
		else if (e.key === 'Enter') 
		{
			e.preventDefault()
			const item = filteredItems.value[highlightedIndex.value]

			if (item) selectItem(item)
		} 
		else if (e.key === 'Escape')
		{
			closeDropdown()
		}
		else if (e.key === 'Backspace' && !search.value) 
		{
			selected.value = selected.value.slice(0, -1)
			emitSelected()
		}
	}

	const onBlur = () =>
	{
		window.setTimeout(() =>
		{
			closeDropdown()
		}, 150)
	}

	const setHighlightedIndex = (index) =>
	{
		highlightedIndex.value = index
	}

	const isChecked = (item) => recentlyCheckedValues.value.includes(item.value)
	const showClearButton = computed(() => search.value.length > 0 || selected.value.length > 0)

	const displayValue = () => 
	{
		if (props.mode === 'comma') 
		{
			return selected.value.map(i => i.label).join(', ')
		}
		return ''
	}
</script>

<template>

	<div class="relative w-full">

		<!-- Input container -->
		<div class="relative flex flex-wrap items-center gap-2 border rounded px-2 py-1 pr-8 focus-within:ring"
			@click="openDropdown()">

			<!-- Capsule mode -->
			<template v-if="mode === 'capsule'">
				<span v-for="item in selected" :key="item.value"
					class="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
					{{ item.label }}
					<button class="ml-1 text-xs" @click.stop="removeItem(item)">✕</button>
				</span>
			</template>

			<!-- Input -->
			<input v-model="search" :placeholder="selected.length && mode === 'comma' ? '' : placeholder"
				class="flex-1 outline-none min-w-[120px]" @focus="openDropdown()" @blur="onBlur" @keydown="onKeyDown" ref="filterInput" />

			<div class="absolute top-0 right-0 flex h-full items-center pr-2">
				<button v-if="showClearButton" type="button" class="flex-center text-color-dark-gray hover:text-color-mid-gray"
					@click.stop="clearAll()">
					<IconSymbol width="22px" icon="heroicons:x-mark" />
				</button>
			</div>

			<!-- Comma display overlay -->
			<span v-if="mode === 'comma' && selected.length && !search" class="absolute left-2 right-8 text-gray-500 pointer-events-none overflow-hidden text-ellipsis whitespace-nowrap">
				{{ displayValue() }}
			</span>
		</div>

		<!-- Dropdown -->
		<ul v-if="isOpen && filteredItems.length"
			class="absolute left-0 right-0 top-full z-50 mt-1 bg-white border max-h-60 overflow-auto rounded shadow">
			<li v-for="(item, index) in filteredItems" :key="item.value" @click="selectItem(item)"
				@mouseenter="setHighlightedIndex(index)" @mouseleave="setHighlightedIndex(-1)"
				class="flex items-center gap-3 px-3 py-2 cursor-pointer" :class="{
					'bg-blue-500 text-white': index === highlightedIndex,
					'hover:bg-gray-100': index !== highlightedIndex
				}">
				<input type="checkbox" :checked="isChecked(item)" tabindex="-1" class="pointer-events-none h-4 w-4 rounded" />
				<span>{{ item.label }}</span>
			</li>
		</ul>

	</div>

</template>


<!-- EXAMPLES:

	  <MultiSelectInput v-model="selected" :optionsList="items" mode="capsule" />

-->
