<script setup>

    const selectedExample = defineModel('selectedExample', { type: String, default: '' })

    const route                 = useRoute()
    const examplesStore         = useExamplesStore()
    const { sortedExamplesDataList, sortType, disableExamplesShortcuts, showFullscreen      
                                } = storeToRefs(examplesStore)
    const examplesSizeDefault 	= 20
    const itemsList 			= ref([])
    const listPager 			= ref(new PagerModel(new SearchModel(), examplesSizeDefault))
    const showAdvSearch 		= ref(false)
    const activeItem 			= ref(null)
    const currentPage 			= ref(0)
    const searchInput 			= useTemplateRef('searchInput')
    const examplesPageSize 		= useLocalStorage('examplesPageSize', examplesSizeDefault)
    const searchFromUrl         = computed(() => route.params.search || null)
    const activeListItemId 		= computed(() => activeItem.value?.example || '')
    const urlPriorityTerms      = computed(() => stringToSafeArray(searchFromUrl.value))
    const keyListenersDisabled  = computed(() => showAdvSearch.value || disableExamplesShortcuts.value)

    listPager.value.PageSize 	= Number(examplesPageSize.value)

    const isActiveItem 			= (id)      => activeListItemId.value === id
    const listHasRecords 		= ()        => itemsList.value.length > 0
    const refreshItem 			= (offset)  => refreshList(listPager.value.currentFirst() + offset)

    const getFilteredList = () =>
    {
        const filter = (listPager.value.Search.Filter || '').trim().toLowerCase()
        const visibleExamples = sortedExamplesDataList.value.filter((item) => item.show === true)
        const termsFromUrl = urlPriorityTerms.value

        const applyUrlPriority = (list) =>
        {
            if (!termsFromUrl.length)
                return list

            const withRank = list.map((item, originalIndex) =>
            {
                const name = item.name.toLowerCase()
                const example = item.example.toLowerCase()
                const rank = termsFromUrl.findIndex((term) => name.includes(term) || example.includes(term))

                return {
                    item,
                    originalIndex,
                    rank: rank === -1 ? Number.MAX_SAFE_INTEGER : rank
                }
            })

            withRank.sort((a, b) =>
            {
                if (a.rank !== b.rank)
                    return a.rank - b.rank

                return a.originalIndex - b.originalIndex
            })

            return withRank.map((x) => x.item)
        }

        if (!filter) return applyUrlPriority(visibleExamples)

        const terms = stringToSafeArray(filter)

        if (!terms.length) return applyUrlPriority(visibleExamples)

        const filtered = visibleExamples.filter((item) => 
        {
            const name      = item.name.toLowerCase()
            const example   = item.example.toLowerCase()
            return  terms.some((term) => name.includes(term) || example.includes(term)) 
        })

        return applyUrlPriority(filtered)
    }

    const setActiveItem = () =>
    {
        activeItem.value = itemsList.value[listPager.value.offset()] || null
        currentPage.value = listPager.value.currentPage()
        selectedExample.value = activeItem.value?.example || ''
    }

    const getListData = () =>
    {
        const filtered = getFilteredList()
        listPager.value.TotalCount = filtered.length

        if (!filtered.length) 
        {
            itemsList.value = []
            activeItem.value = null
            selectedExample.value = ''
            return
        }

        if (listPager.value.CurrentRecord > filtered.length)
            listPager.value.CurrentRecord = 1

        const firstIndex = listPager.value.currentFirst() - 1
        const lastIndex = firstIndex + listPager.value.PageSize

        itemsList.value = filtered.slice(firstIndex, lastIndex)
        examplesPageSize.value = listPager.value.PageSize

        setActiveItem()
    }

    const refreshList = (newRecord = 1, forceRefresh = false) =>
    {
        listPager.value.CurrentRecord = newRecord

        if ((listPager.value.currentPage() !== currentPage.value) || forceRefresh)
            getListData()
        else
            setActiveItem()
    }

    // Keyboard Listeners  ================================================

    const keys = 
    {
        'ArrowUp':    () => listPager.value.goToPrevious(),
        'ArrowDown':  () => listPager.value.goToNext(),
        'PageDown':   () => listPager.value.goToPreviousPage(),
        'PageUp':     () => listPager.value.goToNextPage(),
        'Home':       () => searchInput.value?.focusInput()
    }

    KeyboardListeners(keys, keyListenersDisabled)

    // ===========================================================================

    onMounted(() => 
    {
        refreshList(1, true)
        searchInput.value?.focusInput()
    })


    watch(() => listPager.value.CurrentRecord, (newVal, oldVal) => 
    {
        if (newVal === oldVal) return
        refreshList(newVal)
    })

    watch(() => listPager.value.Search.Filter, (newVal, oldVal) => 
    {
        if (newVal === oldVal || newVal.slice(-1) === ',' || newVal.slice(-1) === ' ') return
        useDebounceFn(() => refreshList(1, true), 300)()
    })

    watch(() => searchFromUrl.value, (newVal, oldVal) =>
    {
        if (newVal === oldVal) return
        refreshList(1, true)
    })

