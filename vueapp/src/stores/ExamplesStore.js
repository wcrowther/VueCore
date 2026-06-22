// Uses Composition Api-style syntax

import { examplesDataList } from '@/datalists/examplesDataList'

export const useExamplesStore = defineStore('ExamplesStore', () =>
{
    // GETTERS ----------------------------------------------------------------

    const sortedExamplesDataList = computed(() =>
        [...examplesDataList].sort((a, b) =>
        {
            if (a.featured !== b.featured)
                return a.featured ? -1 : 1

            const aOrder = Number.isFinite(a.order) ? a.order : Number.MAX_SAFE_INTEGER
            const bOrder = Number.isFinite(b.order) ? b.order : Number.MAX_SAFE_INTEGER

            if (aOrder !== bOrder)
                return aOrder - bOrder

            return a.name.localeCompare(b.name)
        })
    )

    // EXPOSE PUBLIC API ------------------------------------------------------

    return {
        sortedExamplesDataList,
    }
})
