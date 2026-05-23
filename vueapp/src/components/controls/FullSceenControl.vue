<script setup>
	defineOptions({ inheritAttrs: false })

</script>

<template>

	<FullScreenControl v-bind="$attrs">
		<slot></slot>
	</FullScreenControl>

</template>

<style scoped></style>


<!-- Usage: 

    <FullScreenControl v-model="showFullScreen"  />
-->
