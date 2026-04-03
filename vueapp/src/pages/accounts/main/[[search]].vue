
<script setup>

	ShowSideButtonInSubNav()

    // const route = useRoute()
    // const urlSearch = computed(() => route.params.search || null)
    // 
    // const searchFilter = useLocalStorage('accountsSearchFilterDefault', '')
    // 
    // onMounted(() => 
    //     searchFilter.value = urlSearch
    // )

</script>

<template>
    <div class="flex" id="accounts-main">

        <!-- <div class="w-full">{{ urlSearch }}</div> -->
        
        <MainSidebar>
            <AccountsList />
        </MainSidebar>     
        
        <MainRight class="bg-gradient-main">
            <AccountDetail />
        </MainRight>   

        <!-- 
        // ALTERNATIVE APPROACH: Using SidebarControl (Not yet working) 
        <SidebarControl :showSideBar="sideBarHidden">

            <template #sidebar>
                <div class="bg-orange w-full h-full p-5">sidebar</div>
            </template>

            <template #default>
                <div class="bg-yellow w-full h-full p-5">default</div>
            </template>

        </SidebarControl>	
        -->

    </div>
</template> 

