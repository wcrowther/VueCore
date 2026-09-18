<script setup>

    const drawerHidden = ref(false) 
    
</script>

<template>

    <PageTitleBox pageTitle="Drawer Control">

        <BooleanButton v-model="drawerHidden" 
            trueText="Drawer Hidden" falseText="Drawer Visible" />

    </PageTitleBox>

	<InfoBox>
		Info about the DrawerControl...
	</InfoBox>

	<DrawerControl v-model:drawerHidden="drawerHidden" 
		v-container-width>

		<template #sidebar>
			<div class="bg-amber-200 p-7 pb-10 w-full h-full">Sidebar content here</div>
		</template>

		<template #default>
			<div class="bg-yellow-200 p-7 pb-10 w-full h-full">
				Main content here. {{ drawerHidden }}
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate 
				ad dolores doloribus, ut impedit nemo, neque autem non sapiente 
				blanditiis. Corrupti ullam, voluptate culpa hic dignissimos 
				optio debitis facilis.
			</div>
		</template>

	</DrawerControl>	

</template>