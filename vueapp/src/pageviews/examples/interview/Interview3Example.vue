<script setup>

    const props = defineProps(
    {
        v$: { type: Object, required: true }
    })

    const interviewStore = useInterviewStore()
    const jobHistory = interviewStore.interview.JobHistory

    const validateStep = async () => await props.v$.JobHistory.$validate()

    const autoFillStep = () =>
    {
        Object.assign(jobHistory,
        {
            MostRecentRole: 'Frontend Developer',
            MostRecentCompany: 'Blue Harbor Labs',
            YearsExperience: '4',
            KeyAchievement: 'Reduced onboarding time by building reusable UI form controls and docs.'
        })

        props.v$.JobHistory.$reset()
    }

    defineExpose({ validateStep })

</script>

<template>

    <div>

        <TitleBox class="!m-0 !mb-4">Step 3: Job History</TitleBox>

        <div class="flex items-baseline justify-between mb-4">
            <p class="text-sm leading-6">Tell us about your most recent role and key experience.</p>
            <button type="button" class="text-xs font-bold underline underline-offset-2 !text-color-dark-blue hover:!text-orange"
                @click="autoFillStep">
                AutoFill Step
            </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-1">

            <TextInput labelName="Most Recent Role" ruleName="MostRecentRole"
                v-model="jobHistory.MostRecentRole" :v$="props.v$.JobHistory" />

            <TextInput labelName="Most Recent Company" ruleName="MostRecentCompany"
                v-model="jobHistory.MostRecentCompany" :v$="props.v$.JobHistory" />

            <TextInput labelName="Years Experience" ruleName="YearsExperience"
                v-model="jobHistory.YearsExperience" :v$="props.v$.JobHistory" />

            <TextAreaInput labelName="Key Achievement" ruleName="KeyAchievement"
                v-model="jobHistory.KeyAchievement" :v$="props.v$.JobHistory" autogrow />

        </div>

    </div>

</template>
