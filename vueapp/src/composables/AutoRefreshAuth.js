
const authStore     	= useAuthStore()
const { refreshAuth }   = authStore
const { authUser  } 	= storeToRefs(authStore)


export function AutoRefreshAuth()
{
	let interval = null

	const refreshToken = () =>
	{
		if( typeof authUser.value?.UserId === 'undefined' || authUser.value?.UserId === 0)
		{
			console.log(`AutoRefreshAuth.refreshToken has invalid UserId.`)	
			return
		}
		
		console.log(`AutoRefreshAuth.refreshToken UserId(${authUser.value.UserId}).`)

		let authRefreshRequest 	= new AuthRefreshRequest(authUser.value.UserId)
		let success 			= refreshAuth(authRefreshRequest)

		if(success) 
        {
			const message = `Refresh Token updated at ${timeFormat(Date.now())}`
			console.log(message) 
			//  useToastStore().showInfo(message)
		}
	}

    // Lifecycle & Watches  ==========================================================================

	onMounted(() =>    
	{        
		// Auto-refresh every 'autoRefreshMinutes' every minutes 14 minutes if token expires in 15 minutes
		interval = setInterval(refreshToken, authStore.autoRefreshMinutes * 60 * 1000);
	})

	onUnmounted(() => 
	{
		if (interval) clearInterval(interval);
	});
}
