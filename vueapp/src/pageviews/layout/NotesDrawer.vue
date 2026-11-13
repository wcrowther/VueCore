<script setup>

    const appStore          			= useAppStore()
    const { enableNotes, showNotes  }   = storeToRefs(appStore) 

</script>

<template>

	<slot v-if="!enableNotes" />

	<SideDrawerControl v-else 
		id="NotesDrawer" :drawerHidden="!showNotes"
		:flip-side="true" :hideToggleButton="true"> 

		<slot />

		<template #sidedrawer>
			<div class="p-5 h-full bg-white">
				SideDrawer content here
			</div>
		</template>
		
	</SideDrawerControl> 

</template>