<script setup>

	const props = defineProps(
	{
		id: 					{ type: String, default: 'TabsOverflowControl' },
		tabList: 				{ type: Array, default: () => ['One', 'Two', 'Three'] },
		keepAlive: 				{ type: Boolean, default: false },
		contentBorder: 			{ type: Boolean, default: false },
		altDesign: 				{ type: Boolean, default: false },
		enableShortcuts: 		{ type: Boolean, default: false },
		overflowMenuMaxHeight: 	{ type: [Number, String], default: null },
		overflow: {
			type: String,
			default: 'scroll',
			validator: value =>
			{
				if (isEmptyOrSpace(value) || ['scroll', 'menu'].includes(value))
					return true

				throw new Error(`[TabsOverflowControl] Invalid overflow value "${value}". Use "scroll", "menu", or an empty value.`)
			}
		},
	})

	const activeTabModel = defineModel('activeTab', { type: [String, Number], default: '' })
	const internalActiveTab = ref('')

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
	}, { immediate: true, deep: true })

</script>

<template>

	<div :id="props.id" class="h-full">

		<div class="flex gap-2 items-end">

			<div class="flex-1 min-w-0">

				<TabsBar v-model="activeTab" :tabs="normalizedTabList" :overflow="props.overflow"
					:enableShortcuts="props.enableShortcuts" :overflowMenuMaxHeight="props.overflowMenuMaxHeight">
					<template #tab-button="{ tab, isActive, activate }">
						<div :class="[{ 'altDesign': props.altDesign }, isActive ? 'tab-active' : 'tab-other']"
							@click="activate()">
							<span>{{ tab.label }}</span>
						</div>
					</template>
				</TabsBar>

			</div>
		</div>

		<div class="z-10 h-full min-h-60 pb-7 opacity-100 bg-white border-t-0 
			overflow-y-auto scrollbar-thin border-gray-400"
			:class="{ 'border border-gray-400': props.contentBorder }">

			<slot></slot>

			<template v-if="props.keepAlive">
				<div v-for="tab in normalizedTabList" :key="tab.id" v-show="activeTab === tab.id">
					<slot :name="tab.slotName"></slot>
				</div>
			</template>

			<template v-else>
				<template v-for="tab in normalizedTabList" :key="tab.id">
					<slot v-if="activeTab === tab.id" :name="tab.slotName"></slot>
				</template>
			</template>
		</div>

	</div>

</template>

<style lang="postcss" scoped>

	.tab-active { @apply mt-0 px-4 pb-2 pt-[.4rem] rounded-t-md border bg-white border-gray-400 border-b-0
		text-sm z-[100] font-bold select-none relative bottom-[-1px] whitespace-nowrap cursor-pointer }
	.tab-other  { @apply mt-1 mb-[.2rem] px-4 select-none leading-7 rounded-full border
		border-transparent text-sm font-bold hover:bg-gray-200 whitespace-nowrap cursor-pointer }
	.altDesign.tab-active { @apply !rounded-none }
	.altDesign.tab-other  { @apply !rounded-none }

</style>
