<script setup>

    const isActive = defineModel({ type: Boolean })
	const props 	= defineProps(
	{
		navText: { type: String },
	})

</script>

<template>

	<div class="nav-tab font-semibold tracking-wide font-sans rounded-full 
		list-none px-2 h-7 text-sm flex items-center relative mb-1.5" 
		:class="{ 'active-tab': isActive }">

		<slot>
			<span>{{props.navText}}</span>
		</slot>

	</div>

</template>

<style> /* See @layer utilities in tailwindcss.config.js */</style>


