import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as Vue from 'vue'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import SideDrawerControl from '../components/controls/SideDrawerControl.vue'
import drawerSource from '../components/controls/SideDrawerControl.vue?raw'
import LineHandle from '../components/controls/LineHandle.vue'
import handleSource from '../components/controls/LineHandle.vue?raw'

const storageValues = vi.hoisted(() => new Map())

vi.mock('@vueuse/core', async (importOriginal) =>
{
	const original = await importOriginal()
	const { ref } = await import('vue')
	const storage = {
		getItem: (key) => storageValues.get(key) ?? null,
		setItem: (key, value) => storageValues.set(key, value),
		removeItem: (key) => storageValues.delete(key),
	}
	return {
		...original,
		useElementSize: () => ({ width: ref(800) }),
		useLocalStorage: (key, value, options) => original.useStorage(key, value, storage, options),
	}
})

function installRender(component, source, filename)
{
	const { descriptor } = parse(source, { filename })
	const script = compileScript(descriptor, { id: filename })
	const template = compileTemplate({
		source: descriptor.template.content, filename, id: filename,
		compilerOptions: { mode: 'function', prefixIdentifiers: true, bindingMetadata: script.bindings }
	})
	if (template.errors.length) throw template.errors[0]
	component.render = new Function('Vue', template.code)(Vue)
}

installRender(SideDrawerControl, drawerSource, 'SideDrawerControl.vue')
installRender(LineHandle, handleSource, 'LineHandle.vue')

const renderer = Vue.createRenderer({
	createElement: (type) => ({
		type, props: {}, children: [],
		getBoundingClientRect: () => ({ width: 300 }),
		getClientRects: () => [{}],
		setPointerCapture: vi.fn(),
		hasPointerCapture: () => true,
		releasePointerCapture: vi.fn()
	}),
	createText: (text) => ({ text }),
	createComment: (text) => ({ text }),
	setText: (node, text) => { node.text = text },
	setElementText: (node, text) => { node.text = text },
	parentNode: (node) => node.parent,
	nextSibling: (node) => node.parent.children[node.parent.children.indexOf(node) + 1] || null,
	insert: (node, parent, anchor) =>
	{
		node.parent = parent
		const index = anchor ? parent.children.indexOf(anchor) : -1
		parent.children.splice(index < 0 ? parent.children.length : index, 0, node)
	},
	remove: (node) => { node.parent.children.splice(node.parent.children.indexOf(node), 1) },
	patchProp: (node, key, previous, value) => { node.props[key] = value }
})

function find(node, predicate)
{
	if (predicate(node)) return node
	for (const child of node.children || [])
	{
		const result = find(child, predicate)
		if (result) return result
	}
}

function mountDrawer(initialProps = {})
{
	const props = Vue.ref({ id: 'testDrawer', hideToggleButton: true, ...initialProps })
	const root = { children: [] }
	const app = renderer.createApp({ render: () => Vue.h(SideDrawerControl, props.value) })
	app.provide(Vue.ssrContextKey, {})
	app.component('LineHandle', LineHandle)
	app.component('CircleButton', {})
	app.mount(root)
	const handle = () => find(root, node => node.props?.onPointerdown)
	const drawer = () => handle()?.parent
	return { app, props, handle, drawer }
}

function pointer(handle, x, pointerId = 1)
{
	return { clientX: x, pointerId, pointerType: 'mouse', button: 0, currentTarget: handle, preventDefault: vi.fn() }
}

function mountHandle(props = {})
{
	const root = { children: [] }
	const app = renderer.createApp({ render: () => Vue.h(LineHandle, props) })
	app.provide(Vue.ssrContextKey, {})
	app.mount(root)
	return { app, handle: find(root, node => node.props?.onPointerdown) }
}

