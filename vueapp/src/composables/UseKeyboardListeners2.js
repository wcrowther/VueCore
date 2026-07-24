export function KeyboardListeners2(bindings, disabled = false, options = {})
{
	const isDisabled = typeof disabled === 'function'
						? computed(disabled)
						: (isRef(disabled) ? disabled : ref(disabled))

	const isMac = () =>
	{
		if (typeof options.isMac === 'function')
			return !!options.isMac()

		return !!options.isMac
	}

	const parseCombo = (combo, index) =>
	{
		const parts = String(combo)
						.split('+')
						.map(part => part.trim())
						.filter(Boolean)

		const rule =
		{
			index,
			code: null,
			requiresCtrl: false,
			requiresShift: false,
			requiresAlt: false,
			requiresMeta: false,
			specificity: 0
		}

		for (const token of parts)
		{
			if (token === 'Ctrl')
			{
				rule.requiresCtrl = true
				rule.specificity += 1
				continue
			}

			if (token === 'Shift')
			{
				rule.requiresShift = true
				rule.specificity += 1
				continue
			}

			if (token === 'Alt')
			{
				rule.requiresAlt = true
				rule.specificity += 1
				continue
			}

			if (token === 'Meta')
			{
				rule.requiresMeta = true
				rule.specificity += 1
				continue
			}

			rule.code = token
		}

		return rule
	}

	const getCtrlPressed = (e) => isMac() ? e.metaKey : e.ctrlKey

	const isMatch = (e, rule) =>
	{
		if (!rule.code || e.code !== rule.code) 		return false
		if (rule.requiresCtrl && !getCtrlPressed(e)) 	return false
		if (rule.requiresShift && !e.shiftKey) 			return false
		if (rule.requiresAlt && !e.altKey) 				return false
		if (rule.requiresMeta && !e.metaKey) 			return false

		return true
	}

	const rules = Object.entries(bindings ?? {})
		.map(([combo, run], index) => ({ rule: parseCombo(combo, index), run }))
		.filter(item => item.rule.code && typeof item.run === 'function')
		.sort((a, b) =>
		{
			if (b.rule.specificity !== a.rule.specificity)
				return b.rule.specificity - a.rule.specificity

			return a.rule.index - b.rule.index
		})

	const onKeyDown = (e) =>
	{
		for (const item of rules)
		{
			if (!isMatch(e, item.rule))
				continue

			e.preventDefault()
			item.run(e)
			return
		}
	}

	let isAttached = false

	const addKeyListeners = () =>
	{
		if (isAttached) return

		document.addEventListener('keydown', onKeyDown, false)
		isAttached = true
	}

	const removeKeyListeners = () =>
	{
		if (!isAttached) return

		document.removeEventListener('keydown', onKeyDown, false)
		isAttached = false
	}

	onMounted(() => { if (!isDisabled.value) addKeyListeners() })
	onUnmounted(() => { removeKeyListeners() })

	watch(isDisabled, (newVal, oldVal) =>
	{
		if (newVal === oldVal) return
		newVal ? removeKeyListeners() : addKeyListeners()
	})
}