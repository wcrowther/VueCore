// Alt approach for usePagedList which passes in the store 
// (not tested or fully implemented)
export function usePagedList2(store, pagerKey, listKey, fetchAction) 
{
	// refs to store state
	const { [pagerKey]: listPager, [listKey]: itemsList } = storeToRefs(store)

	const showAdvSearch 	= ref(false)
	const activeItem 		= ref(null)
	const currentPage 		= ref(0)
	const searchInput 		= ref(null)

	// computed helper (...detailKeyName needs to be a const in store for this to work)
	const activeListItemId = computed(() =>
		activeItem.value ? activeItem.value[listPager.value.Search.detailKeyName || 'id'] : 0
	)

	const isActiveItem = id => activeListItemId.value === id
	const listHasRecords = () => itemsList.value.length > 0

	// ---------------------------------------------
	// Refresh / set active item
	// ---------------------------------------------

	const setActiveItem = () => 
	{
		activeItem.value = itemsList.value[listPager.value.offset()]
		currentPage.value = listPager.value.currentPage()
	}

	const refreshList = async (newRecord = 1, forceRefresh = false) => 
	{
		listPager.value.CurrentRecord = newRecord

		if (listPager.value.currentPage() !== currentPage.value || forceRefresh) {
			await fetchList()
		} else {
			setActiveItem()
		}
	}

	const fetchList = async () => 
	{
		await store[fetchAction](listPager.value)
		currentPage.value = listPager.value.currentPage()
		setActiveItem()
	}

	// ---------------------------------------------

	onMounted(() => 
	{
		refreshList(1, true)
		searchInput.value?.focusInput()
	})

	watch (() => listPager.value.CurrentRecord, (newVal, oldVal) => 
	{
		if (newVal !== oldVal) 
			refreshList(newVal)
	})

	watch(() => listPager.value.PageSize, (newVal, oldVal) => 
	{
		if (newVal !== oldVal) refreshList(1, true)
	})

	watch(() => listPager.value.Search.Filter, (newVal, oldVal) => 
	{
		if (newVal === oldVal || newVal.slice(-1) === ',' || newVal.slice(-1) === ' ') return

		useDebounceFn(() => refreshList(1, true), 1000)()
	})

	// ---------------------------------------------

	return {
		// state
		listPager,
		itemsList,
		activeItem,
		showAdvSearch,
		searchInput,

		// methods
		isActiveItem,
		listHasRecords,
		refreshList
	}
}
