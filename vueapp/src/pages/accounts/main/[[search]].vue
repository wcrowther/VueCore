
<script setup>

	ShowSideButtonInSubNav()  // Hamburger sidebar toggle button

    // const route = useRoute()
    // const urlSearch = computed(() => route.params.search || null)
    // const searchFilter = useLocalStorage('accountsSearchFilterDefault', '')
    // onMounted(() => searchFilter.value = urlSearch)

</script>

<template>

    <SidebarControl id="AccountsMain">
    
        <template #sidebar>
            <AccountsList />
        </template>

        <AccountDetail />

    </SidebarControl>	

</template> 

