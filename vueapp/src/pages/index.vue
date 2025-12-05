<script setup>

	RedirectToPage('/','/intro')

</script>

<template>

	<LayoutMain>
		
		<SubNavBar> 

			<div class="pr-5">
				<router-link to="/intro" linkName="Intro" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Intro
				</router-link>

				<span class="px-1 text-gray-300">|</span>

				<router-link to="/technotes" linkName="TechNotes" 
					class="px-1 py-2 font-bold hover:opacity-50" active-class="text-orange">
					Tech Notes
				</router-link>
			</div>

		</SubNavBar>
		
		<router-view /> 
	
	</LayoutMain>
		
</template>
