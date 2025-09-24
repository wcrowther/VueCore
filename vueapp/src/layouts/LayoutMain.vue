	
<script setup>

    const appStore   							= useAppStore()
    const { sideBarHidden, layoutEscapeKeyOn }	= storeToRefs(appStore)

    // Keyboard Listeners & AutoRefreshAuth  ========================================================
    // --- Disable global Escape for layout by setting app.layoutEscapeKeyOn to false
    const keys = function (e)   
    {
		if (e.code === 'Escape' && layoutEscapeKeyOn.value){ sideBarHidden.value = !sideBarHidden.value; e.preventDefault(); } 
    }

	KeyboardListeners(keys)		// Sets Key listeners for all pages using this layout
	AutoRefreshAuth()			// Refreshes JWT Tokens
	SetHtmlHeadBody() 			// Sets CSS 'theme' or 'alt-theme' for this layout

</script>

<template>

	<div id="layout-main">

		<div id="background-div" 
			class="fixed top-0 bottom-0 left-0 right-0 bg-gradient-back">
		</div>

		<div class="main-width mb-10 relative z-0 h-full">

			<!-- Debugging variable here if needed-->
			<div class="text-white p-3">layoutEscapeKeyOn: {{ layoutEscapeKeyOn }}</div> 

			<BreakPoints />
			
			<BrandBar class="flex justify-between items-center px-4 pr-5 md:ml-3 shadow-theme-layout">
				<UserPopout />
				<BrandLogo />
			</BrandBar>

			<MainNavBar class="shadow-theme-layout" />

			<MainContent>
				<slot></slot>
			</MainContent>
			
			<FooterBox class="shadow-theme-layout" />

			<NotificationControl></NotificationControl>
			
		</div>

	</div> 

</template> 

	
<style lang="postcss" scoped>

	.active-tab .icon-symbol { @apply text-orange hover:text-black }
	
</style>
