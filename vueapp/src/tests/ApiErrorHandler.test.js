import { describe, it, expect, vi } from 'vitest'
import { handleApiError } from '../composables/ApiErrorHandler'

function makeStores()
{
	return {
		authStore: 
		{
			logout: vi.fn(async () => {}),
			redirect: vi.fn()
		},
		toastStore: 
		{
			showToast: vi.fn()
		}
	}
}

describe('handleApiError', () =>
{
	it('swallows canceled requests with no toast', async () =>
	{
		const { authStore, toastStore } = makeStores()
		const err = { code: 'ERR_CANCELED' }

		const result = await handleApiError({ err, url: '/accounts/get', authStore, toastStore })

		expect(result.message).toBe('')
		expect(toastStore.showToast).not.toHaveBeenCalled()
		expect(authStore.logout).not.toHaveBeenCalled()
	})

	it('returns invalid credentials on public login 401', async () =>
	{
		const { authStore, toastStore } = makeStores()
		const err = { response: { status: 401 } }

		const result = await handleApiError({ err, url: '/authenticate/login', authStore, toastStore })

		expect(result.message).toBe('Invalid username or password.')
		expect(authStore.logout).not.toHaveBeenCalled()
		expect(toastStore.showToast).toHaveBeenCalledTimes(1)
	})

	it('stays silent for /authenticate/me 401 auth probe', async () =>
	{
		const { authStore, toastStore } = makeStores()
		const err = { response: { status: 401 } }

		const result = await handleApiError({ err, url: '/authenticate/me', authStore, toastStore })

		expect(result.message).toBe('')
		expect(authStore.logout).not.toHaveBeenCalled()
		expect(toastStore.showToast).not.toHaveBeenCalled()
	})

	it('logs out and redirects on protected 401', async () =>
	{
		const { authStore, toastStore } = makeStores()
		const err = { response: { status: 401 } }

		const result = await handleApiError({ err, url: '/accounts/getPagedAccounts', authStore, toastStore })

		expect(result.message).toBe('You need to be authorized for that content. Please log in.')
		expect(authStore.logout).toHaveBeenCalledWith('/auth/login', { callApi: false })
		expect(toastStore.showToast).toHaveBeenCalledTimes(1)
	})

	it('shows warning on 403 without forced redirect', async () =>
	{
		const { authStore, toastStore } = makeStores()
		const err = { response: { status: 403, data: 'Forbidden.' } }

		const result = await handleApiError({ err, url: '/accounts/getPagedAccounts', authStore, toastStore })

		expect(result.message).toBe('Forbidden.')
		expect(authStore.redirect).not.toHaveBeenCalled()
		expect(toastStore.showToast).toHaveBeenCalledTimes(1)
	})
})
