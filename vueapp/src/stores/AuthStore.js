
export const useAuthStore = defineStore('AuthStore',
{
    state: () => 
    ({
        authUser:               useLocalStorage('authUser', new AuthUser()),
        isBusy:                 false,
        error:                  '',
        returnUrl:              '/',
        autoRefreshMinutes:     29,
        lastRequestDatetime:    ''
    }),
    getters:
    {
        isLoggedIn:             (state) => 
        {
           return (state.authUser && state.authUser.Token && state.authUser.Token.length > 0) ? true : false
        },
        userId:                 (state) => state.authUser.UserId || 0,
        userName:               (state) => state.authUser.FirstName || 'UserName',
        firstInitial:           (state) => state.authUser.FirstName?.charAt(0).toUpperCase() || 'U',
        tokenExpiration:        (state) => state.authUser.TokenExpiration || '---',
        refreshTokenExpiration: (state) => state.authUser.RefreshTokenExpiration || '---'
    },
    actions:
    {
        async login (model)
        {
            try
            {
                const result  = await apiPost(`/authenticate/login`, model)

                if(result.success) 
                {
                    this.authUser = result.data
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

                if(result.success) 
                {
                    this.authUser = result.data
                    this.router.push(this.returnUrl)
                    this.returnUrl = '/'
                }
            }
            catch(err)
            {   
                useToastStore().showError(err.message)   
            }
        },
        async logout (route)
        {
            this.authUser = {}
            this.router.push(route || '/auth/login')
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
        },
        async refreshAuth (authRefreshRequest)
        {
            try
            {                
                const result  = await apiPost(`/authenticate/refreshAuth`, authRefreshRequest)

                if(result.success) 
                    this.authUser = result.data

                return result.success
            }
            catch(err)
            {
                useToastStore().showError(err.message) 
                return false 
            }
        },
    }
})
