export const envConsts = Object.freeze(
{
    baseApiUrl:                 import.meta.env.VITE_API_URL,
    apiDocsUrl:                 import.meta.env.VITE_API_DOCS_URL,
    vueCoreUrl:                 import.meta.env.VITE_VUE_CORE_URL,
    vueCoreSourceUrl:           import.meta.env.VITE_VUE_CORE_SOURCE_URL,
    baseUrl:                    import.meta.env.BASE_URL,
    mode:                       import.meta.env.MODE,
    activityUpdateThrottleMs:   MinutesToMs(import.meta.env.VITE_ACTIVITY_UPDATE_THROTTLE_MINUTES, 0),
    inactivityLogoutMs:         MinutesToMs(import.meta.env.VITE_INACTIVITY_LOGOUT_MINUTES, 1),
    warningBeforeLogoutMs:      MinutesToMs(import.meta.env.VITE_INACTIVITY_WARNING_BEFORE_LOGOUT_MINUTES, 0)
})