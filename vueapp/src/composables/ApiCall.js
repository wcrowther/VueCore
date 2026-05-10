
import axios from 'axios'
import { handleApiError } from '@/composables/ApiErrorHandler'

// Cache for antiforgery token
let antiforgeryToken = null
let tokenPromise 	 = null

// ==================================================================================
// Specific API Methods - Use these if possible, over generic call
// Not apiAuth calls apiAuthCall with it's own logic for authorizing
// ==================================================================================

export async function apiAuth(url, body){  						   return apiAuthCall(url, body) }
export async function apiGet(url, signal){                         return apiCall('GET',  url, true, null,  false, null, signal) }
export async function apiPost(url, body, signal){                  return apiCall('POST', url, true, body,  false, null, signal) }
export async function apiPut(url, body, signal){                   return apiCall('PUT',  url, true, body,  false, null, signal) }
export async function apiPatch(url, body, signal){                 return apiCall('PATCH',  url, true, body,  false, null, signal) }
export async function apiDelete(url, body, signal){                return apiCall('DELETE', url, true, body,  false, null, signal) }
export async function apiFormPost(url, body, onProgress, signal){  return apiCall('POST',   url, true, body,  true,  onProgress, signal) }

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
		method: 			`${methodType}`, 		// POST, GET, etc
		headers: 			{},
		withCredentials: 	true  					// Sends Auth cookie
	}	

	// console.log(`apiCall: ${methodType} (useAuth: ${useAuth}) from Url: ${url}`)

	// Add antiforgery token for state-changing operations
	if (useAuth && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodType))
	{
		try
		{
			const token = await getAntiforgeryToken(appStore)
			request.headers['X-XSRF-TOKEN'] = token
		}
		catch (err)
		{
			console.error('Failed to get antiforgery token:', err)
		}
	}

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
		const retryRequest = async () =>
		{
			if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(methodType))
			{
				antiforgeryToken = null  // force fresh fetch after new access token cookie
				const token = await getAntiforgeryToken(appStore)
				request.headers['X-XSRF-TOKEN'] = token
			}
			return await axios(request)
		}

		result = await handleApiError({ err, url, authStore, toastStore, retryRequest })
	}

	return result
}

// PRIVATE =======================================================================

// Used for auth-layer calls (e.g. token refresh) — no antiforgery, no 401 retry, no authStore
// dependency to avoid circular imports (AuthStore -> ApiCall -> useAuthStore -> AuthStore).

async function apiAuthCall(url, body)
{
	const appStore = useAppStore()
	try
	{
		const response = await axios(
		{
			baseURL:         appStore.baseApiUrl,
			url,
			method:          'POST',
			withCredentials: true,
			headers:         { 'Content-Type': 'application/json' },
			data:            JSON.stringify(body)
		})
		return { success: response.status === 200, data: response.data }
	}
	catch
	{
		return { success: false }
	}
}

// Used to prevent Cross-Site Request Forgery (CSRF) attacks
async function getAntiforgeryToken(appStore)
{
	// If token exists and is fresh (less than 10 minutes old), reuse it
	if (antiforgeryToken?.token && antiforgeryToken.timestamp > Date.now() - 600000)
		return antiforgeryToken.token

	// If a request is already in flight, wait for it
	if (tokenPromise)
		return tokenPromise

	// Fetch new token
	tokenPromise = (async () => 
	{
		try
		{
			const response = await axios(
			{
				baseURL: appStore.baseApiUrl,
				url: '/authenticate/antiforgery/token',
				method: 'GET',
				withCredentials: true
			})

			antiforgeryToken = 
			{
				token: response.data.token,
				timestamp: Date.now()
			}

			return antiforgeryToken.token
		}
		finally
		{
			tokenPromise = null
		}
	})()

	return tokenPromise
}

/*
==================================================================================
EXAMPLE CODE: 
==================================================================================
const result      = await apiGet(`/accounts/getAccountById/${accountId}`)
if (result.success) account.value = Object.assign(new AccountModel(), result.data.Result)

const result      = await apiPost(`/accounts/createAccount`, model)
if (result.success) account.value = Object.assign(new AccountModel(), result.data)

const result      = await apiPut(`/accounts/updateAccount/${accountId}`, model)
if (result.success) account.value = Object.assign(new AccountModel(), result.data)

const result      = await apiPatch(`/accounts/updateAccountName/${accountId}`, { name: 'New Name' })
if (result.success) account.value = Object.assign(new AccountModel(), result.data)

const result      = await apiDelete(`/accounts/deleteAccount/${accountId}`)
if (result.success) accounts.value = accounts.value.filter(a => a.accountId !== accountId)

const result      = await apiAuth(`/authenticate/refreshAuth`, { UserId: userId })
// if result.success - token cookies refreshed server-side

const result      = await apiFormPost(`/files/upload`, formData, (pct) => progress.value = pct)
if (result.success) files.value.push(result.data)
==================================================================================

*/

