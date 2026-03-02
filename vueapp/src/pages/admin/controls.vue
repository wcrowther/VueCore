<script setup>

    const pageTitle  = ref('Control Examples')

</script>

<template>

    <div class="relative" id="admincontrols">

        <div class="z-0 bg-gradient-main h-[500px] absolute top-0 left-0 right-0"></div>

        <div class="z-20 p-5 pt-5 sm:p-10 sm:pt-5 pb-14">

            <div class="flex justify-between items-center mb-7 relative">
                <h2 class="text-2xl font-display font-bold flex-grow">{{ pageTitle }}</h2>
            </div>

			<div class="w-full min-h-[400px] relative">

				<InfoBox class="mb-7">
					This page is a demonstration of a Wizard Control.
				</InfoBox>

				<!-- FloaterControl here 
				<FloaterControl :show="true" name="FloaterOne"
					class="bg-white w-[400px] h-[300px] p-5">
					Some floating content here.
				</FloaterControl>
				-->

				<WizardControl class="mb-10" :useKeyControls="false" 
					:tabList="['Wizard', 'Calendar', 'Grid', 'Json', 'Composable']">

					<template #Wizard>
						<WizardExample />
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

					<template #Composable>
						<ComposableExample />
					</template>

				</WizardControl>

			</div>

        </div>
    </div>  
</template>