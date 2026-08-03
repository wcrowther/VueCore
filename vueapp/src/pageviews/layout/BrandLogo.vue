<script setup>
    const appStore     		= useAppStore()
    const { showPrevNext } 	= storeToRefs(appStore)
</script>

<template>

	<router-link  to='/' title="Logo - Go to Homepage"
		:class="['h-[24px] w-[150px] bg-brand-logo bg-contain bg-no-repeat bg-center relative', 
		showPrevNext ? 'm-auto sm:mr-0 text-center' : '']" 
	/>

</template>