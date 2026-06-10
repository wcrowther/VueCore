<script setup>

	const props = defineProps(
	{
		sideBarId: 	{ type: String, default: '' }, 
	});

</script>

<template>
	<div class="flex" :id="props.sideBarId">
        <MainSidebar>
           <slot name="sidebar" />
        </MainSidebar>     
        
        <MainRight>
            <slot name="default" />
        </MainRight>  
	</div>
</template>


<!-- Usage: 

	<SidebarControl :showSideBar="true">
		<template #sidebar>
		// Sidebar content here
		</template>
		// Main content here
	</SidebarControl>	
-->