import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createRenderer, h, nextTick, ref, ssrContextKey } from 'vue'
import { PagerModel, SearchForAccount } from '../models/PagerModel'
import { usePagedList } from '../composables/UsePagedList'
import ExamplesList from '../pageviews/examples/ExamplesList.vue'

const storageValues = vi.hoisted(() => new Map())
const state = vi.hoisted(() => ({ persistSearch: false }))

vi.mock('@vueuse/core', async (importOriginal) =>
{
    const original = await importOriginal()
    const storage = {
        getItem: (key) => storageValues.get(key) ?? null,
        setItem: (key, value) => storageValues.set(key, value),
        removeItem: (key) => storageValues.delete(key),
    }
    return {
        ...original,
        useLocalStorage: (key, value, options) => original.useStorage(key, value, storage, options),
        useDebounceFn: () => () => {},
    }
})

vi.mock('../stores/AppStore', async () =>
{
    const { reactive, ref } = await import('vue')
    return { useAppStore: () => reactive({ persistSearch: ref(state.persistSearch) }) }
})
vi.mock('../stores/ExamplesStore', async () =>
{
    const { reactive, ref } = await import('vue')
    return { useExamplesStore: () => reactive({
        sortedExamplesDataList: ref([]), sortType: ref('default'),
        disableExamplesShortcuts: ref(false), showFullscreen: ref(false)
    }) }
})
vi.mock('vue-router/auto', () => ({ useRoute: () => ({ params: {} }) }))
vi.mock('../composables/UseKeyboardListeners', () => ({ KeyboardListeners: () => {} }))

const renderer = createRenderer({
    createElement: () => ({}),
    createText: (text) => ({ text }),
    createComment: (text) => ({ text }),
    setText: () => {},
    setElementText: () => {},
    parentNode: () => null,
    nextSibling: () => null,
    insert: () => {},
    remove: () => {},
    patchProp: () => {},
})

function mountExamples()
{
    const app = renderer.createApp({ ...ExamplesList, render: () => h('div') })
    app.provide(ssrContextKey, {})
    app.mount({})
    return { app, pager: app._instance.setupState.listPager }
}

function mountAccounts(urlSearch = null)
{
    const pager = ref(new PagerModel(new SearchForAccount()))
    const app = renderer.createApp({
        setup()
        {
            usePagedList({
                showAdvSearch: ref(false), getPagedItems: async () => {},
                itemsList: ref([]), listPager: pager, activeDetailId: ref(0),
                persistSearch: ref(state.persistSearch), detailKeyName: 'AccountId',
                pageSizeDefaultName: 'accountsPageSizeDefault',
                searchFilterDefaultName: 'accountsSearchFilterDefault',
                createSearchModel: () => new SearchForAccount(urlSearch),
            })
            return () => h('div')
        }
    })
    app.mount({})
    return { app, pager: pager.value }
}

describe('list search persistence', () =>
{
    beforeEach(() => { state.persistSearch = true })
    afterEach(() => { storageValues.clear() })

    it.each([
        ['examples', mountExamples, 'examplesSearchFilterDefault'],
        ['accounts', mountAccounts, 'accountsSearchFilterDefault'],
    ])('saves and restores %s searches only when enabled', async (name, mount, key) =>
    {
        const first = mount()
        first.pager.Search.Filter = 'saved search'
        await nextTick()
        expect(storageValues.get(key)).toBe('saved search')
        first.app.unmount()

        const restored = mount()
        expect(restored.pager.Search.Filter).toBe('saved search')
        restored.app.unmount()

        state.persistSearch = false
        const disabled = mount()
        expect(disabled.pager.Search.Filter || '').toBe('')
        disabled.pager.Search.Filter = 'not saved'
        await nextTick()
        expect(storageValues.get(key)).toBe('saved search')
        disabled.app.unmount()
    })

    it('prefers an account search from the URL over a saved search', () =>
    {
        storageValues.set('accountsSearchFilterDefault', 'saved search')
        const accounts = mountAccounts('bookmark')
        expect(accounts.pager.Search.Filter).toBe('bookmark')
        accounts.app.unmount()
    })
})
