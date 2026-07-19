import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { mockToast } = vi.hoisted(() =>
{
    const toastFn = vi.fn(() => 'toast-1')
    toastFn.dismiss = vi.fn()
    return { mockToast: toastFn }
})

vi.mock('vue-toastification', () =>
({
    useToast: () => mockToast,
    POSITION: { TOP_CENTER: 'top-center' },
    TYPE: { DEFAULT: 'default' }
}))

import { useToastStore } from '../stores/ToastStore'

describe('ToastStore', () =>
{
    beforeEach(() =>
    {
        setActivePinia(createPinia())
        mockToast.mockClear()
        mockToast.dismiss.mockClear()
    })

    it('executes actionable warning callback and dismisses toast', async () =>
    {
        const store = useToastStore()
        const onAction = vi.fn(async () => {})

        store.showAction('Session expiring soon.', 'Stay Signed In', onAction, 5000, true)

        expect(mockToast).toHaveBeenCalledTimes(1)

        const [content, options] = mockToast.mock.calls[0]
        expect(options.type).toBe('warning')
        expect(content?.listeners?.action).toBeTypeOf('function')

        await content.listeners.action()

        expect(onAction).toHaveBeenCalledTimes(1)
        expect(mockToast.dismiss).toHaveBeenCalledWith('toast-1')
    })

    it('falls back to default type when invalid type is passed', () =>
    {
        const store = useToastStore()

        store.showToast('Type fallback test', 'NOT_A_TYPE', 2000, true)

        expect(mockToast).toHaveBeenCalledTimes(1)

        const [, options] = mockToast.mock.calls[0]
        expect(options.type).toBe('default')
    })

    it('suppresses duplicate plain-text toasts inside threshold', () =>
    {
        const store = useToastStore()

        store.showWarning('Duplicate test')
        store.showWarning('Duplicate test')

        expect(mockToast).toHaveBeenCalledTimes(1)
    })

    it('allows duplicate actionable warnings for inactivity cycles', () =>
    {
        const store = useToastStore()

        store.showAction('Session expiring soon.', 'Stay Signed In', null, 5000, true)
        store.showAction('Session expiring soon.', 'Stay Signed In', null, 5000, true)

        expect(mockToast).toHaveBeenCalledTimes(2)
    })
})
