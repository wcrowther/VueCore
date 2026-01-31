
export function usePagedList(options) 
{
    const 
    {
        showAdvSearch,              // ref: to control showing AdvSearch
        getPagedItems,        		// function to fetch paged data (e.g. usersStore.getPagedUsers)
        itemsList,            		// ref: the store’s item array
        listPager,            		// ref: the store’s pager object
        activeDetailId,       		// ref: the store’s active detail ID
        persistSearch,        		// ref: boolean (from app store)
        detailKeyName,        		// e.g. 'UserId' or 'AccountId'
        pageSizeDefaultName,  		// e.g. 'usersPageSizeDefault'
        searchFilterDefaultName, 	// e.g. 'usersSearchFilterDefault'
        createSearchModel,          // factory function: () => new SearchForAccount() or new SearchModel()

    } = options

    const currentPage     = ref(0)
    const activeItem      = ref(null)
    const searchInput     = ref(null)

    // Local storage defaults ==============================================================

    const listPageSizeDefault       = useLocalStorage(pageSizeDefaultName, 15)
    listPager.value.PageSize        = listPageSizeDefault

    const searchFilterDefault       = useLocalStorage(searchFilterDefaultName, '')
    listPager.value.Search          = createSearchModel()
    //listPager.value.Search.Filter   = persistSearch.value && !!listPager.value.Search.Filter 
    //                                    ? searchFilterDefault.value : ''

    // Computeds ============================================================================

    const activeListItemId = computed(() => activeItem.value ? activeItem.value[detailKeyName] : 0)

    // Methods ==============================================================================

    const isActiveItem   = (id)      => activeListItemId.value === id
    const listHasRecords = ()        => itemsList.value.length > 0
    const refreshItem    = (offset)  => refreshList(listPager.value.currentFirst() + offset)

    const setActiveItem = () => 
	{
        activeItem.value        = itemsList.value[listPager.value.offset()]
        currentPage.value       = listPager.value.currentPage()
        activeDetailId.value    = activeListItemId.value
    }

    // Either gets the whole list or just active item as needed. 
    const refreshList = (newRecord, forceRefresh) => 
    {   
		// 'forceRefresh' is for the page to remain the same but other params change

        listPager.value.CurrentRecord = newRecord

        if ((listPager.value.currentPage() !== currentPage.value) || forceRefresh)
            getListData()
        else
            setActiveItem()
    }

    const getListData = async (refresh) =>
	{	
        if (refresh) 
        {
            let newPager           = new PagerModel(createSearchModel()) 
            newPager.Search.Filter = listPager.value.Search.Filter
            listPager.value        = newPager
        }

        await getPagedItems(listPager.value)

        currentPage.value         = listPager.value.currentPage()
        activeItem.value          = itemsList.value[listPager.value.offset()]
        listPageSizeDefault.value = listPager.value.PageSize

        setActiveItem()
    }

    // Lifecycle ==============================================================================
    onMounted(() => 
	{
		refreshList(1, true)
        searchInput.value?.focusInput()
    })

    // Watches   ==============================================================================

    watch(() => listPager.value.CurrentRecord, (newVal, oldVal) => 
	{
        if (newVal === oldVal) return
        refreshList(newVal)
    })


    watch(() => listPager.value.Search.Filter, (newVal, oldVal) => 
	{
        if (newVal === oldVal || newVal.slice(-1) === ',' || newVal.slice(-1) === ' ')
            return

        useDebounceFn(() => refreshList(1, true), 1000)()

        if (persistSearch.value)
            searchFilterDefault.value = newVal
    })


    // UPDATE URL   ==============================================================================
    // Needs to be put in a composable

    const route = useRoute()
    const router = useRouter()

    const searchFromUrl = computed(() => route.params.search || null)
    console.log('Search from URL:', searchFromUrl.value)

    watchEffect(() => 
	{
        if (listPager.value.Search.Filter !== searchFromUrl.value)
        {
            // Put in 1 second delay
            console.log('SearchFilter and searchFromUrl not the same.')      
            router.push({path: '/accounts/main'})
        }
 
    })

    //  ==============================================================================


    return {
        // state
        currentPage,
        activeItem,
        showAdvSearch,
        searchInput,

        // computeds
        activeListItemId,

        // methods
        isActiveItem,
        listHasRecords,
        refreshItem,
        setActiveItem,
        refreshList,
        getListData,
        // keys,

        // store refs (passed in)
        itemsList,
        listPager,
        activeDetailId,
    }
}


/*  
=======================================================================
Example: Users List View using usePagedList
=======================================================================

<script setup>

	const usersStore = useUsersStore()
	const appStore   = useAppStore()

	const { usersList, usersPager, detailUserId } = storeToRefs(usersStore)
	const { persistSearch } = storeToRefs(appStore)

	const list = useGenericList(
	{
	  getPagedItems: usersStore.getPagedUsers,
	  itemsList: usersList,
	  listPager: usersPager,
	  activeDetailId: detailUserId,
	  persistSearch,
	  detailKeyName: 'UserId',
	  pageSizeDefaultName: 'usersPageSizeDefault',
	  searchFilterDefaultName: 'usersSearchFilterDefault'
	})

    // Add keyboard handlers if needed

</script>

=======================================================================
*/