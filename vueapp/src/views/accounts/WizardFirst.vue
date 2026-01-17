<script setup>

    import postsArrayJson       from '@/datalists/30posts.json'
    import simpleExampleJson    from '@/datalists/simpleExample.json'
    // import {usStatesList}    from '@/datalists/usStatesList.js'

    const useSimple     = ref(true)
    const treeRef       = useTemplateRef('treeRef')
    const expandAll     = () => treeRef.value?.openAll()
    const collapseAll   = () => treeRef.value?.closeAll() 
    const jsonTree      = computed(() => useSimple.value ? simpleExampleJson : postsArrayJson)
    const jsonName      = computed(() => useSimple.value ? 'Simple Object Json' : 'Array of Posts Json')

</script>

<template>

    <div class="font-bold mb-4">JsonTree Control Example</div>
    <div class="mb-4">
        This control is designed to display Json in a nicely-formated collapsable hiearchy.
        The code also shows how to call public methods on controls like 'expandAll' and 'collapseAll'.
    </div>
    <div class="flex justify-center mb-4">
        <PrimaryButton @click="expandAll">Expand All</PrimaryButton>
        <PrimaryButton @click="collapseAll" class="ml-2">Collapse All</PrimaryButton>
        <PrimaryButton @click="useSimple=!useSimple" class="ml-2">Toggle Content</PrimaryButton>
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :json="jsonTree" :label="jsonName" ref="treeRef" 
            class="border-b-[3px] border-color-primary" />
    </div>

</template>