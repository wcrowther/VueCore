<script setup>

	const appStore 	= useAppStore()
    const { sideBarHidden, showSideButton } = storeToRefs(appStore)

</script>

<template>

	<LayoutMain>
		
		<SubNavBar>

			<template #leftalign>

				<RotateButton v-model="sideBarHidden" v-show="showSideButton" title="Toggle examples sidebar." /> 

			</template>

			<div class="pr-5">
			
				<router-link to="/examples" linkName="Examples" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Main
				</router-link>

			</div>  

		</SubNavBar>
		
		<router-view />

	</LayoutMain>

</template>
	