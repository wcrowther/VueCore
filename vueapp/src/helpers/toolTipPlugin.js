const TOOLTIP_OFFSET = 8
const TOOLTIP_SHOW_DELAY = 1000

export default 
{
	install() 
	{
		let tooltip = null
		let activeElement = null
		let showTimeout = null

		const removeTooltip = () => 
		{
			if (tooltip) 
			{
				tooltip.remove()
				tooltip = null
			}
		}

		const clearShowTimeout = () => 
		{
			clearTimeout(showTimeout)
			showTimeout = null
		}

		const createTooltip = (text) => 
		{
			removeTooltip()



			tooltip = document.createElement('div')
			tooltip.className = 'fixed z-[99999] px-2 py-1 text-sm text-black bg-[#81caff] rounded shadow tracking-wider ' +
								'pointer-events-none w-max max-w-xs whitespace-normal break-words opacity-0 transition-opacity duration-150 drop-shadow-md'
			tooltip.textContent = text

			const arrow = document.createElement('div')
			arrow.className = 'absolute z-[-1] h-2 w-2 rotate-45 bg-[#81caff] drop-shadow-md'
			tooltip.appendChild(arrow)
  			tooltip.arrowElement = arrow

			document.body.appendChild(tooltip)

			return tooltip
		}

		const positionTooltip = (el) => 
		{
			if (!tooltip || !el) return

			const rect 			= el.getBoundingClientRect()
			const tooltipWidth 	= tooltip.offsetWidth
			const tooltipHeight = tooltip.offsetHeight
			const roomBelow 	= window.innerHeight - rect.bottom
			const position 		= roomBelow >= tooltipHeight + 20 ? 'bottom' : 'top'
			const top 			= position === 'top' ? rect.top - tooltipHeight - TOOLTIP_OFFSET : rect.bottom + TOOLTIP_OFFSET
			let left 			= rect.left + rect.width / 2 - tooltipWidth / 2
			left 				= Math.max(8,Math.min(left, window.innerWidth - tooltipWidth -	8))
			tooltip.style.left 	= `${left}px`
			tooltip.style.top 	= `${top}px`

			const arrow = tooltip.arrowElement
			arrow.style.left = '50%'
			arrow.style.marginLeft = '-4px'

			if (position === 'top') 
			{
				arrow.style.top = ''
				arrow.style.bottom = '-4px'
			} 
			else 
			{
				arrow.style.bottom = ''
				arrow.style.top = '-4px'
			}
		}

		const disableNativeTooltip = (el) => 
		{
			const text = el.dataset.tooltipText || el.getAttribute('title')

			if (!text || el.dataset.tooltipText) return

			el.dataset.tooltipText = text
			el.setAttribute('aria-label', text)
			el.removeAttribute('title')
		}

		const showTooltip = (el) => 
		{
			const text = el.dataset.tooltipText

			if (!text)	return
			activeElement = el

			createTooltip(text)
			positionTooltip(el)

			requestAnimationFrame(() => {tooltip?.classList.remove('opacity-0')})
		}

		const hideTooltip = () => 
		{
			clearShowTimeout()
			removeTooltip()
			activeElement = null
		}

		const scheduleShowTooltip = (el) => 
		{
			disableNativeTooltip(el)
			clearShowTimeout()
			showTimeout = setTimeout(() => showTooltip(el), TOOLTIP_SHOW_DELAY)
		}

		const handleEnter = (event) => 
		{
			const el = findTooltipElement(event.target)

			if (!el || el === activeElement) return
			scheduleShowTooltip(el)
		}

		const handleLeave = (event) => 
		{
			clearShowTimeout()
			if (!activeElement)	return
			if (activeElement.contains(event.relatedTarget)) return
			hideTooltip()
		}

		const handleFocus = (event) => 
		{
			const el = findTooltipElement(event.target)
			if (!el) return
			scheduleShowTooltip(el)
		}

		const handleBlur = (event) => 
		{
			const el = findTooltipElement(event.target)
			if (!el) return
			hideTooltip()
		}

		const handleReposition = () => 
		{
			if (!activeElement || !tooltip)	return
			positionTooltip(activeElement)
		}

		const findTooltipElement = (target) => 
		{
			return target?.closest('[title],[data-tooltip-text]')
		}

		document.addEventListener('mouseover', handleEnter)

		document.addEventListener('mouseout', handleLeave)

		document.addEventListener('focusin', handleFocus)

		document.addEventListener('focusout', handleBlur)

		window.addEventListener('scroll', handleReposition,	true)

		window.addEventListener('resize', handleReposition)
	}
}