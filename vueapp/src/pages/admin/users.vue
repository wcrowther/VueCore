
<script setup>

	ShowSideButtonInSubNav()
    
</script>

<template>

    <SidebarControl id="adminUsers">
    
        <template #sidebar>
            <UsersList />
        </template>

        <UsersDetail />

    </SidebarControl>	

</template>