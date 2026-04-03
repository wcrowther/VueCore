<script setup>
    const appStore              = useAppStore()
    const { sideBarHidden, 
			showSideButton } 	= storeToRefs(appStore)

</script>

<template>
	<LayoutMain>
		
		<SubNavBar> 

			<template #leftalign>
				<RotateButton v-model="sideBarHidden" v-show="showSideButton" title="toggle search" /> 
			</template>

			<div class="pr-5">
			
				<router-link to="/accounts/main"  linkName="AccountsMain"
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Main
				</router-link>

				<span class="px-1 text-gray-300">|</span>                     

				<router-link to="/accounts/chat" linkName="AccountsChat" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Chat
				</router-link>

			</div>

		</SubNavBar>
		
		<router-view /> 
	
	</LayoutMain>
</template>