<script setup>

	import { onClickOutside, useElementBounding } from '@vueuse/core'

	const props = defineProps(
	{
		items: 			{ type: Array, 	 default: () => [] }, 	// [{ label, value }]
		optionsList:	{ type: Object,  default: null }, 		// { value: label }
		hideSelected:	{ type: Boolean, default: true },
		placeholder: 	{ type: String,  default: 'Search...' },
		mode: 			{ type: String,  default: 'capsule' }, 	// 'capsule' | 'comma'
		showAllAndNone:	{ type: Boolean, default: true },		// show 'Select All' and 'Select None'
		labelName:      { type: String,  required: true },  	// label for select
        ruleName:       { type: String },                   	// rule for valiadation. if not set, uses labelName removing spaces
        v$:             { type: Object }                    	// pass in vuelidate validator (validation ignored if not set)
	})

    const modelValue = defineModel()
    const rule       = computed(() => props.ruleName ? props.ruleName : props.labelName.replace(' ','') )
    const hasErrors  = computed(() => props.v$ && props.v$[rule.value] && props.v$[rule.value]?.$errors.length > 0 )

	const search 				= ref('')
	const isOpen 				= ref(false)
	const highlightedIndex 		= ref(-1)
	const selected 				= ref([])
	const recentlyCheckedValues = ref([])
	const filterInput 			= ref(null)
	const dropdownMenu 			= ref(null)
	const optionRefs 			= ref([])
	const dropdownStyle 		= ref({})

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
		(Array.isArray(value) ? value : [])
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
		[() => modelValue.value, normalizedItems],
		([value]) => { selected.value = mapModelValueToItems(value) },{ immediate: true }
	)

	const selectedValues = computed(() => new Set(selected.value.map(item => item.value)))
	const hiddenSelectedValues = computed(() =>
		props.hideSelected
			? new Set([...selectedValues.value, ...recentlyCheckedValues.value])
			: new Set()
	)

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

	const el 						= useTemplateRef('inputContainer')
	const { bottom, left, width } 	= useElementBounding(el)
	const updateDropdownPosition 	= () =>
	{
		dropdownStyle.value = 
		{
			left: 	`${left.value}px`,
			top: 	`${bottom.value}px`,
			width: 	`${width.value}px`
		}
	}

	const openDropdown = () =>
	{
		isOpen.value = true
		nextTick(() =>
		{
			updateDropdownPosition()
			filterInput.value?.focus()
		})
	}

	const toggleDropdown = () =>
	{
		if (isOpen.value)
		{
			closeDropdown()
			return
		}
		openDropdown()
	}

	const clearSearch = () =>
	{
		search.value = ''
		filterInput.value?.focus()
		openDropdown()
	}

	const emitSelected = () =>
	{
		modelValue.value = props.optionsList
			? selected.value.map(item => item.value)
			: selected.value
	}

	const hideItemAfterFeedback = (item) =>
	{
		recentlyCheckedValues.value = [...recentlyCheckedValues.value, item.value]

		window.setTimeout(() =>
		{
			selected.value = [...selected.value, item]
			recentlyCheckedValues.value = recentlyCheckedValues.value.filter(value => value !== item.value)
			emitSelected()
			openDropdown()
		}, 120)
	}

	const selectItem = (item) => 
	{
		if (selectedValues.value.has(item.value))
		{
			removeItem(item)
			return
		}

		if (!recentlyCheckedValues.value.includes(item.value)) 
		{
			hideItemAfterFeedback(item)
		}
	}

	const removeItem = (item) => 
	{
		selected.value = selected.value.filter(s => s.value !== item.value)
		emitSelected()
	}

	const selectAllItems = () =>
	{
		recentlyCheckedValues.value = []
		selected.value = [...normalizedItems.value]
		emitSelected()
		openDropdown()
	}

	const clearSelectedItems = () =>
	{
		recentlyCheckedValues.value = []
		selected.value = []
		emitSelected()
		openDropdown()
	}

	const setOptionRef = (element, index) =>
	{
		if (element)
		{
			optionRefs.value[index] = element
			return
		}

		optionRefs.value.splice(index, 1)
	}

	const scrollHighlightedItemIntoView = () =>
	{
		const option = optionRefs.value[highlightedIndex.value]

		if (isOpen.value && option)
		{
			option.scrollIntoView({ block: 'nearest' })
		}
	}

	const toggleHighlightedItem = () =>
	{
		const index = highlightedIndex.value < 0 ? 0 : highlightedIndex.value
		const item = filteredItems.value[index]

		if (item)
		{
			selectItem(item)
		}
	}

	// Key action methods  ================================================

	const highlightNext    = () 	=> { if (!filteredItems.value.length) return
									  	 	highlightedIndex.value = highlightedIndex.value < 0
											? 0
											: (highlightedIndex.value + 1) % filteredItems.value.length 
										}

	const highlightPrev    = () 	=> { if (!filteredItems.value.length) return
									  	 	highlightedIndex.value = highlightedIndex.value < 0
											? filteredItems.value.length - 1
											: (highlightedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length 
										}

	const confirmSelection = () 	=> { if (!filteredItems.value.length) return; toggleHighlightedItem() }

	const removeLastSelected = () 	=> { selected.value = selected.value.slice(0, -1); emitSelected() }

	// Keyboard Listeners  ================================================

	const disableKeys = ref(true) // Disable keys if this component is not focused

	const keys = (e) =>
	{
		if      (e.key === 'ArrowDown')                  { highlightNext();    e.preventDefault(); }
		else if (e.key === 'ArrowUp')                    { highlightPrev();    e.preventDefault(); }
		else if (e.key === 'Enter')                      { confirmSelection(); e.preventDefault(); }
		else if (e.key === 'Escape')                     { closeDropdown()      }
		else if (e.key === 'Backspace' && !search.value) { removeLastSelected() }
	}

	KeyboardListeners(keys, disableKeys)

	const onFocus = () => { disableKeys.value = false; openDropdown() }
	const onBlur  = () => { disableKeys.value = true;  window.setTimeout(() => closeDropdown(), 150) }

	const setHighlightedIndex = (index) =>
	{
		highlightedIndex.value = index
	}

	const isChecked = (item) => recentlyCheckedValues.value.includes(item.value) || selectedValues.value.has(item.value)
	const showClearButton = computed(() => search.value.length > 0)

	onClickOutside(el, () =>
	{
		if (isOpen.value)
		{
			closeDropdown()
		}
	}, { ignore: [dropdownMenu] })

	watch(isOpen, (value) =>
	{
		if (!value)
		{
			return
		}

		const handleWindowChange = () => updateDropdownPosition()
		window.addEventListener('resize', handleWindowChange)
		window.addEventListener('scroll', handleWindowChange, true)

		onWatcherCleanup(() =>
		{
			window.removeEventListener('resize', handleWindowChange)
			window.removeEventListener('scroll', handleWindowChange, true)
		})
	})

	watch(filteredItems, (items) =>
	{
		optionRefs.value = []

		if (!items.length)
		{
			highlightedIndex.value = -1
			return
		}

		if (highlightedIndex.value >= items.length)
		{
			highlightedIndex.value = items.length - 1
		}
	})

	watch(highlightedIndex, (index) =>
	{
		if (index < 0)
		{
			return
		}

		nextTick(() => scrollHighlightedItemIntoView())
	})

	onMounted(() => updateDropdownPosition())


</script>

<template>

	<div class="relative w-full mb-3">

		<!-- Text and Validation -->
	    <div class="pb-1 flex justify-between items-baseline">
            <span class="text-color-dark-blue font-bold whitespace-nowrap text-xs">
                {{props.labelName}}
            </span>
            <template v-if="hasErrors">
                <span v-for="error in v$[rule].$errors" :key="error.$uid"
                    class="italic font-bold text-right text-xs text-color-red">
                    {{ error.$message }}
                </span>
            </template> 
        </div>

		<!-- Input container -->
		<div class="relative flex flex-wrap items-center gap-2 border 
			border-slate-400 px-2 py-1 pr-8"
			@click="openDropdown()" ref="inputContainer">

			<!-- Selected items -->
			<template v-if="mode !== 'comma'">
				<span v-for="item in selected" :key="item.value"
					class="flex items-center bg-[#b8d7ed] text-black tracking-wider font-bold pl-3 pr-2 py-[2px] text-xs rounded-full">
					{{ item.label }}
					<button class="ml-1 font-normal text-xs text-blue-400" @click.stop="removeItem(item)">✕</button>
				</span>
			</template>
			<template v-else>
				<span v-for="(item, index) in selected" :key="item.value"
					class="text-xs text-gray-500 break-words">
					{{ item.label }}{{ index < selected.length - 1 ? ',' : '' }}
				</span>
			</template>

			<!-- Input  -->
			<input v-model="search" :placeholder
				class="-ml-2 text-sm border-none border-l border-red flex-1 h-6 min-w-[120px] outline-none placeholder:text-gray-400
				ring-0 shadow-none focus:outline-none bg-transparent focus:ring-0 focus:shadow-none" ref="filterInput"
				@focus="onFocus" @blur="onBlur" />

			<div class="absolute right-8 bottom-1 flex items-center">
				<button type="button" v-if="showClearButton" 
					class="flex-center text-color-dark-gray hover:text-color-mid-gray"
					@click.stop="clearSearch()">
					<IconSymbol width="22px" icon="heroicons:x-mark" />
				</button>
			</div>

			<button type="button" class="absolute right-1 bottom-1 flex size-6 text-color-dark-gray hover:text-color-mid-gray"
				@click.stop="toggleDropdown()">
				<IconSymbol width="20px" class="mt-[2px]" icon="heroicons:chevron-down-20-solid" />
			</button>
		</div>

		<Teleport to="body">

			<ul v-if="isOpen && normalizedItems.length" 
				:style="dropdownStyle" ref="dropdownMenu"
				@mousedown.prevent
				class="fixed z-[999] bg-white border max-h-60 overflow-auto scrollbar-thin rounded shadow">

				<li v-if="showAllAndNone" class="grid grid-cols-2 border-b">
					<button type="button"
						class="px-3 py-1 text-center text-sm text-blue-500 hover:bg-gray-100"
						@click.stop="selectAllItems()">
						Select All
					</button>
					<button type="button"
						class="border-l px-3 py-1 text-center text-sm text-blue-500 hover:bg-gray-100"
						@click.stop="clearSelectedItems()">
						Select None
					</button>
				</li>
				
				<li v-for="(item, index) in filteredItems" :key="item.value" 
					:class="['flex items-center gap-3 px-3 py-2 cursor-pointer',
					{ 'bg-gray-200 text-black': index === highlightedIndex }]"
					:ref="element => setOptionRef(element, index)"
					@click="selectItem(item)" 
					@mouseenter="setHighlightedIndex(index)"
					@mouseleave="setHighlightedIndex(-1)">

					<input type="checkbox" :checked="isChecked(item)" tabindex="-1" 
						class="pointer-events-none h-4 w-4" />

					<span class="text-sm">{{ item.label }}</span>
				</li>
			</ul>

		</Teleport>

	</div>

</template>


<!-- EXAMPLES:

	<MultiSelectInput v-model="selected" :optionsList="items"  :hideSelected="false" />

	<MultiSelectInput v-model="selectedStates" labelName="U.S. States" :optionsList="usStatesList" 
		class="mt-10" mode="comma" :hideSelected="true" />

-->
