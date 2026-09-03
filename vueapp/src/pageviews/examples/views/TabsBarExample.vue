<script setup>
	import { longTabList } from '@/datalists/longTabList'

    const modelValue    = ref('First')
    const flowIndex     = useLocalStorage('flowIndex', 0)
	const rangeList     = [ 'scroll','menu' ]

	const tabPanels = computed(() =>
		longTabList.map(tab => ({ id: tab, content: tab }))
	)

    const activePanel = computed(() =>
		tabPanels.value.find(panel => panel.id === modelValue.value) ?? tabPanels.value[0]
    )

</script>

<template>

    <PageTitleBox pageTitle="TabsFlowBar Example">

        <ListButton v-model:index="flowIndex" :rangeList
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />

    </PageTitleBox>

    <InfoBox>
        This example demonstrates the usage of the TabsFlowBar component with different overflow behaviors.
    </InfoBox>

    <TabsFlowBar v-model="modelValue" :tabs="longTabList" 
        :overflow="rangeList[flowIndex]" enableShortcuts />

    <div class="border border-gray-400 border-t-0 p-5 bg-white">
        <div class="font-semibold mb-2">{{ activePanel.id }}</div>
    </div>

</template>