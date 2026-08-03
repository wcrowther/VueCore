import InterviewModel from '@/models/InterviewModel'

export const useInterviewStore = defineStore('InterviewStore', () =>
{
    const toastStore = useToastStore()

    const interview = reactive(new InterviewModel())
    const savedInterview = ref(structuredClone(toRaw(interview)))
    const isSubmitting = ref(false)
    const submittedAt = ref('')

    const isDirty = computed(() =>
        JSON.stringify(interview) !== JSON.stringify(savedInterview.value)
    )

    function saveSnapshot()
    {
        savedInterview.value = structuredClone(toRaw(interview))
    }

    function resetInterview()
    {
        Object.assign(interview, new InterviewModel())
        submittedAt.value = ''
        saveSnapshot()
    }

    async function submitInterviewSimulated()
    {
        try
        {
            isSubmitting.value = true

            await new Promise(resolve => setTimeout(resolve, 900))

            submittedAt.value = new Date().toISOString()
            saveSnapshot()

            toastStore.showSuccess('Interview application submitted successfully.')
            return { success: true }
        }
        catch (err)
        {
            toastStore.showError(err?.message || 'Unable to submit interview application.')
            return { success: false }
        }
        finally
        {
            isSubmitting.value = false
        }
    }

    return {
        interview,
        savedInterview,
        isSubmitting,
        submittedAt,
        isDirty,
        saveSnapshot,
        resetInterview,
        submitInterviewSimulated
    }
})
