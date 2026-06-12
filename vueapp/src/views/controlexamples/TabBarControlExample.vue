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

</script>

<template>

	<div class="text-lg font-bold mb-5">
        TabBarControl Example
    </div>  
    <div class="mb-7">
        <InfoBox>
            Text to come.
        </InfoBox>
    </div>

    <TabBarControl v-model="modelValue" :tabs :showOverflowMenu="false" />
    <!-- <div class="border border-gray-400 border-t-0 p-5">
        Some content
    </div> -->

</template>