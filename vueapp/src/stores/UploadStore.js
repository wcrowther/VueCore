
// Uses Composition Api-style syntax

export const useUploadStore = defineStore('UploadStore', () =>
{
    const toastStore = useToastStore()
    const fileStore = useFileStore()

    // STATE ------------------------------------------------------------------

    const uploads       = ref([])
    const maxSizeMB     = ref(10)

    // GETTERS ----------------------------------------------------------------

    const hasPendingUploads = computed(() => uploads.value.some(item => item.status === 'pending'))
    const hasDoneUploads    = computed(() => uploads.value.some(item => item.status === 'done'))

    // ACTIONS ----------------------------------------------------------------

    const addFiles = (files) =>
    {
        files.forEach(file =>
        {
            if (file.size > (maxSizeMB.value * 1024 * 1024))
            {
                uploads.value.push({ file, status: 'error', error: 'File too large' })
                return
            }

            const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null
            uploads.value.push({ file, preview, progress: 0, status: 'pending', controller: null, error: null })
        })
    }

    const uploadFile = async (item) =>
    {
        const form = new FormData()
        form.append('file', item.file)

        const controller = new AbortController()
        item.controller = controller
        item.status = 'uploading'

        try
        {
            const result = await apiFormPost("/content/upload", form, pct => item.progress = pct, controller.signal )

            item.status = 'done'
            item.error = null

            await fileStore.refresh()

            toastStore.showSuccess(`${item.file.name} uploaded successfully`)

            return result
        }
        catch (err)
        {
            if (err.code === 'ERR_CANCELED' || err.name === 'AbortError')
            {
                item.status = 'cancelled'
                return null
            }

            item.status = 'error'
            item.error = err.message

            toastStore.showError(err.message)

            return null
        }
    }

    const uploadAllFiles = () =>
    {
        uploads.value
            .filter(item => item.status === 'pending')
            .forEach(item => uploadFile(item))
    }

    const cancelUpload = (item) => item.controller?.abort()

    const retryUpload = (item) =>
    {
        item.progress = 0
        item.status = 'pending'
        item.error = null

        return uploadFile(item)
    }

    const removeUpload = (index) =>
    {
        const item = uploads.value[index]
        if (item?.preview)
            URL.revokeObjectURL(item.preview)

        uploads.value.splice(index, 1)
    }

    const clearDoneUploads = () =>
    {
        uploads.value.forEach(item =>
        {
            if (item.status === 'done' && item.preview)
                URL.revokeObjectURL(item.preview)
        })

        uploads.value = uploads.value.filter(item => item.status !== 'done')
    }

    // EXPOSE PUBLIC API ------------------------------------------------

    return {
        // state
        uploads,

        // getters
        hasPendingUploads,
        hasDoneUploads,

        // actions
        addFiles,
        uploadFile,
        uploadAllFiles,
        cancelUpload,
        retryUpload,
        removeUpload,
        clearDoneUploads
    }
})
