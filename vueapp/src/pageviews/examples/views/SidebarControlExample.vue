<script setup>

    const showSideBar = ref(false) 
    
</script>

<template>

    <PageTitleBox pageTitle="FullScreen Control">

        <BooleanButton v-model="showSideBar" trueText="SideBar Open" falseText="SideBar Closed" />

    </PageTitleBox>

	<InfoBox>
		Info about the SidebarControl...
	</InfoBox>

	<SidebarControl :showSideBar>

		<template #sidebar>
			Sidebar content here
		</template>

		Main content here. {{ showSideBar }}

	</SidebarControl>	

</template>