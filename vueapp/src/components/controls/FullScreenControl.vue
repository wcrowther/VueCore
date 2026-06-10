<script setup>

const fullScreen = defineModel('fullScreen', { type: Boolean, default: false })

	const props = defineProps(
	{
		zIndex: 		{ type: Number, default: 999 },
		showExitButton:	{ type: Boolean, default: true },
		inset: 			{ type: [Number, String, Object], default: 0 },
	})

	const toCssSize = value => typeof value === 'number' ? `${value}px` : value

	const panelStyle = computed(() => 
	{
		if (!fullScreen.value)
			return undefined

		const style = { position: 'absolute' }
		const inset = props.inset

		if (typeof inset === 'number' || typeof inset === 'string') 
		{
			style.inset = toCssSize(inset)
			return style
		}

		if (inset && typeof inset === 'object') 
		{
			if (inset.top != null)
				style.top = toCssSize(inset.top)
			if (inset.right != null)
				style.right = toCssSize(inset.right)
			if (inset.bottom != null)
				style.bottom = toCssSize(inset.bottom)
			if (inset.left != null)
				style.left = toCssSize(inset.left)
		}

		return style
	})

	defineOptions({ inheritAttrs: false })
	useScrollLock(fullScreen)

	// Keyboard Listeners  ==============================================================
	
    const keys = function (e)   
    {
		if (e.code === 'Escape'){ fullScreen.value=false; e.preventDefault(); } 
    }

	KeyboardListeners(keys)
	DisableGlobalKeys(fullScreen.value) // disable global Esc key etc
	useScrollLock(fullScreen.value)

</script>

<template>

	<Teleport to="#modals" :disabled="!fullScreen">

		<div :class="fullScreen ? 'fixed inset-0 flex bg-black/35' : 'contents'" 
			:style="fullScreen ? { zIndex: props.zIndex } : undefined">

			<div v-bind="fullScreen ? $attrs : undefined" :style="panelStyle" 
				:class="fullScreen ? 'relative bg-white overflow-auto ' +
				'scrollbar-thin shadow-lg shadow-color-dark-gray' : 'contents'">

				<button v-if="fullScreen && props.showExitButton" type="button" aria-label="Exit fullscreen"
					title="Exit fullscreen" @click="fullScreen = false"
					class="absolute right-3 top-3 z-10 size-8 rounded-full bg-white/90 hover:bg-white shadow-md flex-center">

					<IconSymbol width="18px" class="text-color-dark-gray" icon="heroicons:x-mark" />
				</button>

				<slot />

			</div>
		</div>

	</Teleport>

</template>

<!-- Usage: 
	--------------------------------------------------------------------------------------
	NOTE: Classes applied to the FullScreenControl are only applied when fullScreen = true
	--------------------------------------------------------------------------------------

    <FullScreenControl v-model:fullScreen="fullScreen" :inset="24" />
		<div>Content Here</div>
	</FullScreenControl>

	<FullScreenControl v-model:fullScreen="fullScreen" inset="2rem">...

	<FullScreenControl v-model:fullScreen="fullScreen" 
		:inset="{ top: 16, right: 24, bottom: 16, left: 24 }">...

	<FullScreenControl v-model:fullScreen="fullScreen" :fullScreenExitButton="false">...
-->
