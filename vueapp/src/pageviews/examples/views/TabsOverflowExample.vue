<script setup>
	
	const activeTab 	= ref('First')
	const overflowIndex = useLocalStorage('tabsOverflowControlExampleOverflowIndex', 0)
	const keepAlive 	= useLocalStorage('tabsOverflowControlExampleKeepAlive', false)
	const contentBorder = useLocalStorage('tabsOverflowControlExampleBorder', true)
	const rangeList 	= ['scroll', 'menu']

</script>

<template>

	<PageTitleBox pageTitle="TabsOverflowControl Example">

		<ListIndexButton v-model="overflowIndex" :rangeList
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />
	</PageTitleBox>

	<div class="mb-4 flex flex-wrap gap-3">
		<button type="button" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-400"
			@click="keepAlive = !keepAlive">
			KeepAlive: {{ keepAlive ? 'ON' : 'OFF' }}
		</button>

		<button type="button" class="px-3 py-1 text-xs font-bold rounded-full border border-gray-400"
			@click="contentBorder = !contentBorder">
			Border: {{ contentBorder ? 'ON' : 'OFF' }}
		</button>
	</div>

	<TabsOverflowControl v-model:activeTab="activeTab" 
		:tabList="['First','Second','Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth']" 
		:keepAlive :contentBorder :overflow="rangeList[overflowIndex]"
		class="mb-7">

        <template #First>       
            <div class="p-5"><div class="font-bold mb-3">First Content</div></div>
        </template>
        <template #Second>       
            <div class="p-5"><div class="font-bold mb-3">Second Content</div></div>
        </template>
        <template #Third>       
            <div class="p-5"><div class="font-bold mb-3">Third Content</div></div>
        </template>
		<template #Fourth>       
            <div class="p-5"><div class="font-bold mb-3">Fourth Content</div></div>
        </template>
		<template #Fifth>       
            <div class="p-5"><div class="font-bold mb-3">Fifth Content</div></div>
        </template>

	</TabsOverflowControl>

</template>
