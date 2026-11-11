
<script setup>

    // Show Hamburger sidebar toggle button in menu bar
	ShowSideButtonInSubNav()  

    const route          = useRoute()
    const showFullscreen = ref(false)

    // e.g. /accounts/main/12/true opens the account detail in fullscreen mode
    if (route.params.fullscreen === 'true') showFullscreen.value = true

</script>

<template>

    <AppSidebar id="AccountsMain">
    
        <template #sidebar>
            <AccountsList />
        </template>

        <FullScreenControl v-model:fullScreen="showFullscreen" class="p-10 pt-14">
            <AccountDetail />
        </FullScreenControl>

    </AppSidebar>	

</template> 

