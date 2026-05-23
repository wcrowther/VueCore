<script setup>
	//import { useScrollLock } from '@/composables/UseScrollLock'

	const showFullScreen = defineModel({ type: Boolean, default: false })

	const props = defineProps(
		{
			teleportToModals: { type: Boolean, default: true },
			zIndex: { type: Number, default: 999 },
		})

	defineOptions({ inheritAttrs: false })

	const toggleFullScreen = () => showFullScreen.value = !showFullScreen.value
	const closeFullScreen = () => showFullScreen.value = false

	useScrollLock(showFullScreen)

</script>

<template>

	<Teleport to="#modals" :disabled="!showFullScreen || !props.teleportToModals">

		<div v-bind="$attrs" :style="showFullScreen ? { zIndex: props.zIndex } : undefined" 
			:class="showFullScreen ? 'fixed inset-0 flex bg-black bg-opacity-35'
								   : 'relative w-full'">

			<div :class="showFullScreen
				? 'relative h-full w-full bg-white overflow-auto scrollbar-thin shadow-lg shadow-color-dark-gray'
				: 'relative w-full'">

				<button type="button" :aria-label="showFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'"
					:title="showFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'"
					@click="showFullScreen ? closeFullScreen() : toggleFullScreen()"
					class="absolute right-3 top-3 z-10 size-8 rounded-full bg-white/90 hover:bg-white shadow-md flex-center">

					<IconSymbol width="18px" class="text-color-dark-gray"
						:icon="showFullScreen ? 'heroicons-solid:x' : 'heroicons:arrows-pointing-out-20-solid'" />
				</button>

				<slot />

			</div>
		</div>

	</Teleport>

</template>

<!-- Usage: 

    <FullScreenControl v-model="showFullScreen"  />
-->
