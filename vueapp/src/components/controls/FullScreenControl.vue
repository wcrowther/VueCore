<script setup>

	const fullScreen = defineModel('fullScreen', { type: Boolean, default: false })
	const attrs = useAttrs()
	const props = defineProps(
	{
		zIndex: 			{ type: Number, default: 999 },
		showExitButton:		{ type: Boolean, default: true },
		exitButtonOnLeft: 	{ type: Boolean, default: false },
		showGradation: 		{ type: Boolean, default: true },
		inset: 				{ type: [Number, String, Object], default: 0 },
	})

	const toCssSize = value => typeof value === 'number' ? `${value}px` : value
	const exitPosition = computed(() => props.exitButtonOnLeft ? 'left-3' : 'right-3')
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

	const forwardedAttrs = computed(() =>
	{
		const { backGradation, ...rest } = attrs
		return rest
	})

	const useBackGradation = computed(() =>
	{
		const legacyValue = attrs.backGradation

		if (legacyValue !== undefined)
			return legacyValue !== false && legacyValue !== 'false'

		return props.showGradation
	})

	defineOptions({ inheritAttrs: false })

	// Keyboard Listeners  ==============================================================
	
    const keys = 
    {
		'Escape': () => { fullScreen.value = false }
    }

	KeyboardListeners(keys)
	DisableGlobalKeys(fullScreen) // disable global Esc key etc
	useScrollLock(fullScreen)

	watchEffect(() => { document.documentElement.style.overflow = fullScreen.value ? 'hidden' : '' })

</script>

<template>

	<Teleport to="#modals" :disabled="!fullScreen">

		<div :class="fullScreen ? 'fixed inset-0 flex isolate' : 'contents'" 
			:style="fullScreen ? { zIndex: props.zIndex } : undefined">

			<div v-if="fullScreen" class="absolute inset-0 z-[1] bg-black/35"></div>

			<div v-bind="fullScreen ? forwardedAttrs : undefined" :style="panelStyle" 
				:class="fullScreen ? 'relative z-[2] bg-white overflow-auto ' +
				'scrollbar-thin shadow-lg shadow-color-dark-gray' : 'contents'">

				<BackGradation v-if="fullScreen && useBackGradation" class="!h-full !bottom-0 !z-0" />

				<button v-if="fullScreen && props.showExitButton" type="button" aria-label="Exit fullscreen"
					title="Exit fullscreen" @click="fullScreen = false"
					:class="[exitPosition,'absolute top-3 z-10 size-8 rounded-full bg-gray-200/90',
					'hover:bg-white shadow-md shadow-gray-400 flex-center']">

					<IconSymbol width="18px" class="text-color-dark-gray" icon="heroicons:x-mark" />
				</button>

				<div class="relative z-10">
					<slot />
				</div>

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
