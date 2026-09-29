<script setup>

    const isActive = ref(true)

</script>

<template>

    <div class="basis-full overflow-auto scrollbar-thin">

        <PageTitleBox pageTitle="Pan Zoom Examples">
            <BooleanButton v-model="isActive" class="w-[82px]"
				trueText="Active" falseText="Paused" />
        </PageTitleBox> 

		<InfoBox>
            <p>This example demonstrates pan and zoom functionality using the <b>PanZoom</b> component. 
            Toggle the active state using the button on the right.</p>
		</InfoBox>

        <HelpBox>
            <p>Use the tabs to switch between different pan and zoom examples. The active state controls 
            whether the animations are playing.</p>
		</HelpBox>


	    <TabsControl :tabList="['Pan', 'Zoom', 'Zoom_With_Pause']" contentBorder
			class="mb-7 !from-white !to-transparent">

	    	<template #Pan>
				<PanZoom v-model:play="isActive" 
                    url="/images/downtown_view2.jpg"
					class="mx-auto my-10 border border-black" height="400px" width="600px" 
					:initialWait="0" :duration="14000" :wait="1000"
					zoom1="200%" zoom2="200%" position1="87% 50%" position2="5% 50%" /> 
	    	</template>

	    	<template #Zoom>
	            <PanZoom v-model:play="isActive" 
                    url="/images/apartment-building-1.jpg"
					class="mx-auto my-10 border border-black" height="400px" width="598px" 
					:initialWait="1000" :duration="15000" :wait="2000" zoom1="100%" zoom2="220%" 
					position1="center" position2="80% 50%" v-slot="slot">
					    <span class="absolute top-3 left-3">{{ slot.phaseLabel }}</span>
		    			<span class="absolute top-3 right-3">{{ slot.playbackState }}</span>
				</PanZoom>
	    	</template>
           
	    	<template #Zoom_With_Pause>
				<PanZoom v-model:play="isActive" 
                    url="/images/women-in-apartment.webp"
					class="mx-auto my-10 border border-black" height="400px" width="600px" 
					:initialWait="0" :duration="14000" :wait="1000" 
					zoom1="100%" zoom2="200%" position1="center" position2="80% 50%"
					@mouseenter="isActive=false" @mouseleave="isActive=true"> 
						<span class="absolute top-3 left-3 text-gray-500">Hover over to pause.</span>
				</PanZoom>	
	    	</template>

	    </TabsControl>

    </div>

</template>


			
		

