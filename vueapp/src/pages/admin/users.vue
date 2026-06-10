
<script setup>

	ShowSideButtonInSubNav()
    
</script>

<template>

    <SidebarControl id="AdminUsers">
    
        <template #sidebar>
            <UsersList />
        </template>

        <UsersDetail />

    </SidebarControl>	

</template>