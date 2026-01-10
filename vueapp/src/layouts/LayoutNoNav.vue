	
<script setup>

    const appStore   							= useAppStore()
    const {  sideBarHidden, layoutEscapeKeyOn } = storeToRefs(appStore)
	const { setInfoLevel }						= appStore

    // Keyboard Listeners & AutoRefreshAuth  ========================================================

	const keys = function (e)   
    {
		// Disable global Escape (Esc) key for layout by setting app.layoutEscapeKeyOn to false
		if (e.code === 'Escape' && layoutEscapeKeyOn.value){ sideBarHidden.value = !sideBarHidden.value; e.preventDefault(); } 

		let ctrl = navigator.userAgentData.platform.match("Mac") ? e.metaKey : e.ctrlKey   
        if (e.code === 'KeyH' && ctrl ){ setInfoLevel(1); e.preventDefault() }
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

		<div class="main-width mx-auto mb-10 relative z-0 h-full">

			<!-- Debugging variable here if needed
			<div class="text-white p-3">layoutEscapeKeyOn: {{ layoutEscapeKeyOn }}</div> -->

			<BreakPoints />
			
			<BrandBar class="flex justify-between items-center px-4 pr-5 md:ml-3 shadow-theme-layout">
				<UserPopout />
				<BrandLogo />
			</BrandBar>

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
