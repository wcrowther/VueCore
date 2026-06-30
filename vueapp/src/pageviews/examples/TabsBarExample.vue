<script setup>
	import { longTabList } from '@/datalists/longTabList'

    const modelValue    = ref('First')
    const overflowIndex = useLocalStorage('overflowIndex', 0)
	const rangeList     = [ 'scroll','menu' ]

	const tabPanels = computed(() =>
		longTabList.map(tab => ({ id: tab, content: tab }))
	)

    const activePanel = computed(() =>
		tabPanels.value.find(panel => panel.id === modelValue.value) ?? tabPanels.value[0]
    )

</script>

<template>

	<div class="flex justify-between text-lg font-bold mb-5">

        <span>TabsBar Example</span>

        <ListIndexButton v-model="overflowIndex" :rangeList
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />

    </div>  
    <div class="mb-7">
        <InfoBox>
            {{ modelValue }}
        </InfoBox>
    </div>

    <TabsBar v-model="modelValue" :tabs="longTabList" 
        :overflow="rangeList[overflowIndex]" enableShortcuts />

    <div class="border border-gray-400 border-t-0 p-5 bg-white">
        <div class="font-semibold mb-2">{{ activePanel.id }}</div>
    </div>

</template>