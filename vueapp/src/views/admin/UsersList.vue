
<script setup>

    // Setup  ==========================================================================================

    const usersStore                        = useUsersStore()
    const appStore                          = useAppStore()

    const { getPagedUsers }                 = usersStore

    const { usersList:    itemsList,        
            usersPager:   listPager,       
            detailUserId: activeDetailId }  = storeToRefs(usersStore)
    const { persistSearch }                 = storeToRefs(appStore)    


    // ===============================================================================================
    // UserList Begins - Also see code in AccountsList where this has been refactored into composable
    // ===============================================================================================

    const detailKeyName                 = 'UserId'
    const pageSizeDefaultName           = 'usersPageSizeDefault'
    const searchFilterDefaultName       = 'usersSearchFilterDefault'
            
    const currentPage                   = ref(0)
    const activeItem                    = ref(null)
    const showAdvSearch                 = ref(false)
    
    const searchInput                   = ref(null) // used to call method searchInput.value.focusInput()   
                                                    // on a component. useTemplateRef('searchInput') in Vue 3.5+

    const listPageSizeDefault           = useLocalStorage(pageSizeDefaultName, 15)
    listPager.value.PageSize            = listPageSizeDefault

    const searchFilterDefault           = useLocalStorage(searchFilterDefaultName, '')  // move to store
    listPager.value.Search              = new SearchModel(persistSearch.value ? searchFilterDefault.value : '')  

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

    const refreshList           = (newRecord, forceRefresh = false) =>
    {
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
            listPager.value             = newPager
        }

        await getPagedUsers(listPager.value)

        currentPage.value           = listPager.value.currentPage()
        activeItem.value            = itemsList.value[listPager.value.offset()]
        listPageSizeDefault.value   = listPager.value.PageSize

        setActiveItem()
    } 

    // Listeners   ====================================================================================

    const keys = function (e)   
    {
        if      (e.code === 'ArrowUp')   { listPager.value.goToPrevious();      e.preventDefault();}
        else if (e.code === 'ArrowDown') { listPager.value.goToNext();          e.preventDefault();}
        else if (e.code === 'PageDown')  { listPager.value.goToPreviousPage();  e.preventDefault();}
        else if (e.code === 'PageUp')    { listPager.value.goToNextPage();      e.preventDefault();} 
        else if (e.code === 'Home')      { searchInput.value.focusInput();      e.preventDefault();} 

    }

    // 'Ctrl+S' to Save is in UsersDetail control

    // ALT: else if (e.code === 'Home') { listPager.value.goToFirstPage(); e.preventDefault();}
    // ALT: else if (e.code === 'End')  { listPager.value.goToLastPage();  e.preventDefault();}

	KeyboardListeners(keys);

    // Lifecycle & Watches  ==========================================================================

    onMounted(() =>    
    {        
        refreshList(1, true)
        searchInput.value.focusInput()
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
        
        if(persistSearch.value)
            searchFilterDefault.value = newVal
    })

    // ===============================================================================================

</script>

<template>
    <div id="usersList">
    
        <!-- Working on moving below code into this component:
            <UsersSearch v-model:listPager="listPager" v-model:showAdvSearch="showAdvSearch"  />
        -->

        
        <div class="px-5 pb-3 flex flex-wrap justify-between items-center border-t border-r border-slate-300
           bg-gradient-side shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)] xxs:shadow-none">
            
            <div class="flex gap-x-1 pt-5 w-full">
                <SearchInput ref="searchInput" 
                    v-model="listPager.Search.Filter" 
                    v-model:showAdvSearch="showAdvSearch" />
            </div>

            <UsersFilters :listPager @showAdvancedSearch="showAdvSearch=true" /> 

            <div class="w-full flex justify-between items-center select-none my-3">
                <ListPager class="mr-2" id='listPager' v-bind:pager="listPager" />
                <span class="text-sm xs:hidden md:inline whitespace-nowrap">
                    Total: {{listPager.TotalCount || 0 }}
                </span>
            </div>

            <InfoBox class="mb-3">
                Enter a UserId or search text for the start of an User First or Last Name.
            </InfoBox>

            <HelpBox :compact="true">
                You can add multiple conditions separated by a comma. 
                Click on the + sign for the Advanced Search with additional options.
            </HelpBox>

            <MobilePagerPrevNext :pager="listPager" />

        </div> 

        <table class="w-full bg-gray-100 select-none xs:shadow-none
            shadow-[0_10px_30px_-5px_rgb(0,0,0,0.4)]" id="word-list-table">

            <thead class="text-left bg-gradient-table-head border-t border-gray-300">
                <tr>
                    <th class="w-6 sm:w-8 py-5"></th>
                    <th class="hidden md:table-cell pr-4 select-none">UserId</th>
                    <th class="pr-4 min-w-[100px]">Last Name, First</th>
                </tr>
            </thead>

            <tbody v-if="listHasRecords()" >
                <tr v-for="(a, index) in itemsList" class="border-y bg-gradient-side2 border-gray-300"
                    :class="{ 'active-row' : isActiveItem(a.UserId) }"
                    @click="refreshItem(index)" :key="a.UserId">
                    <td class="w-6 p-0 sm:w-8 select-none ">
                        <div v-if="isActiveItem(a.UserId)" class="active-arrow" >&nbsp;</div>
                        <!-- or active-arrow -->
                    </td>
                    <td class="hidden md:table-cell pr-4 py-1 text-sm">
                        {{ a.UserId }}
                    </td>
                    <td class="pr-4 py-1 h-8 max-w-[200px] break-words text-sm"
                        :title="'UserId: ' + a.UserId" >{{ a.LastName }}, {{ a.FirstName }}</td>
                </tr>
            </tbody>

            <tbody v-else class="h-20 text-center font-bold">
                <tr>
                    <td colspan="3" class="px-4 py-1">No Users found</td>
                </tr>
            </tbody>

        </table>

        <UsersAdvSearch v-if="showAdvSearch" 
            v-model:showModal="showAdvSearch" 
            v-model:listPager="listPager"
             @getListData="getListData" />

    </div>

</template>

<style lang="postcss" scoped>
    .active-row     { @apply bg-gradient-white}
    .active-arrow   { @apply w-0 h-0 border-x-[8px] border-y-[6px] border-transparent border-l-[#91a5bd] relative left-3 }
    .reset-x        { @apply text-black hover:text-color-mid-gray }
</style> 
