<script setup>

    const pageTitle  = ref('Control Examples')

	const showBorder = ref(false)
	const toggleBorder = () => showBorder.value = !showBorder.value

</script>

<template>

    <div class="relative" id="admincontrols">

		<BackGradation />

        <div class="p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <div class="flex justify-between items-center mb-7 relative">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>

			<div class="w-full min-h-[400px] relative">

				<InfoBox class="mb-7">
					This page showcases a collection of reusable UI controls available in the application.
					Use the tabs below to explore each category — <b>Wizard</b> walks through a multi-step form flow, 
					<b>Files</b> demonstrates file and folder management, <b>Calendar</b> shows event scheduling, 
					<b>Grid</b> covers data tables, <b>Json</b> displays an interactive JSON tree viewer, 
					and <b>Misc</b> contains additional utility components.
					<div @click="toggleBorder" class="font-bold mt-5">
						Wizard border {{showBorder ? 'On' : 'Off'}}
					</div>
				</InfoBox>

				<!-- FloaterControl here 
				<FloaterControl :show="true" name="FloaterOne"
					class="bg-white w-[400px] h-[300px] p-5">
					Some floating content here.
				</FloaterControl>
				-->

				<WizardControl class="mb-10" :useKeyControls="false" :showBorder
					:tabList="['Wizard', 'Files', 'Calendar', 'Grid', 'Json', 'Misc']">

					<template #Wizard>
						<WizardExample />
					</template>
			
					<template #Files>
						<FilesExample />
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