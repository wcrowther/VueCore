<script setup>

    import postsArrayJson           from '@/datalists/json/30posts.json'
    import simpleExampleJson        from '@/datalists/json/simpleExample.json'

    const sourceIndex  = ref(0)
    const jsonSourceList  =
    [
        { name: 'Simple Object Json',   json: simpleExampleJson }, 
        { name: 'Array of Posts Json',  json: postsArrayJson },
        { name: 'List of US States',    json: usStatesList },
        { name: 'Calendar Events',      json: sampleCalendarEvents },
    ]

    const jsonSource = computed(() => jsonSourceList[sourceIndex.value] )

</script>

<template>

    <PageTitleBox pageTitle="JsonTree Control Example" />
    
    <InfoBox>
        This control displays JSON in a formatted, collapsible hierarchy.
        It also includes buttons to toggle raw JSON and copy the current JSON output.
        Use the button below to toggle through different JSON examples.
    </InfoBox>

    <HelpBox class="mb-4">
        Tip: Right-click a hierarchy item to collapse or expand that level.
    </HelpBox>

    <div class="flex justify-start mb-4">
        <ListButton v-model="sourceIndex" :rangeList="jsonSourceList" 
            class="py-1 px-5 font-bold tracking-wide select-none" />
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :label="jsonSource.name" :json="jsonSource.json" 
            :showRawJson="false" :isOpen="true" />
    </div>

</template>