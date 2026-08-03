// Can be installed in createVueApp.js so is it globally available as v-tooltip
// Not used in favor of sdfsdf but is a good directive example

const TOOLTIP_OFFSET = 8

function createTooltip(text) 
{
	const tooltip = document.createElement('div')

	tooltip.className = 'fixed z-[99999] px-2 py-1 text-xs text-white bg-orange rounded shadow pointer-events-none'

	tooltip.textContent = text
	document.body.appendChild(tooltip)

	return tooltip
}

function positionTooltip(el, tooltip, position) 
{
	const rect = el.getBoundingClientRect()

	const tooltipWidth = tooltip.offsetWidth
	const tooltipHeight = tooltip.offsetHeight

	let finalPosition = position

	if (position === 'auto') 
	{
		const roomAbove = rect.top
		const roomBelow = window.innerHeight - rect.bottom

		finalPosition =	roomBelow >= tooltipHeight + TOOLTIP_OFFSET
							? 'bottom' : roomAbove >= tooltipHeight + TOOLTIP_OFFSET
							? 'top': 'bottom'
	}

	let left = rect.left + rect.width / 2 - tooltipWidth / 2

	const top = finalPosition === 'top'	
				? rect.top - tooltipHeight - TOOLTIP_OFFSET
				: rect.bottom + TOOLTIP_OFFSET

	const margin = 8

	left = Math.max
	(
		margin,
		Math.min(left, window.innerWidth - tooltipWidth - margin)
	)

	tooltip.style.left = `${left}px`
	tooltip.style.top = `${top}px`
}

function getOptions(el, binding) 
{
	const defaults = 
	{
		text: '',
		position: 'auto',
		delay: 300,
	}

	// v-tooltip="'Save changes'"
	if (typeof binding.value === 'string') 
	{
		return {
			...defaults,
			text: binding.value,
		}
	}

	// v-tooltip="{ text:'...', position:'top' }"
	if (binding.value &&
		typeof binding.value === 'object') 
	{
		return {
			...defaults,
			...binding.value,
			text:
				binding.value.text ??
				el.dataset.tooltip ??
				'',
		}
	}

	// v-tooltip title="Save changes"
	return {
		...defaults,
		text: el.dataset.tooltip ?? '',
	}
}

export const tooltipDirective = 
{
	mounted(el, binding) 
	{
		// Capture title and disable native tooltip
		const title = el.getAttribute('title')

		if (title) 
		{
			el.dataset.tooltip = title
			el.setAttribute('aria-label', title)
			el.removeAttribute('title')
		}

		let tooltip = null
		let timer = null

		const show = () => 
		{
			const options = getOptions(el, binding)

			if (!options.text)
				return

			tooltip = createTooltip(options.text)

			positionTooltip
			(
				el,
				tooltip,
				options.position,
			)

			requestAnimationFrame(() => 
			{
				tooltip.style.opacity = '1'
			})
		}

		const hide = () => 
		{
			clearTimeout(timer)
			if (!tooltip) return
			tooltip.remove()
			tooltip = null
		}

		const mouseEnter = () => 
		{
			const options = getOptions(el, binding)
			timer = setTimeout(
				show,
				options.delay,
			)
		}

		const mouseLeave = () => { hide() }

		el.__tooltipHandlers = {mouseEnter, mouseLeave}
		el.addEventListener('mouseenter', mouseEnter)
		el.addEventListener('mouseleave', mouseLeave)
	},

	unmounted(el) 
	{
		const handlers = el.__tooltipHandlers
		if (!handlers) return

		el.removeEventListener('mouseenter', handlers.mouseEnter)
		el.removeEventListener('mouseleave', handlers.mouseLeave)
	},
}