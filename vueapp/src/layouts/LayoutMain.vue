	
<script setup>

    const { platform }			= usePlatform()
	const appStore   			= useAppStore()
    const { sideBarHidden, 
		    disableGlobalKeys,
			fullWidth }			= storeToRefs(appStore)
	const { setInfoLevel }		= appStore

	// Keyboard Listeners  ===========================================================================

	const keys = 
	{
		'Escape': 		() => sideBarHidden.value = !sideBarHidden.value,
		'Ctrl+KeyH':	() => setInfoLevel(1),
		'F1':    		() => setInfoLevel(1) 
	}

	KeyboardListeners(keys, disableGlobalKeys) // Sets Key listeners for all pages using this layout
	SetHtmlHeadBody() 							// Sets CSS 'theme' or 'alt-theme' for this layout

</script>

<template>

	<div id="layout-main">

		<div id="background-div" 
			class="fixed top-0 bottom-0 left-0 right-0 bg-gradient-back">
		</div>

		<div :class="['mx-auto mb-10 relative z-0 h-full', {'main-width': !fullWidth}]">

			<!-- Debugging variable here if needed
			<div class="text-white p-3">disableGlobalKeys: {{ disableGlobalKeys }}</div> -->

			<BreakPoints />
			
			<BrandBar class="flex justify-between items-center px-4 pr-5 md:ml-3 shadow-theme-layout">
				<UserPopout />
				<BrandLogo />
			</BrandBar>

			<MainNavBar class="shadow-theme-layout"></MainNavBar>

			<MainContent>
				<slot></slot>
			</MainContent>
			
			<FooterBox class="shadow-theme-layout" />

			<NotificationControl />
			
			<PlatformInfo />
			
		</div>

	</div> 

</template> 

	
<style lang="postcss" scoped>

	.active-tab .icon-symbol { @apply text-orange hover:text-black }
	
</style>
