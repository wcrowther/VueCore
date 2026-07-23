const TOOLTIP_OFFSET = 8

export default 
{
	install() 
	{
		let tooltip = null
		let activeElement = null

		function removeTooltip() 
		{
			if (tooltip) 
			{
				tooltip.remove()
				tooltip = null
			}
		}

		function createTooltip(text) 
		{
			removeTooltip()

			tooltip = document.createElement('div')
			tooltip.className = 'fixed z-[99999] px-2 py-1 text-xs text-white bg-orange rounded shadow ' +
								'pointer-events-none whitespace-nowrap opacity-0 transition-opacity duration-150'
			tooltip.textContent = text

			const arrow = document.createElement('div')
			arrow.className = 'absolute z-[-1] h-2 w-2 rotate-45 bg-orange-500'
			tooltip.appendChild(arrow)
  			tooltip.arrowElement = arrow

			document.body.appendChild(tooltip)

			return tooltip
		}

		function positionTooltip(el) 
		{
			if (!tooltip || !el) return

			const rect = el.getBoundingClientRect()

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

		function showTooltip(el) 
		{
			const text = el.dataset.tooltipText || el.getAttribute('title')

			if (!text)	return
			activeElement = el

			// Disable native browser tooltip
			if (!el.dataset.tooltipText) 
			{
				el.dataset.tooltipText = text
				el.setAttribute('aria-label', text)
				el.removeAttribute('title')
			}

			createTooltip(text)
			positionTooltip(el)

			requestAnimationFrame(() => {tooltip?.classList.remove('opacity-0')})
		}

		function hideTooltip() 
		{
			removeTooltip()
			activeElement = null
		}

		function handleEnter(event) 
		{
			const el = findTooltipElement(event.target)

			if (!el || el === activeElement) return
			showTooltip(el)
		}

		function handleLeave(event) {
			if (!activeElement)
				return

			if (
				activeElement.contains(
					event.relatedTarget,
				)
			) {
				return
			}

			hideTooltip()
		}

		function handleFocus(event) 
		{
			const el =	event.target.closest('[title]') || event.target.closest('[data-tooltip-text]')

			if (!el)return
			showTooltip(el)
		}

		function handleBlur(event) {
			const el =	event.target.closest('[data-tooltip-text]')

			if (!el) return
			hideTooltip()
		}

		function handleReposition() 
		{
			if (!activeElement || !tooltip)	return
			positionTooltip(activeElement)
		}

		function findTooltipElement(target) {
			return target?.closest(
				'[title],[data-tooltip-text]',
			)
		}

		document.addEventListener('mouseover', handleEnter)

		document.addEventListener('mouseout', handleLeave)

		document.addEventListener('focusin', handleFocus)

		document.addEventListener('focusout', handleBlur)

		window.addEventListener('scroll', handleReposition,	true)

		window.addEventListener('resize', handleReposition)
	}
}