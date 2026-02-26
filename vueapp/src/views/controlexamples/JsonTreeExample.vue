<script setup>

    import postsArrayJson       from '@/datalists/30posts.json'
    import simpleExampleJson    from '@/datalists/simpleExample.json'
    import { usStatesList }     from '@/datalists/usStatesList.js'

    const sourceIndex   = ref(0)
    const jsonSource    =
    [
        { name: 'Simple Object Json',   json: simpleExampleJson }, 
        { name: 'Array of Posts Json',  json: postsArrayJson },
        { name: 'List of US States',    json: usStatesList },
    ]

</script>

<template>

    <div class="font-bold mb-4">JsonTree Control Example</div>
    <div class="mb-4">
        This control is designed to display Json in a nicely-formated collapsable hiearchy.
        The code also shows how to call public methods on controls like 'expandAll' and 'collapseAll'.
    </div>
    <div class="flex justify-start mb-4">
        <ListRangeButton v-model="sourceIndex" :rangeList="jsonSource" class="py-4 px-5" />
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :label="jsonSource[sourceIndex].name" 
            :json="jsonSource[sourceIndex].json" :showRawJson="false" />
    </div>

</template>