<script setup></script>

<template>

	<LayoutMain>
		
		<SubNavBar> 

			<div class="pr-5">
				<router-link to="/home/intro" linkName="Intro" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Intro
				</router-link>

				<span class="px-1 text-gray-300">|</span>

				<router-link to="/home/vuenotes" linkName="VueNotes" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Vuejs
				</router-link>
				
				<!-- .NET Notes page not yet worked on.

				<span class="px-1 text-gray-300">|</span>
				
				<router-link to="/home/dotnetnotes" linkName="DotNetNotes" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					.Net
				</router-link>  
				-->
				<PlatformInfo />
			</div>

		</SubNavBar>
		
		<router-view /> 
	
	</LayoutMain>
		
</template>
