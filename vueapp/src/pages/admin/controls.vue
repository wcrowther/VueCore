<script setup>

    import { useSessionStorage } from '@vueuse/core'

    const pageTitle  = ref('Control Examples')

	const showWizardBorder =  useSessionStorage('showWizardBorder', false) 
	const toggleBorder = () => showWizardBorder.value = !showWizardBorder.value

</script>

<template>

    <div class="relative" id="admincontrols">

		<BackGradation />

        <div class="p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <div class="flex justify-between items-center mb-7 relative">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>

			<div class="w-full min-h-[400px] relative">

				<div class="float-right ml-5 mb-3 mt-1 flex items-center cursor-pointer px-4 py-2 h-6 text-xs leading-[1.3rem] 
					select-none font-bold w-[140px] rounded-full border border-color-dark-blue !text-color-dark-blue"
					@click="toggleBorder" >
					Wizard border: {{ showWizardBorder ? 'ON' : 'OFF' }}
				</div>

				<InfoBox class="mb-7">
					This page showcases a collection of reusable UI controls available in the application.
					Use the tabs below to explore each category — <b>Wizard</b> walks through a multi-step form flow, 
					<b>Files</b> demonstrates file and folder management, <b>Calendar</b> shows event scheduling, 
					<b>Grid</b> covers data tables, <b>Json</b> displays an interactive JSON tree viewer, 
					and <b>Misc</b> contains additional utility components.
				</InfoBox>

				<!-- FloaterControl here 
				<FloaterControl :show="true" name="FloaterOne"
					class="bg-white w-[400px] h-[300px] p-5">
					Some floating content here.
				</FloaterControl>
				-->

				<WizardControl class="mb-10" :useKeyControls="false" :showBorder="showWizardBorder"
					:tabList="['Files', 'Comps', 'Calendar', 'Grid', 'Json', 'Misc']">
			
					<template #Files>
						<FilesExample />
					</template>
			
					<template #Comps>
						<ComposablesExample />
					</template>

					<template #Calendar>
						<CalendarExample />
					</template>
				
					<template #Grid>
						<GridExample />
					</template>

					<template #Json>
						<JsonTreeExample /> 
					</template>

					<template #Misc>
						<MiscExample />
					</template>

				</WizardControl>

			</div>

        </div>
    </div>  
</template>