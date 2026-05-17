
<script setup>

    const appStore           = useAppStore()
    const { persistSearch }  = storeToRefs(appStore)    

    // ===============================================================================================
    // ItemsList Begin
    // ===============================================================================================

    const detailKeyName                 = 'AccountId'
    const pageSizeDefaultName           = 'accountsPageSizeDefault'
    const searchFilterDefaultName       = 'accountsSearchFilterDefault'        
    const currentPage                   = ref(0)
    const activeItem                    = ref(null)
    const showAdvSearch                 = ref(false)

    const imagesStore                   = useOldImagesStore()
    const       
    {       
        imagesList:         itemsList,        
        imagesPager:        listPager,       
        detailImageName:    activeDetailId       
    }                                   = storeToRefs(imagesStore)
    const { getPagedImages }            = imagesStore

    const listPageSizeDefault           = useLocalStorage(pageSizeDefaultName, 15)
    listPager.value.PageSize            = listPageSizeDefault

    const searchFilterDefault           = persistSearch.value ? useLocalStorage(searchFilterDefaultName, '') : ''
    listPager.value.Search              = new SearchForAccount(searchFilterDefault)  

    // Methods / Computeds ===========================================================================

    const activeListItemId      = computed(() => activeItem.value ? activeItem.value[detailKeyName] : 0) 

    const isActiveItem          = (id)      => activeListItemId.value === id
    const listHasRecords        = ()        => itemsList.value.length  > 0
    const refreshItem           = (offset)  => refreshList(listPager.value.currentFirst() + offset)

    const setActiveItem         = () =>
    {   
        activeItem.value        = itemsList.value[listPager.value.offset()]
        currentPage.value       = listPager.value.currentPage()
        activeDetailId.value    = activeListItemId.value
    }

    const refreshList           = (newRecord, forceRefresh) =>
    {
        // console.log('refreshList: ' + forceRefresh)

        listPager.value.CurrentRecord = newRecord
            
        if ((listPager.value.currentPage() !== currentPage.value) || forceRefresh)
           getListData()
        else 
           setActiveItem()
    }

    const getListData = async (refresh) =>
    {
        if(refresh)
        {
            let newPager                = new PagerModel()
            newPager.Search.Filter      = listPager.value.Search.Filter
            newPager.PageSize           = listPager.value.PageSize
            listPager.value             = newPager
        }

        await getPagedImages(listPager.value)

        currentPage.value               = listPager.value.currentPage()
        activeItem.value                = itemsList.value[listPager.value.offset()]
        listPageSizeDefault.value       = listPager.value.PageSize

        setActiveItem()
    } 

    // Listeners   ====================================================================================

    const keys = function (e)   
    {
        // console.log(e.code);    
        if      (e.code === 'ArrowUp')    { listPager.value.goToPrevious();     e.preventDefault();}
        else if (e.code === 'ArrowDown')  { listPager.value.goToNext();         e.preventDefault();}
        else if (e.code === 'Home')       { listPager.value.goToFirstPage();    e.preventDefault();}
        else if (e.code === 'End')        { listPager.value.goToLastPage();     e.preventDefault();}
        else if (e.code === 'PageDown')   { listPager.value.goToPreviousPage(); e.preventDefault();}
        else if (e.code === 'PageUp')     { listPager.value.goToNextPage();     e.preventDefault();} 

        // 'Ctrl+S' to Save is in AccountDetail control
    }

	KeyboardListeners(keys);

    // Lifecycle & Watches  ==========================================================================

    onMounted(() =>    
    {        
        refreshList(1, true)
    })

    watch(() => listPager.value.CurrentRecord, (newVal, oldVal) => 
    {
        if(newVal === oldVal) return
        refreshList(newVal)
    })

    watch(() => listPager.value.Search.Filter, (newVal, oldVal) => 
    {
        if(newVal === oldVal || newVal.slice(-1) == ',' || newVal.slice(-1) == ' ')
            return 

        useDebounceFn(() => refreshList(1, true), 1000)()
        searchFilterDefault.value = newVal
    })

    // ===============================================================================================

</script>

<template>
    <div class="h-full" id="ImageGallery">

        <div class="px-5 flex flex-wrap justify-between items-center
             border-r border-slate-300 bg-gradient-side 
             shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)] xxs:shadow-none">
            
            <div class="flex gap-x-1 pt-5 pb-3 w-full">
                <SearchInput v-model="listPager.Search.Filter" v-model:showAdvSearch="showAdvSearch" 
                    :showAdvSearchButton="false" />
            </div>

            <div class="w-full flex justify-between items-center select-none my-3">
                <ListPager class="mr-2" id='listPager' v-bind:pager="listPager"></ListPager>
                <span class="text-sm xs:hidden md:inline whitespace-nowrap">Total: {{listPager.TotalCount || 0 }}</span>
            </div>
        </div>

        <table class="w-full bg-gray-100 select-none overflow-y-auto scrollbar-thin" id="accounts-list-table">

            <thead class="text-left bg-gradient-table-head border-t border-gray-300 ">
                <tr>
                    <th class="w-6 sm:w-8 py-5 bg-[#ddd]"></th>
                    <th class="hidden md:table-cell pr-4 select-none bg-[#ddd]">Id</th>
                    <th class="pr-4 min-w-[100px]">ImageSrc</th>
                </tr>
            </thead>

            <tbody v-if="listHasRecords()" >
                <tr v-for="(image, index) in itemsList" class="border-y bg-gradient-side2 border-gray-300"
                    :class="{ 'active-row' : isActiveItem(image.ImageSrc) }"
                    @click="refreshItem(index)" :key="image.ImageSrc">
                    <td class="w-6 p-0 sm:w-8 select-none bg-white">
                        <div v-if="isActiveItem(image.ImageSrc)" class="active-arrow" >&nbsp;</div>
                        <!-- or active-arrow -->
                    </td>
                    <td class="hidden md:table-cell pr-4 py-1 text-sm">
                        {{ image.ImageSrc }}
                    </td>
                    <td class="pr-4 py-1 h-8 max-w-[200px] break-words text-sm"
                        :title="`ImageSrc: ${image.ImageSrc}`" >
                        <img :src="`/images/${image.ImageSrc}`" class="w-24 border" />
                    </td>
                </tr>
            </tbody>
            <tbody v-else class="h-20 text-center font-bold">
                <tr>
                    <td colspan="3" class="px-4 py-1">No Images found</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="h-8 bg-[#e9e9e9]">&nbsp;</td>
                </tr>
            </tfoot>
        </table>

    </div>

</template>

<style lang="postcss" scoped>
    .active-row     { @apply bg-gradient-white }
    .active-arrow   { @apply w-0 h-0 border-x-[8px] border-y-[6px] border-transparent border-l-[#91a5bd] relative left-3 }
    .reset-x        { @apply text-black hover:text-color-mid-gray }
</style> 

