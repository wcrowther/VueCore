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

	<SidebarControl v-model:sideBarHidden="sideBarHidden">

		<template #sidebar>
			Sidebar content here
		</template>

		Main content here. {{ sideBarHidden }}

	</SidebarControl>	

</template>