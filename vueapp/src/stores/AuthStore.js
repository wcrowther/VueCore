
export const useAuthStore = defineStore('AuthStore',
{
    state: () => 
    ({
        user:                   new AuthUser(),
        roles:                  [],
        isAuthenticated:        false,
        isAuthChecked:          false,
        authCheckInFlight:      null,
        isLoggingOut:           false,
        isBusy:                 false,
        error:                  '',
        returnUrl:              '/',
        lastRequestDatetime:    ''
    }),
    getters:
    {
        isLoggedIn:             (state) => state.isAuthenticated,
        authUser:               (state) => state.user,
        userId:                 (state) => state.user.UserId || 0,
        userName:               (state) => state.user.FirstName || 'UserName',
        firstInitial:           (state) => state.user.FirstName?.charAt(0).toUpperCase() || 'U'
    },
    actions:
    {
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
        },
        clearAuthState()
        {
            this.user = new AuthUser()
            this.roles = []
            this.isAuthenticated = false
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
                    this.router.push(this.returnUrl)
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
                    this.router.push(this.returnUrl)
                    this.returnUrl = '/'
                }
            }
            catch(err)
            {   
                useToastStore().showError(err.message)   
            }
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
                this.router.push(route || '/auth/login')
            }
        },
        async redirect (route)
        {
            this.router.push(route || '/')
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
