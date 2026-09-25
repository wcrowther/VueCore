<script setup>

	const props = defineProps(
	{
		id: 				{ type: String, default: 'TabsFlowControl' },
		tabList: 			{ type: Array, default: () => ['One', 'Two', 'Three'] },
		keepAlive: 			{ type: Boolean, default: false },
		tabBgColor: 		{ type: String, default: 'bg-white' },
		contentClass: 		{ type: String, default: 'p-5 border border-gray-400 border-t-0' },
		altDesign: 			{ type: Boolean, default: false },
		enableShortcuts: 	{ type: Boolean, default: false },
		flattenHideNames: 	{ type: Boolean, default: false },
		menuMaxHeight: 		{ type: [Number, String], default: null },
		flow:				{ type: String,	default: 'scroll', validator: 
								oneOfValidator(['scroll', 'menu', 'flatten'], 'TabsFlowControl.flow', false ) },
	})

	const activeTabModel = defineModel('activeTab', { type: [String, Number], default: '' })
	const internalActiveTab = ref('')
	const slots = useSlots()

	// TabsFlowBar only knows 'scroll'/'menu'; 'flatten' and empty values fall back to 'scroll'
	const barOverflow = computed(() => props.flow === 'menu' ? 'menu' : 'scroll')

	const normalizedTabList = computed(() =>
	{
		const tabs = Array.isArray(props.tabList) ? props.tabList : []

		return tabs.map((tab, index) =>
		{
			if (tab && typeof tab === 'object')
			{
				const id = tab.id ?? index
				const label = tab.label ?? String(tab.id ?? index)
				const slotName = String(tab.slot ?? id)
				return { ...tab, id, label, slotName }
			}

			return {
				id: tab,
				label: String(tab),
				slotName: String(tab)
			}
		})
	})

	const activeTab = computed(
	{
		get()
		{
			const modelTab = activeTabModel.value
			const modelEntry = normalizedTabList.value.find(tab => tab.id === modelTab)
			if (modelEntry)
				return modelEntry.id

			const internalEntry = normalizedTabList.value.find(tab => tab.id === internalActiveTab.value)
			if (internalEntry)
				return internalEntry.id

			return normalizedTabList.value[0]?.id ?? null
		},
		set(tabId)
		{
			const entry = normalizedTabList.value.find(tab => tab.id === tabId)
			if (!entry) return

			internalActiveTab.value = entry.id
			activeTabModel.value = entry.id
		}
	})

	watch(normalizedTabList, tabs =>
		{
			if (!tabs.length) return
		
			if (!tabs.some(tab => tab.id === activeTab.value))
				activeTab.value = tabs[0].id
		}, 
		{ immediate: true, deep: true }
	)

	const tabSlotName 	= (tab) => tab.slotName?.replaceAll('_', ' ')
	const tabContent 	= (tab) => () => slots[tabSlotName(tab)]?.()

</script>

<template>

	<div :id="props.id" class="h-full">

		<div class="flex gap-2 items-end">

			<div class="flex-1 min-w-0">

				<TabsFlowBar v-if="props.flow !== 'flatten'" :tabsColor="props.tabBgColor"
					v-model="activeTab" :tabs="normalizedTabList" :overflow="barOverflow"
					:enableShortcuts="props.enableShortcuts" :menuMaxHeight="props.menuMaxHeight">
					<template #tab-button="{ tab, isActive, activate }">
						<div :class="[{ 'altDesign': props.altDesign }, isActive ? 'tab-active' : 'tab-other', props.tabBgColor]"
							@click="activate()">
							<span>{{ tab.label }}</span>
						</div>
					</template>
				</TabsFlowBar>

			</div>
		</div>

		<div :class="['z-10 h-full opacity-100 overflow-y-auto scrollbar-thin border-gray-400', props.tabBgColor]">

			<slot />

			<template v-if="props.flow === 'flatten'">
				<template v-for="tab in normalizedTabList" :key="tab.id">
					<div v-if="!props.flattenHideNames" class="flatten-tab-name">
						{{ tab.label }}
					</div>
					<slot name="wrapper" :tab="tab" :content="tabContent(tab)">
						<div :class="props.contentClass">
							<slot :name="tabSlotName(tab)" />
						</div>
					</slot>
				</template>
			</template>

			<template v-else-if="props.keepAlive">
				<template v-for="tab in normalizedTabList" 
					:key="tab.id" v-show="activeTab === tab.id">
					<slot name="wrapper" :tab="tab" :content="tabContent(tab)">
						<div :class="props.contentClass">
							<slot :name="tabSlotName(tab)" />
						</div>
					</slot>
				</template>
			</template>
			<template v-else>
				<template v-for="tab in normalizedTabList" :key="tab.id">
					<slot v-if="activeTab === tab.id" name="wrapper" 
						:tab="tab" :content="tabContent(tab)">
						<div :class="props.contentClass">
							<slot :name="tabSlotName(tab)" />
						</div>
					</slot>
				</template>
			</template>

		</div>

	</div>

</template>

<style lang="postcss" scoped>

	.tab-active { @apply mt-0 px-4 pb-2 pt-[.4rem] rounded-t-md border border-gray-400 border-b-0
		text-sm z-[100] font-bold select-none relative -mb-px whitespace-nowrap cursor-pointer }
	.tab-other  { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border
		border-transparent text-sm font-bold hover:bg-gray-200 whitespace-nowrap cursor-pointer }
	.altDesign.tab-active { @apply !rounded-none }
	.altDesign.tab-other  { @apply !rounded-none }

	.flatten-tab-name { @apply px-4 pt-3 pb-1 text-sm font-bold select-none }

</style>
