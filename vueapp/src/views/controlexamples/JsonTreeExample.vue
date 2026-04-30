<script setup>

    import postsArrayJson           from '@/datalists/30posts.json'
    import simpleExampleJson        from '@/datalists/simpleExample.json'
    import { usStatesList }         from '@/datalists/usStatesList.js'
    import { sampleCalendarEvents}  from '@/datalists/sampleCalendarEvents.js'

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

    <div class="text-lg font-bold mb-5">
        JsonTree Control Example
    </div>
    <div class="mb-7">
        This control is designed to display Json in a nicely-formated collapsable hiearchy.
        The code also shows how to call public methods on controls like 'expandAll' and 'collapseAll'.
    </div>
    <div class="flex justify-start mb-4">
        <ListIndexButton v-model="sourceIndex" :rangeList="jsonSourceList" 
            class="py-1 px-5 font-bold tracking-wide select-none" />
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :label="jsonSource.name" :json="jsonSource.json" :showRawJson="false" />
    </div>

</template>