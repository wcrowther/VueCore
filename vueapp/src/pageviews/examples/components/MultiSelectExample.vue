<script setup>

	const selectedStates 	= ref([])

	// const isCommaMode	= ref(false)
	// const multSelectMode	= computed(() => isCommaMode.value ? 'comma' : 'capsule')

	const modeIndex       	= ref(0)
	const modeList    		= [ { name: 'Mode: Capsule', value: 'capsule'},
								{ name: 'Mode: Comma Separated', value: 'comma'} ]
	const hideSelectedIndex = ref(0)
	const hideSelectedList  = [ { name: 'HideSelected: false', value: false},
								{ name: 'HideSelected: true', value: true} ]							

</script>

<template>

	<div class="mb-10">

		<div class="flex flex-wrap justify-between  mt-10 mb-5">

        	<div class="text-lg font-bold mb-5">MultiSelectInput</div>

			<!-- <SwitchButton class="bg-color-primary text-white" buttonName="Mode" v-model="isCommaMode" /> -->
			
			<div class="mt-5 sm:mt-0 flex w-[350px]">
				<ListIndexButton v-model="hideSelectedIndex" :rangeList="hideSelectedList"
					class="w-[155px] !bg-white border border-color-dark-blue !text-color-dark-blue mr-2" />
				
				<ListIndexButton v-model="modeIndex" :rangeList="modeList"
					class="w-[185px] !bg-white border border-color-dark-blue !text-color-dark-blue" />
			</div>
	
			<InfoBox>
				A powerful, searchable multi-select dropdown with a clean capsule or comma-separated display.
				Supports flexible data formats, select-all shortcuts, and built-in Vuelidate validation — everything you need in one component.
        	</InfoBox>

		</div>

		<MultiSelectInput labelName="U.S. States" v-model="selectedStates" :optionsList="usStatesList"
			:mode="modeList[modeIndex].value" :hideSelected="hideSelectedList[hideSelectedIndex].value" />
	</div>

</template>