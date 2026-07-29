<script setup>

    const props = defineProps(
    {
        v$: { type: Object, required: true }
    })

    const interviewStore = useInterviewStore()
    const skillsAndGoals = interviewStore.interview.SkillsAndGoals

    const skillOptions =
    {
        communication: 'Communication',
        leadership: 'Leadership',
        teamwork: 'Teamwork',
        javascript: 'JavaScript',
        vue: 'Vue',
        problemSolving: 'Problem Solving'
    }

    const interestAreas =
    {
        engineering: 'Engineering',
        product: 'Product',
        design: 'Design',
        operations: 'Operations',
        data: 'Data and Analytics'
    }

    const validateStep = async () => await props.v$.SkillsAndGoals.$validate()

    const autoFillStep = () =>
    {
        Object.assign(skillsAndGoals,
        {
            TopSkills: ['communication', 'javascript', 'vue'],
            InterestArea: 'engineering',
            CareerGoal: 'Grow into a staff-level engineer role focused on product architecture.'
        })

        props.v$.SkillsAndGoals.$reset()
    }

    defineExpose({ validateStep })

</script>

<template>

    <div>

        <TitleBox class="!m-0 !mb-4">Step 4: Skills, Interests, and Goal</TitleBox>

        <p class="mb-4 text-sm leading-6">
            Highlight what you are strongest at and where you want to grow.
        </p>

        <div class="mb-4">
            <button type="button" class="text-xs font-bold underline underline-offset-2 !text-color-dark-blue hover:!text-orange"
                @click="autoFillStep">
                AutoFill Step
            </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-1">

            <MultiSelectInput labelName="Top Skills" ruleName="TopSkills"
                v-model="skillsAndGoals.TopSkills" :optionsList="skillOptions" :v$="props.v$.SkillsAndGoals"
                class="xl:col-span-2" />

            <SelectInput labelName="Interest Area" ruleName="InterestArea"
                v-model="skillsAndGoals.InterestArea" :optionsList="interestAreas"
                defaultText="-- Select Interest --" :v$="props.v$.SkillsAndGoals" />

            <TextAreaInput labelName="Career Goal" ruleName="CareerGoal"
                v-model="skillsAndGoals.CareerGoal" :v$="props.v$.SkillsAndGoals" autogrow class="xl:col-span-2" />

        </div>

    </div>

</template>