</script>

<template>
    <div id="examplesList">

        <div class="px-5 pb-3 flex flex-wrap justify-between items-center border-t border-r border-slate-300
            bg-gradient-side shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)] xxs:shadow-none">

            <div class="flex gap-x-1 pt-5 w-full">
                <SearchInput ref="searchInput"
                    v-model="listPager.Search.Filter"
                    v-model:showAdvSearch="showAdvSearch"
                    inputTitle="Search examples by name or example name." />
            </div>

            <ExamplesFilters :sortType :disableExamplesShortcuts @showAdvancedSearch="showAdvSearch=true" />

            <div class="w-full flex justify-between items-center select-none my-3">
                <ListPager class="mr-2" id="listPager" v-bind:pager="listPager" />
                <span class="text-sm xs:hidden md:inline whitespace-nowrap">
                    Total: {{ listPager.TotalCount || 0 }}
                </span>
            </div>

            <InfoBox class="!mb-3">
                Examples list with search, paging, sorting, and keyboard shortcuts.
            </InfoBox>

            <HelpBox>
                <b>Quick navigation:</b> Type in search to filter by display name or example key,
                then click a row to load that example.
                <br /><br />
                <b>Keyboard shortcuts:</b> Use <b>↑ / ↓</b> to move through examples,
                <b>Page Up / Page Down</b> to jump by page, and <b>Home</b> to focus the search box.
                <br /><br />
                <b>Keyboard icon</b> (<b>record-keys</b>): click to enable or disable list shortcuts.
                When shortcuts are disabled, the icon turns <b>orange</b>.
                <br /><br />
                <b>Fullscreen icon</b> (<b>arrows-pointing-out</b>): opens the selected example in fullscreen
                for easier viewing. Click it again or press <b>Esc</b> to exit.
            </HelpBox>

            <MobilePagerPrevNext :pager="listPager" />

        </div>

        <table class="w-full bg-gray-100 select-none xs:shadow-none
            shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)]" id="controls-list-table">

            <thead class="text-left bg-gradient-table-head border-t border-gray-300">
                <tr>
                    <th class="w-6 sm:w-8 py-5 bg-[#ddd]"></th>
                    <th class="min-w-[100px]">
                        <div class="flex items-center pr-5">
                            <span>Example</span>
                            <span class="ml-auto flex items-center gap-3">

                               <IconSymbol :class="[disableExamplesShortcuts ? 'text-orange' : 'text-color-dark-gray']"
                                    @click="disableExamplesShortcuts = !disableExamplesShortcuts"
                                    title="Enable / Disable Example List Keyboard Shortcuts" width="26px"
                                    icon="codicon:record-keys" />

                                <IconSymbol class="text-color-dark-gray" 
                                    @click="showFullscreen = !showFullscreen"
                                    title="Show Example in Fullscreen" width="20px"
                                    icon="heroicons:arrows-pointing-out-20-solid" />
                            </span>
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody v-if="listHasRecords()">
                <tr v-for="(item, index) in itemsList"
                    :key="item.example"
                    class="border-y bg-gradient-side2 border-gray-300"
                    :class="{ 'active-row': isActiveItem(item.example) }"
                    @click="refreshItem(index)">

                    <td class="w-6 p-0 sm:w-8 select-none bg-white">
                        <div v-if="isActiveItem(item.example)" class="active-arrow">&nbsp;</div>
                    </td>

                    <td class="pr-4 py-1 h-8 max-w-[200px] break-words text-sm">
                        {{ item.name }} {{ item.featured > 0 ? '*':''}}
                    </td>
                </tr>
            </tbody>

            <tbody v-else class="h-20 text-center font-bold">
                <tr>
                    <td colspan="2" class="px-4 py-1">No Controls found</td>
                </tr>
            </tbody>

            <tfoot>
                <tr>
                    <td colspan="2" class="h-8 bg-[#e9e9e9]">&nbsp;</td>
                </tr>
            </tfoot>
        </table>

        <ExamplesAdvSearch v-if="showAdvSearch"
            v-model:showModal="showAdvSearch"
            v-model:sortType="sortType"
            @getListData="getListData" />
    </div>
</template>

<style lang="postcss" scoped>
.active-row { @apply bg-gradient-white }
.active-arrow { @apply w-0 h-0 border-x-[8px] border-y-[6px] border-transparent border-l-[#91a5bd] relative left-3 }
</style>
