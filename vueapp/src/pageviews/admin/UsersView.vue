
<script setup>

    // Show Hamburger sidebar toggle button in menu bar
	ShowSideButtonInSubNav()  

</script>

<template>

    <AppSidebar id="UsersMain">
    
        <template #sidebar>
            <UsersList />
        </template>

        <UsersDetail />

    </AppSidebar>	

</template> 