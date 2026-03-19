
import axios from 'axios'

export async function apiGet(url, signal){                         return apiCall('GET',  url, true, null,  false, null,       signal) }
export async function apiPost(url, body, signal){                  return apiCall('POST', url, true, body,  false, null,       signal) }
export async function apiDelete(url, body, signal){                return apiCall('DELETE', url, true, body, false, null,      signal) }
export async function apiFormPost(url, body, onProgress, signal){  return apiCall('POST', url, true, body,  true,  onProgress, signal) }

// ==================================================================================

export async function apiCall(methodType, url, useAuth, body, isFormData, onProgress, signal) 
{
	const appStore     	= useAppStore()
	const authStore     = useAuthStore()
	const toastStore  	= useToastStore()

	let result 		= 
	{
		message: 		'',
		toastType:	 	'ERROR',
		success: 		false,
		error: 			{}
	}

	let request =  
	{
		baseURL: 			appStore.baseApiUrl,
		url:				url,
		method: 			`${methodType}`, 				// POST, GET, etc
		headers: 			{},
		withCredentials: 	true  					// Sends Auth cookie
	}	

	// console.log(`apiCall: ${methodType} (useAuth: ${useAuth}) from Url: ${url}`)

	if (body) 
	{
		// logJson('apiCall', JSON.stringify(body))  // DEBUGGING

		if (isFormData === true)
		{	
			request.data = body // Let axios/browser set multipart boundaries automatically.
			if (onProgress) 
				request.onUploadProgress = (e) => onProgress(Math.round((e.loaded * 100) / e.total))
		}
		else
		{
			request.headers['Content-Type'] = 'application/json'
			request.data = JSON.stringify(body)
		}
	}

	if (signal)
		request.signal = signal

	if (!!useAuth === true && authStore.authUser && authStore.authUser.Token) 
	{
		request.headers['Authorization'] = `Bearer ${authStore.authUser.Token}`
	}

	try 
	{
		result 			= await axios(request)
		result.success	= true

		// logJson('result', JSON.stringify(result))

		authStore.lastRequestDatetime = Date.now()
	} 
	catch (err) 
	{
		// console.log(`error: ${err}`)

		result.error = err

		if (err.code === 'ERR_CANCELED')
		{
			return result  // Swallow — intentional abort, no toast
		}
		else if(err.code === 'ERR_NETWORK')
		{
			result.message		 = 'Not able to communicate with the server. Please try again later.'
		}
		else if ([400].includes(err.response.status)) 
		{
			result.message		 = err.response.data.detail || err.response.data || err.response.data.error || err.message 
			result.toastType	 = 'WARNING'
		}		
		else if ([401].includes(err.response.status)) // 401 - Unauthorized (unauthenticated)
		{
			authStore.logout()
			result.message		 = "You need to be authorized for that content. Please log in."
			result.toastType	 = 'WARNING'
		}		
		else if ([403].includes(err.response.status)) // Forbidden (known but does not have rights to content)
		{
			authStore.redirect('/')
			result.message		 = err.response.data || "You are not authorized for that content."
			result.toastType	 = 'WARNING'
		} 
		else
		{
			result.message		 = err.message
			result.toastType	 = 'WARNING'
		}

		toastStore.showToast(result.message, result.toastType)   
	}

	return result
}

/*
==================================================================================
EXAMPLE CODE: 
==================================================================================
const result      = await apiGet(`/accounts/getAccountById/${accountId}`)
this.account      = result.data
==================================================================================
*/

