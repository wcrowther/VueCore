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

		<ReverseCorner :pixelSize="7" class="hidden bottom-0 -left-1.75" />
		<ReverseCorner :pixelSize="7" class="hidden bottom-0 -right-1.75 rotate-90" />	

	</div>

</template>

<style> /* See @layer utilities in tailwindcss.config.js */</style>


