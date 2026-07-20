<script setup>

    import { useSessionStorage } from '@vueuse/core'

	const showWizardBorder =  useSessionStorage('showWizardBorder', false) 
	const toggleBorder = () => showWizardBorder.value = !showWizardBorder.value

</script>

<template>

    <div class="w-full min-h-[400px] relative">

        <PageTitleBox pageTitle="Wizard Example">
            <button class="btn-primary" @click="toggleBorder">
                Wizard border: {{ showWizardBorder ? 'ON' : 'OFF' }}
            </button>
        </PageTitleBox>

        <div class="float-right ml-5 mb-3 mt-1 flex items-center cursor-pointer px-4 py-2 h-6 text-xs leading-[1.3rem] 
					select-none font-bold w-[140px] rounded-full border border-color-dark-blue !text-color-dark-blue"
            @click="toggleBorder">
            Wizard border: {{ showWizardBorder ? 'ON' : 'OFF' }}
        </div>

        <InfoBox>
            This page showcases a collection of reusable UI controls available in the application.
            Use the tabs below to explore each category — <b>Wizard</b> walks through a multi-step form flow,
            <b>Files</b> demonstrates file and folder management, <b>Calendar</b> shows event scheduling,
            <b>Grid</b> covers data tables, <b>Json</b> displays an interactive JSON tree viewer,
            and <b>Misc</b> contains additional utility components.
        </InfoBox>

        <!-- FloaterControl here 
				<FloaterControl v-model="showFloaterOne" name="FloaterOne" title="Floater One"
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

</template>