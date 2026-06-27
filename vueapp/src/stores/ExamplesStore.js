// Uses Composition Api-style syntax

import { examplesDataList } from '@/datalists/examplesDataList'

export const useExamplesStore = defineStore('ExamplesStore', () =>
{
    // STATE ------------------------------------------------------------------

    const sortType = ref('default')

    // GETTERS ----------------------------------------------------------------

    const sortedExamplesDataList = computed(() =>
    {
        if (sortType.value === 'alphabetical')
            return [...examplesDataList].sort((a, b) => a.name.localeCompare(b.name))

        return [...examplesDataList].sort((a, b) =>
        {
            if (a.featured !== b.featured)
                return a.featured ? -1 : 1

            const aOrder = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER
            const bOrder = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER

            if (aOrder !== bOrder)
                return aOrder - bOrder

            return a.name.localeCompare(b.name)
        })
    }
    )

    // EXPOSE PUBLIC API ------------------------------------------------------

    return {
        sortType,
        sortedExamplesDataList,
    }
})
