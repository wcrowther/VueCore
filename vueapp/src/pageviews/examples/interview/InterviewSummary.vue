<script setup>

    import { interviewValidator } from '@/helpers/validators'

    const interviewStore = useInterviewStore()
    const toastStore = useToastStore()
    const { createConfirm } = useConfirmControl()

    const v$ = useVuelidate(interviewValidator, interviewStore.interview)

    const submitInterview = async () =>
    {
        const isValid = await v$.value.$validate()
        if (!isValid)
        {
            toastStore.showWarning('Please complete all required interview fields before submitting.')
            return
        }

        const confirmed = await createConfirm('Submit this interview application?')
        if (!confirmed) return

        await interviewStore.submitInterviewSimulated()
        v$.value.$reset()
    }

    const resetInterview = async () =>
    {
        const confirmed = await createConfirm('Reset all interview responses?')
        if (!confirmed) return

        interviewStore.resetInterview()
        v$.value.$reset()
    }

</script>

<template>

    <div>

        <TitleBox class="!m-0 !mb-4">Step 5: Summary and Submit</TitleBox>

        <p class="mb-4 text-sm leading-6">
            Review your interview answers, then submit. This example simulates an API call.
        </p>

        <div class="border border-gray-300 rounded-md p-4 space-y-4 text-sm">

            <div>
                <h4 class="font-bold text-color-dark-blue mb-1">Contact Info</h4>
                <div>Name: {{ interviewStore.interview.ContactInfo.FullName || '-' }}</div>
                <div>Email: {{ interviewStore.interview.ContactInfo.Email || '-' }}</div>
                <div>Phone: {{ interviewStore.interview.ContactInfo.Phone || '-' }}</div>
                <div>Preferred Contact: {{ interviewStore.interview.ContactInfo.PreferredContact || '-' }}</div>
            </div>

            <div>
                <h4 class="font-bold text-color-dark-blue mb-1">Education</h4>
                <div>Highest Degree: {{ interviewStore.interview.Education.HighestDegree || '-' }}</div>
                <div>School: {{ interviewStore.interview.Education.SchoolName || '-' }}</div>
                <div>Graduation Year: {{ interviewStore.interview.Education.GraduationYear || '-' }}</div>
                <div>Certifications: {{ interviewStore.interview.Education.Certifications || '-' }}</div>
            </div>

            <div>
                <h4 class="font-bold text-color-dark-blue mb-1">Job History</h4>
                <div>Role: {{ interviewStore.interview.JobHistory.MostRecentRole || '-' }}</div>
                <div>Company: {{ interviewStore.interview.JobHistory.MostRecentCompany || '-' }}</div>
                <div>Years Experience: {{ interviewStore.interview.JobHistory.YearsExperience || '-' }}</div>
                <div>Key Achievement: {{ interviewStore.interview.JobHistory.KeyAchievement || '-' }}</div>
            </div>

            <div>
                <h4 class="font-bold text-color-dark-blue mb-1">Skills, Interests, and Goal</h4>
                <div>Top Skills: {{ interviewStore.interview.SkillsAndGoals.TopSkills.join(', ') || '-' }}</div>
                <div>Interest Area: {{ interviewStore.interview.SkillsAndGoals.InterestArea || '-' }}</div>
                <div>Career Goal: {{ interviewStore.interview.SkillsAndGoals.CareerGoal || '-' }}</div>
            </div>

            <div>
                <h4 class="font-bold text-color-dark-blue mb-1">Status</h4>
                <div>Dirty State: {{ interviewStore.isDirty ? 'Unsaved changes' : 'Saved snapshot' }}</div>
                <div>Last Submitted: {{ interviewStore.submittedAt ? dateTimeFormat(interviewStore.submittedAt) : 'Not submitted yet' }}</div>
            </div>

        </div>

        <div class="mt-5 flex gap-2 justify-end">
            <button class="btn-cancel" @click="resetInterview" :disabled="interviewStore.isSubmitting">
                Reset
            </button>
            <button class="btn-primary" @click="submitInterview" :disabled="interviewStore.isSubmitting">
                {{ interviewStore.isSubmitting ? 'Submitting...' : 'Submit Interview' }}
            </button>
        </div>

    </div>

</template>
