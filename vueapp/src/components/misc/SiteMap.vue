
<script setup>

	import { useRouter }     from 'vue-router'

	const router    		= useRouter()
	const siteMap   		= router.getRoutes().map(r => `${r.path}`).sort()	
	const formattedSiteMap	= siteMap.map(path => path.split(':')[0])
									 .filter((path, idx, arr) => arr.indexOf(path) === idx)
					
	const linkTitle = (link) => link == '/' ? 'homepage' : link.slice(1)
	const indent 	= (link) => link.split('/').length - 2

</script>

<template>

	<div class="pb-7" id="SiteMap">
		<div v-for="(link, idx) in formattedSiteMap" 
			:key="idx+1" :class="{'font-bold mb-3': link == '/'}">
			<span v-for="n in indent(link)" :key="n" class="w-5 inline-block" />
			<router-link :to="link" class="hover:underline underline-offset-4">
				{{ linkTitle(link) }}
			</router-link>
		</div>
	</div>

</template>

<!-- 
	console.log(`${sitemap.join('\n')}`)
	<div v-html="`${sitemap.join('<br/>')}`"></div> 
-->

	