describe('SideDrawerControl resizing', () =>
{
	beforeEach(() =>
	{
		vi.useFakeTimers()
		vi.stubGlobal('window', new EventTarget())
	})

	afterEach(() =>
	{
		storageValues.clear()
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	it('only renders the handle when resizing is enabled and the drawer is open', async () =>
	{
		const drawer = mountDrawer()
		expect(drawer.handle()).toBeUndefined()
		drawer.props.value = { ...drawer.props.value, resize: true }
		await Vue.nextTick()
		expect(drawer.handle()).toBeDefined()
		drawer.props.value = { ...drawer.props.value, drawerHidden: true }
		await Vue.nextTick()
		expect(drawer.handle()).toBeUndefined()
		drawer.app.unmount()
	})

	it('requires continuous hover before dragging and stops on pointer cancellation', async () =>
	{
		const drawer = mountDrawer({ resize: true })
		const handle = drawer.handle()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(199)
		handle.props.onPointerdown(pointer(handle, 300))
		handle.props.onPointermove(pointer(handle, 400))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(300px, calc(100% - 48px))')

		handle.props.onMouseleave()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(200)
		handle.props.onPointerdown(pointer(handle, 300))
		handle.props.onPointermove(pointer(handle, 400))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(400px, calc(100% - 48px))')
		handle.props.onPointercancel(pointer(handle, 400))
		expect(handle.releasePointerCapture).toHaveBeenCalledWith(1)
		handle.props.onPointermove(pointer(handle, 500))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(400px, calc(100% - 48px))')
		drawer.app.unmount()
	})

	it('reverses the direction for a right-side drawer and limits both panes', async () =>
	{
		const drawer = mountDrawer({ resize: true, flipSide: true })
		const handle = drawer.handle()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(200)
		handle.props.onPointerdown(pointer(handle, 500))
		handle.props.onPointermove(pointer(handle, 0))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(752px, calc(100% - 48px))')
		handle.props.onPointermove(pointer(handle, 1000))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(48px, calc(100% - 48px))')
		drawer.app.unmount()
	})

	it('cancels the drag if resizing is disabled while active', async () =>
	{
		const drawer = mountDrawer({ resize: true })
		const handle = drawer.handle()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(200)
		handle.props.onPointerdown(pointer(handle, 300))
		drawer.props.value = { ...drawer.props.value, resize: false }
		await Vue.nextTick()
		expect(drawer.handle()).toBeUndefined()
		expect(handle.releasePointerCapture).toHaveBeenCalledWith(1)
		handle.props.onPointermove(pointer(handle, 500))
		expect(drawer.handle()).toBeUndefined()
		drawer.app.unmount()
	})

	it('uses minWidth for the minimum of each pane', async () =>
	{
		const drawer = mountDrawer({ resize: true, minWidth: 120 })
		const handle = drawer.handle()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(200)
		handle.props.onPointerdown(pointer(handle, 300))
		handle.props.onPointermove(pointer(handle, 0))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(120px, calc(100% - 120px))')
		drawer.props.value = { ...drawer.props.value, minWidth: 200 }
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(200px, calc(100% - 200px))')
		drawer.props.value = { ...drawer.props.value, minWidth: 120 }
		await Vue.nextTick()
		handle.props.onPointermove(pointer(handle, 1000))
		await Vue.nextTick()
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(680px, calc(100% - 120px))')
		drawer.app.unmount()
	})

	it('persists and restores the resized width by drawer id', async () =>
	{
		const drawer = mountDrawer({ id: 'persistentDrawer', resize: true })
		const handle = drawer.handle()
		handle.props.onMouseenter()
		vi.advanceTimersByTime(200)
		handle.props.onPointerdown(pointer(handle, 300))
		handle.props.onPointermove(pointer(handle, 420))
		await Vue.nextTick()
		expect(storageValues.get('persistentDrawer.drawerWidth')).toBe('420')
		drawer.app.unmount()

		const restored = mountDrawer({ id: 'persistentDrawer', resize: true, initialWidth: 250 })
		expect(restored.drawer().props.style['--side-drawer-width']).toBe('min(420px, calc(100% - 48px))')
		const other = mountDrawer({ id: 'otherDrawer', resize: true })
		expect(other.drawer().props.style['--side-drawer-width']).toBe('min(300px, calc(100% - 48px))')
		restored.app.unmount()
		other.app.unmount()
	})

	it('uses initialWidth for a drawer without a saved width', () =>
	{
		const drawer = mountDrawer({ id: 'customDrawer', resize: true, initialWidth: 240 })
		expect(drawer.drawer().props.style['--side-drawer-width']).toBe('min(240px, calc(100% - 48px))')
		expect(storageValues.get('customDrawer.drawerWidth')).toBe('240')
		drawer.app.unmount()
	})
})

describe('LineHandle appearance and delay', () =>
{
	beforeEach(() =>
	{
		vi.useFakeTimers()
		vi.stubGlobal('window', new EventTarget())
	})

	afterEach(() =>
	{
		vi.unstubAllGlobals()
		vi.useRealTimers()
	})

	it('uses an 8px gray handle and activates immediately by default', async () =>
	{
		const { app, handle } = mountHandle()
		expect(handle.props.style.width).toBe('8px')
		expect(handle.props.class).not.toContain('bg-gray/20')
		handle.props.onMouseenter()
		handle.props.onPointerdown(pointer(handle, 100))
		await Vue.nextTick()
		expect(handle.props.class).toContain('bg-gray/20')
		expect(handle.setPointerCapture).toHaveBeenCalledWith(1)
		app.unmount()
	})

	it('uses the supplied width, color and hover delay', async () =>
	{
		const { app, handle } = mountHandle({ width: 12, delay: 350, color: 'bg-blue-500' })
		expect(handle.props.style.width).toBe('12px')
		handle.props.onMouseenter()
		vi.advanceTimersByTime(349)
		handle.props.onPointerdown(pointer(handle, 100))
		await Vue.nextTick()
		expect(handle.props.class).not.toContain('bg-blue-500')
		expect(handle.setPointerCapture).not.toHaveBeenCalled()
		vi.advanceTimersByTime(1)
		await Vue.nextTick()
		expect(handle.props.class).toContain('bg-blue-500')
		handle.props.onPointerdown(pointer(handle, 100))
		expect(handle.setPointerCapture).toHaveBeenCalledWith(1)
		app.unmount()
	})
})
