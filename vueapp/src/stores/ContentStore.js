
// Uses Composition Api-style syntax

export const useContentStore = defineStore('ContentStore', () =>
{
    const toastStore = useToastStore()

    // STATE ------------------------------------------------------------------

    const uploads = ref([])
    const baseUrl = "/content/upload"

    // GETTERS ----------------------------------------------------------------

    const hasPendingUploads = computed(() =>
        uploads.value.some(item => item.status === 'pending')
    )

    const hasDoneUploads = computed(() =>
        uploads.value.some(item => item.status === 'done')
    )

    // ACTIONS ----------------------------------------------------------------

    function addFiles(files, maxSizeMB)
    {
        files.forEach(file =>
        {
            if (file.size > maxSizeMB * 1024 * 1024)
            {
                uploads.value.push({ file, status: 'error', error: 'File too large' })
                return
            }

            const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : null

            uploads.value.push({
                file,
                preview,
                progress: 0,
                status: 'pending',
                controller: null,
                error: null
            })
        })
    }

    async function uploadFile(item, onUploaded, onError)
    {
        const form = new FormData()
        form.append('file', item.file)

        const controller = new AbortController()
        item.controller = controller
        item.status = 'uploading'

        try
        {
            const result = await apiFormPost(baseUrl, form, pct => item.progress = pct, controller.signal )

            item.status = 'done'
            item.error = null

            if (onUploaded)
                onUploaded(result.data)

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

            if (onError)
                onError(err)
            else
                toastStore.showError(err.message)

            return null
        }
    }

    function uploadAll(onUploaded, onError)
    {
        uploads.value
            .filter(item => item.status === 'pending')
            .forEach(item => uploadFile(item, onUploaded, onError))
    }

    function cancelUpload(item)
    {
        item.controller?.abort()
    }

    function retryUpload(item, onUploaded, onError)
    {
        item.progress = 0
        item.status = 'pending'
        item.error = null

        return uploadFile(item, onUploaded, onError)
    }

    function removeUpload(index)
    {
        const item = uploads.value[index]
        if (item?.preview)
            URL.revokeObjectURL(item.preview)

        uploads.value.splice(index, 1)
    }

    function clearDoneUploads()
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
        uploadAll,
        cancelUpload,
        retryUpload,
        removeUpload,
        clearDoneUploads
    }
})
