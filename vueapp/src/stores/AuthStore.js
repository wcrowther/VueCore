

// const activityUpdateThrottleMS   = MinutesToMs(import.meta.env.VITE_ACTIVITY_UPDATE_THROTTLE_MINUTES, 0)
// const inactivityLogoutMs         = MinutesToMs(import.meta.env.VITE_INACTIVITY_LOGOUT_MINUTES, 1)
// const warningBeforeLogoutMs      = MinutesToMs(import.meta.env.VITE_INACTIVITY_WARNING_BEFORE_LOGOUT_MINUTES, 0)
// const minTimeoutForWarningMs     = MinutesToMs(import.meta.env.VITE_INACTIVITY_MIN_TIMEOUT_FOR_WARNING_MINUTES, 0)

export const useAuthStore = defineStore('AuthStore',
{
    state: () => 
    ({
        user:                       new AuthUser(),
        roles:                      [],
        isAuthenticated:            false,
        isAuthChecked:              false,
        authCheckInFlight:          null,
        isLoggingOut:               false,
        isBusy:                     false,
        error:                      '',
        returnUrl:                  '/',
        lastRequestDatetime:        '',
        lastActivityTimestamp:      0,
        inactivityTimeoutMs:        envConsts.inactivityLogoutMs,
        inactivityTimerId:          null,
        inactivityWarningTimerId:   null,
        activityEventsBound:        false,
        activityHandler:            null,
        visibilityHandler:          null
    }),
    getters:
    {
        isLoggedIn:     (state) => state.isAuthenticated,
        authUser:       (state) => state.user,
        userId:         (state) => state.user.UserId || 0,
        userName:       (state) => state.user.FirstName || 'UserName',
        firstInitial:   (state) => state.user.FirstName?.charAt(0).toUpperCase() || 'U'
    },
    actions:
    {
        async navigateTo(route, replace = false)
        {
            const target = route || '/'
            const currentPath = this.router?.currentRoute?.value?.fullPath || ''

            if (currentPath === target)
                return

            try
            {
                if (replace)
                    await this.router.replace(target)
                else
                    await this.router.push(target)
            }
            catch
            {
                // Ignore navigation duplication/cancellation during rapid route changes.
            }
        },
        getCurrentUserEndpoints()
        {
            return ['/authenticate/me']
        },
        setAuthState(profile)
        {
            this.user = profile || new AuthUser()

            const rawRoles = profile?.Roles ?? profile?.Role ?? []
            this.roles = Array.isArray(rawRoles) ? rawRoles : (rawRoles ? [rawRoles] : [])
            this.isAuthenticated = true
            this.touchActivity()
        },
        clearAuthState()
        {
            this.user = new AuthUser()
            this.roles = []
            this.isAuthenticated = false

            if (typeof window !== 'undefined' && this.inactivityTimerId)
            {
                window.clearTimeout(this.inactivityTimerId)
                this.inactivityTimerId = null
            }

            if (typeof window !== 'undefined' && this.inactivityWarningTimerId)
            {
                window.clearTimeout(this.inactivityWarningTimerId)
                this.inactivityWarningTimerId = null
            }
        },
        touchActivity()
        {
            this.lastActivityTimestamp = Date.now()

            if (this.isAuthenticated)
                this.scheduleInactivityLogout()
        },
        onUserActivity()
        {
            if (!this.isAuthenticated)
                return

            const now = Date.now()
            if (now - this.lastActivityTimestamp < envConsts.activityUpdateThrottleMs)
                return

            this.touchActivity()
        },
        onVisibilityChange()
        {
            if (typeof document !== 'undefined' && document.visibilityState === 'visible' && this.isAuthenticated)
                this.touchActivity()
        },
        bindActivityEvents()
        {
            if (this.activityEventsBound || typeof window === 'undefined')
                return

            const events = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart']
            this.activityHandler = () => this.onUserActivity()
            this.visibilityHandler = () => this.onVisibilityChange()

            events.forEach((eventName) => window.addEventListener(eventName, this.activityHandler, { passive: true }))
            document.addEventListener('visibilitychange', this.visibilityHandler)

            this.activityEventsBound = true
        },
        startInactivityTracking()
        {
            this.bindActivityEvents()
            if (this.isAuthenticated)
                this.touchActivity()
        },
        scheduleInactivityLogout()
        {
            if (typeof window === 'undefined' || !this.isAuthenticated)
                return

            if (this.inactivityTimerId)
                window.clearTimeout(this.inactivityTimerId)

            if (this.inactivityWarningTimerId)
            {
                window.clearTimeout(this.inactivityWarningTimerId)
                this.inactivityWarningTimerId = null
            }

            const msUntilLogout = Math.max(0, this.lastActivityTimestamp + this.inactivityTimeoutMs - Date.now())

            if (this.inactivityTimeoutMs >= envConsts.minTimeoutForWarningMs)
            {
                const msUntilWarning = Math.max(0, msUntilLogout - envConsts.warningBeforeLogoutMs)

                this.inactivityWarningTimerId = window.setTimeout(() =>
                {
                    this.inactivityWarningTimerId = null
                    this.showInactivityWarning()
                }, msUntilWarning)
            }

            this.inactivityTimerId = window.setTimeout(async () =>
            {
                this.inactivityTimerId = null
                await this.handleInactivityDeadline()
            }, msUntilLogout)
        },
        showInactivityWarning()
        {
            if (!this.isAuthenticated || this.isLoggingOut)
                return

            const msUntilLogout = Math.max(1, this.lastActivityTimestamp + this.inactivityTimeoutMs - Date.now())
            const warningMins   = Math.round(envConsts.warningBeforeLogoutMs / 60000)
            const warningLabel  = warningMins === 1 ? '1 minute' : `${warningMins} minutes`

            useToastStore().showWarning(`You will be logged out in ${warningLabel} due to inactivity.`, msUntilLogout, true)
        },
        async handleInactivityDeadline()
        {
            if (!this.isAuthenticated || this.isLoggingOut)
                return

            useToastStore().showWarning('Session expired due to inactivity. Please log in again.')
            await this.logout('/auth/login', { callApi: true })
        },
        async fetchCurrentUser()
        {
            if (this.authCheckInFlight)
                return await this.authCheckInFlight

            this.isBusy = true

            this.authCheckInFlight = (async () =>
            {
                try
                {
                    for (const endpoint of this.getCurrentUserEndpoints())
                    {
                        const result = await apiGet(endpoint)

                        if (result.success && result.data)
                        {
                            this.setAuthState(result.data)
                            return true
                        }
                    }

                    this.clearAuthState()
                    return false
                }
                catch
                {
                    this.clearAuthState()
                    return false
                }
                finally
                {
                    this.isAuthChecked = true
                    this.isBusy = false
                    this.authCheckInFlight = null
                }
            })()

            return await this.authCheckInFlight
        },
        async login (model)
        {
            try
            {
                const result  = await apiPost(`/authenticate/login`, model)

                if(!result.success)
                    return

                await this.fetchCurrentUser()

                if (this.isAuthenticated)
                {
                    await this.navigateTo(this.returnUrl, true)
                    this.returnUrl = '/'  // reset
                }
            }
            catch(err)
            {
                useToastStore().showError(err.message)   
            }
        },
        async signup (model)
        {
            try
            {
                const result  = await apiPost(`/authenticate/Signup`, model)

                if(!result.success)
                    return

                await this.fetchCurrentUser()

                if (this.isAuthenticated)
                {
                    await this.navigateTo(this.returnUrl, true)
                    this.returnUrl = '/'
                }
            }
            catch(err)
            {   
                useToastStore().showError(err.message)   
            }
        },
        async refreshAuth()
        {
            const result = await apiAuth('/authenticate/refreshAuth', { UserId: this.userId })

            if (result.success)
                this.touchActivity()

            return result.success
        },
        async logout (route, options)
        {
            if (this.isLoggingOut)
                return

            this.isLoggingOut = true
            const opts = { callApi: true, ...options }

            try
            {
                if (opts.callApi)
                    await apiPost('/authenticate/logout')
            }
            catch
            {
                // Ignore server logout errors and still clear client auth state.
            }
            finally
            {
                this.clearAuthState()
                this.isAuthChecked = true
                this.isLoggingOut = false
                await this.navigateTo(route || '/auth/login', true)
            }
        },
        async redirect (route)
        {
            await this.navigateTo(route || '/', true)
        },        
        async delayedRedirect (route, msdelay)
        {
            setTimeout(() => 
            {
                this.redirect(route);  

            }, msdelay); // microsecond delay
        }
    }
})
