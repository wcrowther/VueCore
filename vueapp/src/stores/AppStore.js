
// Uses Composition Api-style syntax

export const useAppStore = defineStore('AppStore', () => 
{
    const sideBarHidden         = ref(false)
    const layoutEscapeKeyOn     = ref(true)
    const showPrevNext          = useLocalStorage('showPrevNext', true)
    const showBreakpoints       = useLocalStorage('showBreakpoints', false)
    const showNotification      = useLocalStorage('showNotification', true)
    const showNewChatMessages   = useLocalStorage('showNewChatMessages', true)
    const persistSearch         = useLocalStorage('persistSearch', false)
    const altTheme              = useLocalStorage('altTheme', false)
    const infoLevel             = useLocalStorage('infoLevel', 2)
    const activeFloater         = useLocalStorage('activeFloater', '')
    const pagerDebugger         = useLocalStorage('pagerDebugger', false)
    const pagerDebuggerX        = useLocalStorage('pagerDebuggerX', 400)
    const pagerDebuggerY        = useLocalStorage('pagerDebuggerY', 30)
    const baseApiUrl            = import.meta.env.VITE_API_URL
    const apiDocsUrl            = import.meta.env.VITE_API_DOCS_URL
    const vueCoreUrl            = import.meta.env.VITE_VUE_CORE_URL
    const vueCoreSourceUrl      = import.meta.env.VITE_VUE_CORE_SOURCE_URL
    const baseUrl               = import.meta.env.BASE_URL
    const mode                  = import.meta.env.MODE

    // Actions
    async function resetLocalStorage() 
    {
        const local =  
        [   
            'showPrevNext', 'showBreakpoints', 'showNotification',
            'showNewChatMessages','persistSearch', 'altTheme', 'infoLevel', 
            'activeFloater', 'pagerDebugger', 'pagerDebuggerX', 'pagerDebuggerY', 
        ]

        local.forEach(item => localStorage.removeItem(item))

        const toast = useToastStore()
        toast.showInfo('Removed local App preferences')

        setTimeout(() => router.go(0), 2000)
    }

    return {
        sideBarHidden,
        layoutEscapeKeyOn,
        showPrevNext,
        showBreakpoints,
        showNotification,
        showNewChatMessages,
        persistSearch,
        altTheme,
        infoLevel,
        pagerDebugger,
        pagerDebuggerX,
        pagerDebuggerY,
        activeFloater,
        baseApiUrl,
        apiDocsUrl,
        vueCoreUrl,
        vueCoreSourceUrl,
        baseUrl,
        mode,

        // actions
        resetLocalStorage,
    }
})
