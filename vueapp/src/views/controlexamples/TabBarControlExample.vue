<script setup>

    const modelValue = ref('First')
    const tabs = [
        'First', 
        'Second', 
        'Third', 
        'Long Name That Takes Up Room', 
        'Seventy Six', 
        'Three Hundred Twenty One', 
        'Ten Million Seven Hundred Thousand Six Fifty'
    ]

    const overflowIndex = ref(0)
	const rangeList     = [ 'scroll','menu' ]

</script>

<template>

	<div class="flex justify-between text-lg font-bold mb-5">

        <span>TabBarControl Example</span>

        <ListIndexButton v-model="overflowIndex" :rangeList
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />

    </div>  
    <div class="mb-7">
        <InfoBox>
            Text to come.
        </InfoBox>
    </div>

    <TabBarControl v-model="modelValue" :tabs :overflow="rangeList[overflowIndex]" />
    <!-- <div class="border border-gray-400 border-t-0 p-5">
        Some content
    </div> -->

</template>