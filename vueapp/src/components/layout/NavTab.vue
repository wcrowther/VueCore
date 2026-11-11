<script setup>

    import { computed } from 'vue'
    import { useRoute } from 'vue-router'

	const props = defineProps(
	{
		navText: { type: String },
		to: { type: String, required: true },
		matchFirstSection: { type: Boolean, default: true }
	})

	const route = useRoute()

	const baseSectionPath = computed(() =>
	{
		const targetPath = props.to?.split('?')?.[0] ?? ''
		if (!targetPath)
			return ''

		const normalizedTarget = targetPath.replace(/\/+$/, '') || '/'
		const parts = normalizedTarget.split('/').filter(Boolean)

		return parts.length ? `/${parts[0]}` : '/'
	})

	const isSectionActive = computed(() =>
	{
		if (!props.matchFirstSection || !baseSectionPath.value)
			return false

		const currentPath = route.path.replace(/\/+$/, '') || '/'
		return currentPath === baseSectionPath.value || currentPath.startsWith(`${baseSectionPath.value}/`)
	})
	
</script>

<template>

	<router-link :to="props.to" class="nav-tab font-semibold tracking-wide font-sans rounded-full 
		list-none px-4 pt-px h-7 text-sm flex items-center relative mb-1.5" 
		:class="{ 'active-tab': isSectionActive }">

		<slot>
			<span>{{props.navText}}</span>
		</slot>

		<ReverseCorner :pixelSize="7" class="hidden bottom-0 -left-1.75" />
		<ReverseCorner :pixelSize="7" class="hidden bottom-0 -right-1.75 rotate-90" />	

	</router-link>

</template>

<style> /* See @layer utilities in tailwindcss.config.js */</style>


