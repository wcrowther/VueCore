/**
 * Shared placement helpers for anchored dropdowns rendered with fixed positioning.
 *
 * @param {Object} options
 * @param {number} [options.gap=4]
 * Vertical spacing in pixels between the trigger element and the dropdown. This same gap is used whether the menu opens upward or downward.
 * @param {number} [options.viewportPadding=8]
 * Minimum distance in pixels to keep between the dropdown and the viewport edges (top, bottom, and left/right clamping calculations).
 */
export function useDropdownPlacement({ gap = 4, viewportPadding = 8 } = {})
{
	const hasExplicitMaxHeight = value => value !== null && value !== undefined && value !== ''

	const resolveVerticalPlacement = ({ triggerRect, naturalMenuHeight = 0, explicitMaxHeight = null }) =>
	{
		const safeMenuHeight = Math.max(0, naturalMenuHeight)
		const spaceBelow 	 = Math.max(0, window.innerHeight - triggerRect.bottom - viewportPadding - gap)
		const spaceAbove 	 = Math.max(0, triggerRect.top - viewportPadding - gap)

		const shouldOpenUpward = safeMenuHeight > 0 && spaceBelow < safeMenuHeight && spaceAbove > spaceBelow

		let resolvedMaxHeight = null
		if (hasExplicitMaxHeight(explicitMaxHeight))
		{
			resolvedMaxHeight = explicitMaxHeight
		}
		else
		{
			const availableOnChosenSide = shouldOpenUpward ? spaceAbove : spaceBelow
			resolvedMaxHeight = safeMenuHeight > availableOnChosenSide
				? Math.floor(availableOnChosenSide)
				: null
		}
		return { spaceAbove, spaceBelow, shouldOpenUpward, resolvedMaxHeight }
	}

	const resolveTop = ({ triggerRect, shouldOpenUpward, renderedMenuHeight = 0 }) =>
	{
		const safeRenderedHeight = Math.max(0, renderedMenuHeight)

		if (shouldOpenUpward)
			return Math.max(viewportPadding, triggerRect.top - safeRenderedHeight - gap)

		return Math.min(window.innerHeight - viewportPadding, triggerRect.bottom + gap)
	}

	return { resolveVerticalPlacement, resolveTop }
}