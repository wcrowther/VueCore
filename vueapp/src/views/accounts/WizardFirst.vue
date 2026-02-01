<script setup>

    import postsArrayJson       from '@/datalists/30posts.json'
    import simpleExampleJson    from '@/datalists/simpleExample.json'
    // import {usStatesList}    from '@/datalists/usStatesList.js'

    const useSimple     = ref(true)
    const jsonTree      = computed(() => useSimple.value ? simpleExampleJson : postsArrayJson)
    const jsonName      = computed(() => useSimple.value ? 'Simple Object Json' : 'Array of Posts Json')

</script>

<template>

    <div class="font-bold mb-4">JsonTree Control Example</div>
    <div class="mb-4">
        This control is designed to display Json in a nicely-formated collapsable hiearchy.
        The code also shows how to call public methods on controls like 'expandAll' and 'collapseAll'.
    </div>
    <div class="flex justify-start mb-4">
        <PrimaryButton @click="useSimple=!useSimple">Toggle Content</PrimaryButton>
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :label="jsonName" :json="jsonTree" :showRawJson="false" />
    </div>

</template>