// Global directive, registered in createVueApp.js (app.directive('container-width', vContainerWidth))
// Usage:  <div v-container-width class="@container"> ... </div>
// Or conditionally:  <div v-container-width="isHidden" class="@container"> ... </div>
// Shows a capsule (like BreakPoints.vue) in the upper right corner of the element,
// but reports the element's own Tailwind @container tier instead of the window breakpoint.
// Click the capsule to toggle between the element's current width in px and its @container tier.
// The bound value (if any) is treated as a "hidden" flag, letting the capsule be toggled reactively.

// Matches tailwind.config.js `theme.containers` plus @tailwindcss/container-queries defaults
const CONTAINER_TIERS =
[
	{ name: '2xs', minWidth: 256  },
	{ name: 'xs',  minWidth: 320  },
	{ name: 'sm',  minWidth: 384  },
	{ name: 'md',  minWidth: 448  },
	{ name: 'lg',  minWidth: 512  },
	{ name: 'xl',  minWidth: 576  },
	{ name: '2xl', minWidth: 672  },
	{ name: '3xl', minWidth: 768  },
	{ name: '4xl', minWidth: 896  },
	{ name: '5xl', minWidth: 1024 },
	{ name: '6xl', minWidth: 1152 },
	{ name: '7xl', minWidth: 1280 },
]

const CAPSULE_CLASS = 'absolute top-2 right-2 z-50 px-2 pt-[3px] pb-[2px] bg-yellow-300 text-red ' +
					  'rounded-full text-center text-xs font-bold select-none cursor-pointer leading-tight'

function getTier(width)
{
	return [...CONTAINER_TIERS].reverse().find(tier => width >= tier.minWidth) ?? null
}

function setup(el)
{
	const capsule = document.createElement('div')
	capsule.className = CAPSULE_CLASS

	let showTier = false

	const render = () =>
	{
		const width = el.clientWidth
		const tier = getTier(width)

		capsule.textContent = `${width}px`
		capsule.title = tier ? `${tier.minWidth}px+` : `<${CONTAINER_TIERS[0].minWidth}px`

		if (showTier)
			capsule.textContent = tier ? `@${tier.name} ${capsule.textContent}` : `-- ${capsule.textContent}`
	}

	capsule.addEventListener('click', () =>
	{
		showTier = !showTier
		render()
	})

	if (getComputedStyle(el).position === 'static')
		el.style.position = 'relative'

	el.appendChild(capsule)

	const observer = new ResizeObserver(render)
	observer.observe(el)
	render()

	el.__containerWidth = { observer, capsule }
}

function teardown(el)
{
	const state = el.__containerWidth
	if (!state) return

	state.observer.disconnect()
	state.capsule.remove()

	delete el.__containerWidth
}

export const vContainerWidth =
{
	mounted(el, binding)
	{
		if (!binding.value)
			setup(el)
	},

	updated(el, binding)
	{
		if (binding.value === binding.oldValue) return

		if (binding.value)
			teardown(el)
		else
			setup(el)
	},

	unmounted: teardown,
}
