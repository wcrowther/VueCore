
<script setup>

    // Show Hamburger sidebar toggle button in menu bar
	ShowSideButtonInSubNav()  

</script>

<template>

    <SidebarControl id="AccountsMain">
    
        <template #sidebar>
            <AccountsList />
        </template>

        <AccountDetail />

    </SidebarControl>	

</template> 

