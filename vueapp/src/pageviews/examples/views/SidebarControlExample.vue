<script setup>

    const sideBarHidden = ref(false) 
    
</script>

<template>

    <PageTitleBox pageTitle="Sidebar Control">

        <BooleanButton v-model="sideBarHidden" 
            trueText="SideBar Hidden" falseText="SideBar Visible" />

    </PageTitleBox>

	<InfoBox>
		Info about the SidebarControl...
	</InfoBox>

	<SidebarControl v-model:sideBarHidden="sideBarHidden" 
		v-container-width>

		<template #sidebar>
			<div class="bg-amber-200">Sidebar content here</div>
		</template>

		<div class="bg-yellow-200">Main content here. {{ sideBarHidden }}</div>

	</SidebarControl>	

</template>