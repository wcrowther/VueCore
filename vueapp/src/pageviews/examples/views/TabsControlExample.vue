<script setup>

	const tabIndex = ref(0)

	const primitiveTabs = ['First', 'Second', 'Third']

	const lookupTabs =
	{
		apples: 'Apples',
		bananas: 'Bananas',
		oranges: 'Oranges'
	}

	const radiationTabs =
	[
		{ id: 1, title: 'Alpha', description: 'A heavy, positively charged particle consisting of two protons and two neutrons (identical to a helium nucleus)' },
		{ id: 2, title: 'Beta', description: 'Small, fast-moving electrons ejected from an unstable atom\'s nucleus.' },
		{ id: 3, title: 'Gamma', description: 'Unlike alpha and beta particles, gamma rays are pure, high-energy electromagnetic waves. They have no mass and no electrical charge' },
	]

</script>

<template>

	<PageTitleBox pageTitle="TabsBar Example">

		<ListButton v-model="tabIndex" :rangeList="primitiveTabs"
			class="w-fit !bg-white border border-color-dark-blue !text-color-dark-blue" />

	</PageTitleBox>

	<InfoBox>
		This example demonstrates the usage of the TabsBar component with different overflow behaviors.
	</InfoBox>

	<div class="font-bold mb-7">
		Primitive list (strings/numbers)
	</div>

	<TabsControl v-model:activeTab="primitiveTabs[tabIndex]" :tabList="primitiveTabs" 
		altDesign class="mb-7" contentBorder :minHeight="100">

		<template #First>
			<div class="p-5">
				<div class="font-bold mb-3">First Content</div>
			</div>
		</template>
		<template #Second>
			<div class="p-5">
				<div class="font-bold mb-3">Second Content</div>
			</div>
		</template>
		<template #Third>
			<div class="p-5">
				<div class="font-bold text-red mb-3">Important</div>
			</div>
		</template>

	</TabsControl>

	<div class="font-bold mb-7">
		Lookup object (uses value as default)
	</div>

	<TabsControl :tabList="lookupTabs" class="mb-7" contentBorder :minHeight="100">

		<template #apples>
			<div class="p-5">
				<div class="font-bold mb-3">Apples Content</div>
			</div>
		</template>
		<template #bananas>
			<div class="p-5">
				<div class="font-bold mb-3">Bananas Content</div>
			</div>
		</template>
		<template #oranges>
			<div class="p-5">
				<div class="font-bold text-red mb-3">Oranges Content</div>
			</div>
		</template>

	</TabsControl>

	<div class="font-bold mb-7">
		Object list (tabFieldName optional; defaults to first field)
	</div>

	<TabsControl :tabList="radiationTabs" tabFieldName="title" class="mb-7" contentBorder :minHeight="100">

		<template #Alpha>
			<div class="p-5">
				<div class="font-bold mb-3">Alpha Content</div>
			</div>
		</template>
		<template #Beta>
			<div class="p-5">
				<div class="font-bold mb-3">Beta Content</div>
			</div>
		</template>
		<template #Gamma>
			<div class="p-5">
				<div class="font-bold text-red mb-3">Gamma Content</div>
			</div>
		</template>
	</TabsControl>

	<div class="font-bold mb-7">
		Object list (dynamic templates from description)
	</div>

	<TabsControl :tabList="radiationTabs" tabFieldName="title" class="mb-7" contentBorder :minHeight="180">

		<template v-for="tab in radiationTabs" :key="tab.id" #[tab.title]>
			<div class="p-5">
				<div class="font-bold mb-2">{{ tab.title }}</div>
				<div>{{ tab.description }}</div>
			</div>
		</template>

	</TabsControl>

</template>