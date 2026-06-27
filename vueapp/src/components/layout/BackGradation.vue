<script setup>

	const appStore			= useAppStore()
    const { fullWidth }		= storeToRefs(appStore)
	const bgHeight			= computed(() => (fullWidth.value ? 'h-[800px]' : 'h-[500px]'))
</script>

<template>
	<div :class="[bgHeight, 'z-0 bg-gradient-main absolute top-0 left-0 right-0']"></div>
</template>