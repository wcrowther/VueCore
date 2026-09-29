<script setup>

   	const appStore   		= useAppStore()
	const { infoLevel,
		infoLevelText, }	= storeToRefs(appStore)
	const { setInfoLevel }	= appStore

</script>

<template>
	
	<div v-if="(infoLevel > 0 && infoLevel < 4)" 
		:class="['badge-button cursor-pointer text-white bg-color-primary hover:bg-orange',
			{'bg-orange hover:opacity-70': infoLevel === 3}]"
		@click="setInfoLevel(1)"  @click.right.prevent="setInfoLevel(-1)" 
		title="Change Help detail level - None, Info, or Help">
		{{ infoLevelText }}
	</div>  

</template>


<!-- USAGE - Help Level Button - toggles through the different help levels 
	// None, Info, & Help
	
	<InfoButton />
-->

