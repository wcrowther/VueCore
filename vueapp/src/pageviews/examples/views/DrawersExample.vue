<script setup>

	const showWidths 			= useLocalStorage('drawerExamplesShowWidths', true)
	const sideDrawerHidden 		= useLocalStorage('drawerExamplesSideDrawerHidden', false)
	const sideDrawerFlipSide 	= useLocalStorage('drawerExamplesSideDrawerFlipSide', false)
	const topDrawerHidden 		= useLocalStorage('drawerExamplesTopDrawerHidden', false)
	const topDrawerFlipVertical = useLocalStorage('drawerExamplesTopDrawerFlipVertical', false)

</script>

<template>

    <PageTitleBox pageTitle="Drawer Controls">

        <BooleanButton v-model="sideDrawerHidden" 
            trueText="Show SideDrawer" falseText="Hide SideDrawer" /> 
		
        <BooleanButton v-model="sideDrawerFlipSide" 
            trueText="Drawer On Right" falseText="Drawer On Left" /> 

		<BooleanButton v-model="showWidths" 
            text="Widths" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 

    </PageTitleBox>

	<InfoBox>
		Info about the SideDrawerControl...
	</InfoBox>

	<SideDrawerControl v-model:drawerHidden="sideDrawerHidden" class="mb-5"
		v-container-width="!showWidths"	:flipSide="sideDrawerFlipSide">

		<template #sidedrawer>
			<div :class="['bg-white border border-gray-400 p-7 pb-10 w-full h-full', 
				sideDrawerFlipSide ? 'border-l-0' : 'border-r-0']" 
				v-container-width="!showWidths">
				SideDrawer content here
			</div>
		</template>

		<template #default>
			<div class="bg-white border border-gray-400  p-7 pb-10 w-full h-full" 
				v-container-width="!showWidths">
	
				<div class="mb-5">Main content here.</div>
				<div>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate
					ad dolores doloribus, ut impedit nemo, neque autem non sapiente
					blanditiis. Corrupti ullam, voluptate culpa hic dignissimos
					optio debitis facilis.
				</div>

				<CircleButton v-model="sideDrawerHidden" 
					class="absolute left-1 top-1" size="12px" padding="p-[2px]"
                    bgColor="bg-white" icon="heroicons:chevron-left"/>
					
			</div>
		</template>

	</SideDrawerControl>	

	<div class="flex justify-end gap-1.5 py-5">

		<BooleanButton v-model="topDrawerHidden"
			trueText="Show TopDrawer" falseText="Hide TopDrawer" />

		<BooleanButton v-model="topDrawerFlipVertical" 
            trueText="Drawer On Bottom" falseText="Drawer On Top" /> 
	</div>

	<InfoBox>
		TopDrawerControl - the top-only version of DrawerControl...
	</InfoBox>

	<TopDrawerControl v-model:drawerHidden="topDrawerHidden" 
		:flipVertical="topDrawerFlipVertical" divider>

		<template #drawer>
			<div class="bg-white border-x border-gray-400 p-7 pb-10 w-full">
				Top content here<br />
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate 
				ad dolores doloribus, ut impedit nemo, neque autem non sapiente 
				blanditiis. Corrupti ullam, voluptate culpa hic dignissimos 
				optio debitis facilis.				
			</div>
		</template>

		<template #default>
			<div class="bg-white border-x border-gray-400 p-7 pb-10 w-full h-full">
				Main content here.<br />	
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate 
				ad dolores doloribus, ut impedit nemo, neque autem non sapiente 
				blanditiis. Corrupti ullam, voluptate culpa hic dignissimos 
				optio debitis facilis.
		
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate 
				ad dolores doloribus, ut impedit nemo, neque autem non sapiente 
				blanditiis. Corrupti ullam, voluptate culpa hic dignissimos 
				optio debitis facilis.
			</div>
		</template>

	</TopDrawerControl>

</template>