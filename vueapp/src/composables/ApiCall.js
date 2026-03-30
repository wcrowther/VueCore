
import axios from 'axios'
import { handleApiError } from '@/composables/ApiErrorHandler'

export async function apiGet(url, signal){                         return apiCall('GET',  url, true, null,  false, null,       signal) }
export async function apiPost(url, body, signal){                  return apiCall('POST', url, true, body,  false, null,       signal) }
export async function apiPut(url, body, signal){                   return apiCall('PUT',  url, true, body,  false, null,       signal) }
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

	try 
	{
		result 			= await axios(request)
		result.success	= true

		// logJson('result', JSON.stringify(result))

		authStore.lastRequestDatetime = Date.now()
	} 
	catch (err) 
	{
		result = await handleApiError({ err, url, authStore, toastStore })
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

