
// Uses Composition Api-style syntax

export const useAppStore = defineStore('AppStore', () => 
{
    // State ------------------------------------------------------------------
    
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
	
    // Getters ------------------------------------------------------------------

	const infoLevelText = computed(() =>
	{
		switch (infoLevel.value)
		{
			case 1: return "?"
			case 2: return "Info"
			case 3: return "Help"
			default: return "Info"
		}
	})

    // Actions ------------------------------------------------------------------

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

    const setInfoLevel  = (num) => 
	{
		const min = 1
	    const max = 3

        let val = infoLevel.value + num

		if(val < min)
			val = max
		else if(val > max)
			val = min

		infoLevel.value = val
	}

    // Return ------------------------------------------------------------------

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
        infoLevelText,

        // actions
        resetLocalStorage,
        setInfoLevel
    }
})
