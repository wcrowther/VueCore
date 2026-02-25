<script setup>

	RedirectToPage('/admin','/admin/users')

    const appStore              = useAppStore()
    const { sideBarHidden }     = storeToRefs(appStore)

</script>

<template>
	<LayoutMain>
		
		<SubNavBar>

			<template #leftalign>
				<RotateButton v-model="sideBarHidden" class="" title="toggle search"  /> 
			</template>

			<div class="pr-5">
			
				<router-link to="/admin/users" class="px-1 py-2 font-bold hover:opacity-50" 
					active-class="text-orange" linkName="AdminUsers">Users</router-link>

				<span class="px-1 text-gray-300">|</span>

				<router-link to="/admin/site" class="px-1 py-2 font-bold hover:opacity-50" 
					active-class="text-orange" linkName="AdminSite">Site</router-link>
			
				<span class="px-1 text-gray-300">|</span>

				<router-link to="/admin/controls" linkName="AdminControls" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Controls
				</router-link>

			</div>  

		</SubNavBar>
		
		<router-view />

	</LayoutMain>
</template>
	