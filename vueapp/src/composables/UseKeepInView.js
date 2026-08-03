// Keeps a draggable element from being fully lost past a viewport edge. While enabled,
// snaps the element's x/y back so RevealPx of it stays visible whenever it ends up
// fully hidden past the left/right/top/bottom edge of the viewport.
//
// By default assumes x/y are document-relative coordinates (e.g. `position: absolute` with no
// positioned ancestor, which scrolls with the page) - the current scroll offset is subtracted
// before comparing against the (viewport-relative) window size, and added back when correcting.
// Pass `fixed: true` for elements using `position: fixed`, whose x/y are already viewport-relative,
// to skip the scroll-offset adjustment.

import { useWindowScroll } from '@vueuse/core'

/**
 * @param {Object} options
 * @param {import('vue').Ref} options.el      Template ref of the draggable element.
 * @param {import('vue').Ref<number>} options.x    Ref holding the element's left position (px).
 * @param {import('vue').Ref<number>} options.y    Ref holding the element's top position (px).
 * @param {import('vue').Ref<boolean>|boolean} [options.enabled=true] Turns the behavior on/off.
 * @param {import('vue').Ref<boolean>|boolean} [options.fixed=false] True if el uses `position: fixed`
 * (viewport-relative x/y) rather than the default `position: absolute` (document-relative x/y).
 * @param {number} [options.RevealPx=40] Minimum pixels of the element to keep visible.
 */
export function useKeepInView({ el, x, y, enabled = true, fixed = false, RevealPx = 20 })
{
	const { width: vw, height: vh }   = useWindowSize({ includeScrollbar: false })
	const { x: scrollX, y: scrollY }  = useWindowScroll()

	watchEffect(() =>
	{
		if (!unref(enabled) || !el.value) return

		const w    = el.value.offsetWidth
		const h    = el.value.offsetHeight
		const offX = unref(fixed) ? 0 : scrollX.value
		const offY = unref(fixed) ? 0 : scrollY.value
		const left = x.value - offX
		const top  = y.value - offY

		if      (left + w <= 0)    x.value = offX + RevealPx - w
		else if (left >= vw.value) x.value = offX + vw.value - RevealPx

		if      (top + h <= 0)     y.value = offY + RevealPx - h
		else if (top >= vh.value)  y.value = offY + vh.value - RevealPx
	})
}
