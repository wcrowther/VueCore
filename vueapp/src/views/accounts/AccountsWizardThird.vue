<script setup>

    const jsonTree = 
	{
		id:         123,
		name:       "Will Crowther",
		address:    { city: "Austin", state: "TX" },
		tags:       ["alpha", "beta"],
		details:    
        {
			level: 2,
			active: true,
			'nested value:': { value: "deep" }
		}
	}
    
    const treeRef       = useTemplateRef('treeRef')
    const expandAll     = () => treeRef.value?.openAll()
    const collapseAll   = () => treeRef.value?.closeAll()

</script>

<template>

    <div class="font-bold mb-4">Json Tree Control Example</div>
    <div class="mb-4">
        <PrimaryButton @click="expandAll">Expand All</PrimaryButton>
        <PrimaryButton @click="collapseAll" class="ml-2">Collapse All</PrimaryButton>
    </div>
    <div class="mt-5 pb-5">
        <JsonTreeControl :json="jsonTree" label="json" ref="treeRef" class="border-b-[3px] border-color-primary" />
    </div>

</template>