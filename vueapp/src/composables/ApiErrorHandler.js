function matchesPath(url, path)
{
	const normalizedUrl = (url || '').toLowerCase()
	const normalizedPath = path.toLowerCase()

	return normalizedUrl === normalizedPath || normalizedUrl.endsWith(normalizedPath)
}

function resolveErrorMessage(err)
{
	return err?.response?.data?.detail
		|| err?.response?.data?.error
		|| err?.response?.data
		|| err?.message
		|| 'Unexpected error.'
}

export async function handleApiError({ err, url, authStore, toastStore })
{
	const result =
	{
		message: '',
		toastType: 'ERROR',
		success: false,
		error: err
	}

	const status = err?.response?.status
	const isAuthProbeRequest  = matchesPath(url, '/authenticate/me')
	const isPublicAuthRequest = matchesPath(url, '/authenticate/login') || matchesPath(url, '/authenticate/signup')

	if (err?.code === 'ERR_CANCELED')
		return result

	if (err?.code === 'ERR_NETWORK')
	{
		result.message = 'Not able to communicate with the server. Please try again later.'
		result.toastType = 'WARNING'
	}
	else if (status === 400)
	{
		result.message = resolveErrorMessage(err)
		result.toastType = 'WARNING'
	}
	else if (status === 401)
	{
		if (isAuthProbeRequest)
			return result

		if (isPublicAuthRequest)
		{
			result.message = 'Invalid username or password.'
			result.toastType = 'WARNING'
		}
		else
		{
			await authStore.logout('/auth/login', { callApi: false })
			result.message = 'You need to be authorized for that content. Please log in.'
			result.toastType = 'WARNING'
		}
	}
	else if (status === 403)
	{
		result.message = resolveErrorMessage(err) || 'You are not authorized for that content.'
		result.toastType = 'WARNING'
	}
	else
	{
		result.message = resolveErrorMessage(err)
		result.toastType = 'WARNING'
	}

	if (result.message)
		toastStore.showToast(result.message, result.toastType)

	return result
}