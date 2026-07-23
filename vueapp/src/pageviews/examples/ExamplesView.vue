<script setup>

	ShowSideButtonInSubNav()

	const selectedExample 	= ref('')
	const examplesStore 	= useExamplesStore()
	const { getComponent } 	= examplesStore

	const selectedExampleComponent = computed(() => getComponent(selectedExample.value))

</script>

<template>

	<SidebarControl sideBarId="ControlsMain">

		<template #sidebar>
			<ExamplesList v-model:selectedExample="selectedExample" />
		</template>

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

	</SidebarControl>

</template>
