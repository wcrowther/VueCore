<script setup>

	const showWidths 		= useLocalStorage('drawerExamplesShowWidths', true)
	const sideHidden 		= useLocalStorage('drawerExamplesSideHidden', false)
	const sideHidden2 		= useLocalStorage('drawerExamplesSideHidden2', false)
	const sideFlipSide 		= useLocalStorage('drawerExamplesSideFlipSide', false)
	const topHidden 		= useLocalStorage('drawerExamplesTopHidden', false)
	const topFlipVertical 	= useLocalStorage('drawerExamplesFlipVertical', false)

	const topDrawerName		= computed(() => topFlipVertical.value ? 'Bottom Drawer' : 'Top Drawer')

</script>

<template>

    <PageTitleBox pageTitle="Drawer Controls">

        <BooleanButton v-model="sideHidden" 
            trueText="Show SideDrawer" falseText="Hide SideDrawer" /> 
		
        <BooleanButton v-model="sideFlipSide" 
            trueText="Drawer On Right" falseText="Drawer On Left" /> 

		<BooleanButton v-model="showWidths" 
            text="Widths" trueIcon="heroicons-solid:check" falseIcon="heroicons-solid:x" /> 

    </PageTitleBox>

	<InfoBox>
		In the side-by-side layout, hover over the divider for one second, then drag to resize the side drawer.
	</InfoBox>

	<SideDrawer2Control id="SideDrawer2Control" 
		v-model:drawerHidden="sideHidden" class="mb-5" 
		v-container-width="!showWidths"	:flipSide="sideFlipSide" resize>

		<template #default>
			<div class="bg-white border border-gray-400  p-7 pb-10 " 
				v-container-width="!showWidths">
	
				<div class="mb-5">Main content here.</div>
				<div>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit voluptate
					ad dolores doloribus, ut impedit nemo, neque autem non sapiente
					blanditiis. Corrupti ullam, voluptate culpa hic dignissimos
					optio debitis facilis.
				</div>

			</div>
		</template>
		
		<template #sidedrawer>
			<div :class="['bg-white border border-gray-400 p-7 pb-10 w-full h-full', 
				sideFlipSide ? 'border-l-0' : 'border-r-0']" 
				v-container-width="!showWidths">
				SideDrawer content here
			</div>
		</template>

	</SideDrawer2Control>	

	<SideDrawerControl id="SideDrawerControl" 
		v-model:drawerHidden="sideHidden2" class="mb-7" flipSide resize>

		<div class="p-5 bg-gray-100">Alternate version without border</div>
		<div class="p-5 bg-amber-100">
			Shorter content here.
		</div>

		<template #sidedrawer>
			<div class="bg-amber-200 p-5 h-full">
				SideDrawer content 2
			</div>
		</template>
		
		<template #toggleButton>
			<CircleButton v-model="sideHidden2" 
                class="m-2 -left-8 bottom-0!" bgColor="bg-amber-500" 
				borderColor="border-amber-800" padding="p-1" size="14px" 
				icon="heroicons:chevron-right"/>
		</template>

	</SideDrawerControl>	

	<div class="flex justify-end gap-1.5 py-5">

		<BooleanButton v-model="topHidden" class="w-41.5"
			:trueText="`Show ${topDrawerName}`" :falseText="`Hide ${topDrawerName}`" />

		<BooleanButton v-model="topFlipVertical" 
            trueText="Drawer On Bottom" falseText="Drawer On Top" /> 
	</div>

	<InfoBox>
		TopDrawerControl - the top-only version of DrawerControl...
	</InfoBox>

	<TopDrawerControl v-model:drawerHidden="topHidden" 
		:flipVertical="topFlipVertical" divider>

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