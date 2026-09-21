<script setup>

    const drawerHidden 	= useLocalStorage('drawerExampleDrawerHidden', false)
	const showWidths 	= useLocalStorage('drawerExampleShowWidths', true)
    
</script>

<template>

    <PageTitleBox pageTitle="Drawer Control">

        <BooleanButton v-model="drawerHidden" 
            trueText="Show Drawer" falseText="Hide Drawer" /> 

		<BooleanButton v-model="showWidths" 
            text="Widths" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 

    </PageTitleBox>

	<InfoBox>
		Info about the DrawerControl...
	</InfoBox>

	<DrawerControl v-model:drawerHidden="drawerHidden" 
		v-container-width="!showWidths">

		<template #sidebar>
			<div class="bg-amber-200 p-7 pb-10 w-full h-full" v-container-width="!showWidths">
				Sidebar content here
			</div>
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