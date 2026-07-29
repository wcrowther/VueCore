<script setup>

    import { useSessionStorage } from '@vueuse/core'
    import { interviewValidator } from '@/helpers/validators'

	const showWizardBorder =  useSessionStorage('showWizardBorder', false) 
	const toggleBorder = () => showWizardBorder.value = !showWizardBorder.value

    const toastStore = useToastStore()
    const interviewStore = useInterviewStore()
    const v$ = useVuelidate(interviewValidator, interviewStore.interview)

    const interview1Ref = ref(null)
    const interview2Ref = ref(null)
    const interview3Ref = ref(null)
    const interview4Ref = ref(null)

    const validationMessageMap =
    {
        Name: 'Please complete the Name and Contact step before continuing.',
        Education: 'Please complete the Education step before continuing.',
        Job_History: 'Please complete the Job History step before continuing.',
        Skills: 'Please complete the Skills step before continuing.'
    }

    const beforeChange = async ({ fromTab, direction }) =>
    {
        if (direction !== 'next') return true
        if (fromTab === 'Summary') return true

        const validatorsByTab =
        {
            Name: interview1Ref.value?.validateStep,
            Education: interview2Ref.value?.validateStep,
            Job_History: interview3Ref.value?.validateStep,
            Skills: interview4Ref.value?.validateStep
        }

        const validateFn = validatorsByTab[fromTab]
        if (!validateFn) return true

        const isValid = await validateFn()

        if (!isValid)
        {
            toastStore.showWarning(validationMessageMap[fromTab] || 'Please complete the current step first.')
            return false
        }

        return true
    }

</script>

<template>

    <div class="w-full min-h-[400px] relative">

        <PageTitleBox pageTitle="Wizard Example"></PageTitleBox>

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

        <WizardControl class="mb-10" :showBorder="showWizardBorder" :beforeChange="beforeChange"
            :tabList="['Name', 'Education', 'Job_History', 'Skills', 'Summary']">

            <template #Name>
                <Interview1Example ref="interview1Ref" :v$="v$" />
            </template>

            <template #Education>
                <Interview2Example ref="interview2Ref" :v$="v$" />
            </template>

            <template #Job_History>
                <Interview3Example ref="interview3Ref" :v$="v$" />
            </template>

            <template #Skills>
                <Interview4Example ref="interview4Ref" :v$="v$" />
            </template>

            <template #Summary>
                <InterviewSummary />
            </template>

        </WizardControl>

    </div>

</template>