	
<script setup>

    const { platform }						= usePlatform()
    const appStore   						= useAppStore()
    const {  sideBarHidden, globalKeysOn } 	= storeToRefs(appStore)
	const { setInfoLevel }					= appStore

	// Keyboard Listeners  ===========================================================================

	const keys = function (e)   
    {
		// Disable global keys like Escape (Esc) key by toggling globalKeysOn
		if (e.code === 'Escape'){ sideBarHidden.value = !sideBarHidden.value; e.preventDefault(); } 

		let ctrl = platform.value === "MacOS" ? e.metaKey : e.ctrlKey   
        if (e.code === 'KeyH' && ctrl ){ setInfoLevel(1); e.preventDefault() }
	}

	KeyboardListeners(keys, globalKeysOn)	// Sets Key listeners for all pages using this layout
	SetHtmlHeadBody() 						// Sets CSS 'theme' or 'alt-theme' for this layout

</script>

<template>

	<div id="layout-no-nav">

		<div id="background-div" 
			class="fixed top-0 bottom-0 left-0 right-0 bg-gradient-back">
		</div>

		<div class="main-width mb-10 relative z-0 h-full">

			<!-- Debugging variable here if needed
			<div class="text-white p-3">globalKeysOn: {{ globalKeysOn }}</div> -->

			<BreakPoints />
			
			<BrandBar class="flex justify-between items-center px-4 pr-5 md:ml-3 shadow-theme-layout">
				<UserPopout />
				<BrandLogo />
			</BrandBar>

			<NavBar class="bg-gradient-navbar md:ml-3"></NavBar>	

			<MainContent>
				<slot></slot>
			</MainContent>
			
			<FooterBox class="shadow-theme-layout" />

		</div>

	</div> 

</template> 

	
<style lang="postcss" scoped>

	.active-tab .icon-symbol { @apply text-orange hover:text-black }
	
</style>
