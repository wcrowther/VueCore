
<script setup>

    // Show Hamburger sidebar toggle button in menu bar
	ShowSideButtonInSubNav()  

</script>

<template>

    <AppSidebar id="AccountsMain">
    
        <template #sidebar>
            <AccountsList />
        </template>

        <AccountDetail />

    </AppSidebar>	

</template> 

