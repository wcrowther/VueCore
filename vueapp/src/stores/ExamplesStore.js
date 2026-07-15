// Uses Composition Api-style syntax

import { useComponentLoader }   from '@/composables/UseComponentLoader'
import { examplesDataList }     from '@/datalists/examplesDataList'

const examplesFolder   = import.meta.glob('/src/pageviews/examples/components/*.vue')
const loadedComponents = useComponentLoader(examplesFolder)

export const useExamplesStore = defineStore('ExamplesStore', () =>
{
    // STATE ------------------------------------------------------------------

    const sortType = ref('default')

    // GETTERS ----------------------------------------------------------------

    const getComponent   = (name)      => loadedComponents.getComponent(name)
    const componentNames = computed(() => loadedComponents.componentNames)

    const sortedExamplesDataList = computed(() =>
    {
        if (sortType.value === 'alphabetical')
            return examplesDataList.filter(f => f.show === true)
                                   .sort((a, b) => a.name.localeCompare(b.name))

        return examplesDataList.filter(f => f.show === true).sort((a, b) =>
        {
            if (a.featured !== b.featured)
                return a.featured ? -1 : 1

            const aOrder = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER
            const bOrder = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER

            if (aOrder !== bOrder)
                return aOrder - bOrder

            return a.name.localeCompare(b.name)
        })
    })

    // EXPOSE PUBLIC API ------------------------------------------------------

    return {
        sortType,
        sortedExamplesDataList,
        getComponent,
        componentNames,
    }
})
