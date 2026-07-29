<script setup>

    const props = defineProps(
    {
        v$: { type: Object, required: true }
    })

    const interviewStore = useInterviewStore()
    const education = interviewStore.interview.Education

    const validateStep = async () => await props.v$.Education.$validate()

    const autoFillStep = () =>
    {
        Object.assign(education,
        {
            HighestDegree: 'B.S. Computer Science',
            SchoolName: 'Northwest State University',
            GraduationYear: '2023',
            Certifications: 'AWS Cloud Practitioner, Scrum Fundamentals'
        })

        props.v$.Education.$reset()
    }

    defineExpose({ validateStep })

</script>

<template>

    <div>

        <TitleBox class="!m-0 !mb-4">Step 2: Education</TitleBox>

        <p class="mb-4 text-sm leading-6">
            Share a quick snapshot of your education background.
        </p>

        <div class="mb-4">
            <button type="button" class="text-xs font-bold underline underline-offset-2 !text-color-dark-blue hover:!text-orange"
                @click="autoFillStep">
                AutoFill Step
            </button>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-5 gap-y-1">

            <TextInput labelName="Highest Degree" ruleName="HighestDegree"
                v-model="education.HighestDegree" :v$="props.v$.Education" />

            <TextInput labelName="School Name" ruleName="SchoolName"
                v-model="education.SchoolName" :v$="props.v$.Education" />

            <TextInput labelName="Graduation Year" ruleName="GraduationYear"
                v-model="education.GraduationYear" :v$="props.v$.Education" maxlength="4" />

            <TextAreaInput labelName="Certifications" ruleName="Certifications"
                v-model="education.Certifications" :v$="props.v$.Education" autogrow />

        </div>

    </div>

</template>
