<script setup>

	ShowSideButtonInSubNav()  

	import { useComponentLoader } from '@/composables/UseComponentLoader'

	const selectedExample = ref('')
	const { getComponent, componentNames } = useComponentLoader(import.meta.glob('/src/pageviews/examples/*.vue'))

	const selectedExampleComponent = computed(() =>	getComponent(selectedExample.value)	)
    
</script>

<template>

    <SidebarControl sideBarId="ControlsMain">
    
        <template #sidebar>
            <ExamplesList v-model:selectedExample="selectedExample" />
        </template>

        <component v-if="selectedExampleComponent" :is="selectedExampleComponent" />
        <div v-else>No control selected.</div>

    </SidebarControl>	

</template> 
