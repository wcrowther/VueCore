// import { ref, computed } from 'vue'

export function usePlatform() 
{
    const ua 			= navigator.userAgent || ''
    const platformRaw 	= ref('')
    const browserRaw 	= ref('')

    function detect() 
	{
        if (navigator.userAgentData?.platform) 
		{
            platformRaw.value = navigator.userAgentData.platform
        } 
		else 
		{
            platformRaw.value = navigator.platform || ua
        }

        // Browser detection 
        if (navigator.userAgentData?.brands) 
		{
            const brands = navigator.userAgentData.brands.map(b => b.brand).join(' ')

            if (/Chrom(e|ium)/i.test(brands)) 
				browserRaw.value = 'Chrome'
            else if (/Edge/i.test(brands)) 
				browserRaw.value = 'Edge'
            else 
				browserRaw.value = brands
        } 
		else 
		{
            if (/Edg/i.test(ua)) 
				browserRaw.value = 'Edge'
            else if (/Chrome/i.test(ua)) 
				browserRaw.value = 'Chrome'
            else if (/Firefox/i.test(ua)) 
				browserRaw.value = 'Firefox'
            else if (/Safari/i.test(ua)) 
				browserRaw.value = 'Safari'
            else 
				browserRaw.value = 'Unknown'
        }
    }

    const platform = computed(() => 
	{
        const value = platformRaw.value

        if (/Win/i.test(value)) 
			return 'Windows'
        if (/Mac/i.test(value)) 
			return 'MacOS'
        if (/Linux/i.test(value)) 
			return 'Linux'
        if (/iPhone|iPad|iPod/i.test(ua)) 
			return 'iOS'
        if (/Android/i.test(ua)) 
			return 'Android'

        return 'Unknown'
    })

    const deviceType = computed(() => 
	{
        if (/iPad|Tablet/i.test(ua))
			return 'tablet'

        if (/Mobi|Android|iPhone|iPod/i.test(ua))
			return 'mobile'

        // iPadOS 13+ lies as Mac → detect via touch
        if (platform.value === 'MacOS' && hasTouch.value) 
			return 'tablet'

        return 'desktop'
    })

    const hasTouch 	= computed(() => 'ontouchstart' in window || navigator.maxTouchPoints > 0 )
    const isMobile 	= computed(() => deviceType.value === 'mobile')
    const isTablet 	= computed(() => deviceType.value === 'tablet')
    const isDesktop = computed(() => deviceType.value === 'desktop')
    const isChrome 	= computed(() => browserRaw.value === 'Chrome')
    const isFirefox = computed(() => browserRaw.value === 'Firefox')
    const isSafari 	= computed(() => browserRaw.value === 'Safari')
    const isEdge 	= computed(() => browserRaw.value === 'Edge')

    detect()

    return {
        // raw
        ua,
        platformRaw,
        browserRaw,

        // normalized
        platform,
        browser: browserRaw,
        deviceType,

        // booleans
        isMobile,
        isTablet,
        isDesktop,
        hasTouch,

        isChrome,
        isFirefox,
        isSafari,
        isEdge
    }
}

/* USUAGE:  see  PlatformInfo component */