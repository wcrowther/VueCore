<script setup>

    const drawerHidden = ref(false) 
    
</script>

<template>

    <PageTitleBox pageTitle="Sidebar Control">

        <BooleanButton v-model="drawerHidden" 
            trueText="Drawer Hidden" falseText="Drawer Visible" />

    </PageTitleBox>

	<InfoBox>
		Info about the DrawerControl...
	</InfoBox>

	<DrawerControl v-model:drawerHidden="drawerHidden" 
		v-container-width>

		<template #sidebar>
			<div class="bg-amber-200">Sidebar content here</div>
		</template>

		<div class="bg-yellow-200">Main content here. {{ drawerHidden }}</div>

	</DrawerControl>	

</template>