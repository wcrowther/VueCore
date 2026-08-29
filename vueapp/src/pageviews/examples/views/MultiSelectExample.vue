<script setup>


	const modeList    		= [ { name: 'Mode: Capsule', value: 'capsule'},
								{ name: 'Mode: Comma Separated', value: 'comma'} ]
	const hideSelectedList  = [ { name: 'HideSelected: false', value: false},
								{ name: 'HideSelected: true', value: true} ]	
								
	const selectedStates 	= ref([])
	const modeIndex       	= ref(0)					
	const hideSelectedIndex = ref(0)							
	const mode 				= computed(() => modeList[modeIndex.value].value)
	const hideSelected 		= computed(() => hideSelectedList[hideSelectedIndex.value].value)	

</script>

<template>

	<div class="mb-10">

		<PageTitleBox pageTitle="MultiSelectInput">

			<!-- <SwitchButton class="bg-color-primary text-white" buttonName="Mode" v-model="isCommaMode" /> -->
			
			<div class="flex w-[350px]">
				<ListButton v-model:index="hideSelectedIndex" :rangeList="hideSelectedList"
					class="w-[155px] !bg-white border border-color-dark-blue !text-color-dark-blue mr-2" />
				
				<ListButton v-model:index="modeIndex" :rangeList="modeList"
					class="w-[185px] !bg-white border border-color-dark-blue !text-color-dark-blue" />
			</div>
			
		</PageTitleBox>

		<InfoBox>
            A powerful, searchable multi-select dropdown with a clean capsule or comma-separated display.
            Supports flexible data formats, select-all shortcuts, and built-in Vuelidate validation — 
			everything you need in one component.
	    </InfoBox>

		<HelpBox>
			<b>Quick use:</b> Type to filter, then click items to select. Use the Mode toggle to switch between
			<b>Capsule</b> and <b>Comma Separated</b> display while keeping the same selected values.
			Turn <b>HideSelected</b> on to hide items you've already picked.
			<br /><br />
			<b>Keyboard tips:</b> Use <b>↑ / ↓</b> to move through options, and press <b>Enter</b> to toggle
			the highlighted item selection.
		</HelpBox>

		<MultiSelectInput labelName="U.S. States" v-model="selectedStates" 
			:optionsList="usStatesList" :mode :hideSelected />
	</div>

</template>