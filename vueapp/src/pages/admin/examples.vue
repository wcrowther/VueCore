<script setup>

	ShowSideButtonInSubNav()  

    // const selectedControl = ref('')

    // const controlExamples = import.meta.glob('/src/pageviews/controlexamples/*.vue', { eager: true })

    // const selectedControlComponent = computed(() =>
    // {
    //     if (!selectedControl.value)
    //         return null

    //     const fileName = `${selectedControl.value}.vue`
    //     const match = Object.entries(controlExamples).find(([path]) => path.endsWith(`/${fileName}`))

    //     return match?.[1]?.default || null
    // })

	import { useComponentLoader } from '@/composables/UseComponentLoader'

	const selectedExample = ref('')
	const { getComponent, componentNames } = useComponentLoader( import.meta.glob('/src/pageviews/controlexamples/*.vue'))

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
