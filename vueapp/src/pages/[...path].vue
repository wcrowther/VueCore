<script setup>

	// =========================================================================================
	// NOTE: This file matches the [...path].vue which is the unplugin-vue-router catchall route
	// =========================================================================================

    const toastStore            = useToastStore()
    const authStore             = useAuthStore()
    const { delayedRedirect }   = authStore
    const redirectDelay         = 5000
    const secondsDelay          = redirectDelay / 1000

    const route         = useRoute();
    const currentPath   = computed(() => route.path);

    onMounted(() =>  
    {        
        delayedRedirect('/', redirectDelay ) 
        toastStore.showWarning(`Redirecting to Homepage in ${secondsDelay} seconds`, redirectDelay, false)

        console.log('currentPath: ', currentPath)
    }); 

</script>

<template>  

    <LayoutMain>
        <div class="text-md pt-20 font-bold text-center text-color-red ">
            Page "{{ currentPath }}" not found.
        </div>
    </LayoutMain>
    
</template>

<style></style>
