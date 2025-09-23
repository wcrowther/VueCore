<script setup>

	const props = defineProps(
	{
		showSideBar: Boolean    
	})

	// Can move to props or change if needed
	const widthCalc 	= 'calc(100vw*0.33)' // 1/3 of viewport width 
	const maxPixelWidth = '200px'  		  	 // max width of sidebar

</script>

<template>
	<div class="flex relative overflow-hidden">

		<div class="z-10 h-full absolute inset-0 border border-blue
			xs:static xs:flex-none xs:transition-[width] xs:duration-500" 
			:class="[props.showSideBar 
                ? `w-full xs:w-[${widthCalc}] xs:max-w-[${maxPixelWidth}] pointer-events-auto` 
                : 'xs:w-0 pointer-events-none']">

			<div class="absolute left-0 top-0 h-full w-full pointer-events-auto 
				duration-500 transition-transform transform-gpu will-change-transform" 
				:class="[`xs:w-[${widthCalc})] xs:max-w-[${maxPixelWidth}]`, 
				props.showSideBar ? 'translate-x-0' : '-translate-x-full']">

				<div class="h-full w-full border border-red">
					<slot name="sidebar"></slot> <!-- Sidebar content -->
				</div>
			</div>

		</div>

		<div class="flex-1 min-w-0 transition-[padding,margin] duration-500">
            <slot></slot><!-- main content --> 
		</div>

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