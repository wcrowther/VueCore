<script setup>
	const isActive			= ref(true)
	const isActiveTab	 	= (num) => num === activeTab.value
	const activeTab 		= ref(1)
</script>

<template>

	<div class="absolute left-0 right-0 top-0 bottom-0 bg-white flex items-start border border-red">

		<div class="mt-5 flex flex-col flex-grow flex-wrap justify-center items-center">

	        <div class="text-5xl text-color-primary px-4 pb-1 m-auto">pan & zoom</div>
	        <div class="clear-both m-auto mb-10">by will crowther</div>

			<div class="w-full mx-20 mb-3 p-3 rounded-lg flex justify-center items-center gap-2">
				<div class="border border-gray-400 text-gray-400 rounded-lg tracking-wide px-4 py-2 w-fit font-bold select-none relative"
					:class="{ 'active-tab': isActiveTab(1) }" @click="activeTab=1">
					<span class="">One</span>
				</div>
				<div class="border border-gray-400 text-gray-400 rounded-lg tracking-wide px-4 py-2 w-fit font-bold select-none relative "
					:class="{ 'active-tab': isActiveTab(2) }" @click="activeTab=2">
					<span class="">Two</span>
				</div>
				<div class="border border-gray-400 text-gray-400 rounded-lg tracking-wide px-4 py-2 w-fit font-bold select-none relative "
					:class="{ 'active-tab': isActiveTab(3) }" @click="activeTab=3">
					<span class="">Three</span>
				</div>
				<div class="px-4 py-2 w-fit border border-gray-400 bg-gray-400 rounded-lg text-white
					tracking-wider text-center font-bold select-none relative "
					:class="{ 'bg-white !text-gray-400 px-[18px]': isActive }"  @click="isActive=!isActive">
					{{ isActive ? 'On' : 'Off'}}
				</div>					
			</div>

			<div class="">

				<LivePic v-if="activeTab === 1" 
					v-model:play="isActive" url="images/downtown_view2.jpg"
					class="mx-auto mb-20 border border-black" height="400px" width="600px" 
					:initialWait="0" :duration="14000" :wait="1000"
					zoom1="200%" zoom2="200%" position1="87% 50%" position2="5% 50%" /> 
			
				<LivePic v-if="activeTab === 2" 
					v-model:play="isActive" url="images/women-in-apartment.webp"
					class="mx-auto mb-20 border border-black" height="400px" width="600px" 
					:initialWait="0" :duration="14000" :wait="1000" 
					zoom1="100%" zoom2="200%" position1="center" position2="80% 50%"
					@mouseenter="isActive=false" @mouseleave="isActive=true"> 
						<span class="absolute top-3 left-3 text-gray-500">Hover over to pause.</span>
				</LivePic>			

	            <LivePic v-if="activeTab === 3" 
					v-model:play="isActive" url="images/apartment-building-1.jpg"
					class="mx-auto mb-20 border border-black" height="400px" width="598px" 
					:initialWait="1000" :duration="15000" :wait="2000" zoom1="100%" zoom2="220%" 
					position1="center" position2="80% 50%" v-slot="slot">
					    <span class="absolute top-3 left-3">{{ slot.phaseLabel }}</span>
		    			<span class="absolute top-3 right-3">{{ slot.playbackState }}</span>
				</LivePic>
			</div>
		</div>
	</div>
	
</template>

<style lang="postcss" scoped>

	.active-tab{
		@apply bg-color-primary text-white border-gray-500
	}
</style>
