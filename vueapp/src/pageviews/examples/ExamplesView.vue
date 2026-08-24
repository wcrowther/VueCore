<script setup>

	ShowSideButtonInSubNav()

	const route 			= useRoute()
	const selectedExample 	= ref('')
	const examplesStore 	= useExamplesStore()
	const { getComponent } 	= examplesStore
	const { showFullscreen } = storeToRefs(examplesStore)

	const selectedExampleComponent = computed(() => getComponent(selectedExample.value))
	const breakPoint = 650

	if ('fullscreen' in route.query) showFullscreen.value = true

</script>

<template>

	<SidebarControl sideBarId="ControlsMain" :breakPoint="breakPoint">

		<template #sidebar>
			<ExamplesList v-model:selectedExample="selectedExample" />
		</template>

		<FullScreenControl v-model:fullScreen="showFullscreen"
			class="p-10 pt-14">

			<component v-if="selectedExampleComponent" :is="selectedExampleComponent" />
			<div v-else>
				<div class="text-lg font-bold mb-5">
					Examples
				</div>
				<div class="mb-7">
					This page showcases interactive examples of the app controls so you can quickly see how each component behaves.
					Your current filters returned no matches, so there is nothing to display until you change or clear the filter.
				</div>
			</div>

		</FullScreenControl>

	</SidebarControl>

</template>
