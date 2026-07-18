export function useFieldFromList(listSource, fieldSource = undefined)
{
    return computed(() =>
    {
        const list = toValue(listSource)
        const selectedField = toValue(fieldSource)
        const toItem = (id, label) => ({ id, label: String(label), slotName: String(id) })

        if (Array.isArray(list))
        {
            if (!list.length) return []

            const isPrimitiveList = list.every(item => typeof item === 'string' || typeof item === 'number')
            if (isPrimitiveList) 
				return list.map(item => toItem(item, item))

            const isObjectList = list.every(item => item && typeof item === 'object' && !Array.isArray(item))
            if (!isObjectList) 
				return []

            const firstItem = list.find(item => item && typeof item === 'object')
            const fallbackField = firstItem ? Object.keys(firstItem)[0] : undefined
            const fieldName = selectedField || fallbackField

            if (!fieldName) 
				return []

            return list
                .map(item =>
                {
                    const value = item?.[fieldName]
                    if (isEmpty(value)) return null

                    return toItem(value, value)
                })
                .filter(Boolean)
        }

        if (list && typeof list === 'object')
        {
            return Object.entries(list)
                .map(([key, value]) =>
                {
                    const label = selectedField === 'key' ? key : value
                    return toItem(key, label)
                })
        }

        return []
    })
}

/* Usage:

const normalized1 = useFieldFromList(() => ['First', 'Second'])
// => First, Second

const lookupTabs = [{ key: 'a', value: 'Apples' }, { key: 'b', value: 'Bananas' }]
const normalized2 = useFieldFromList(() => lookupTabs)
// => defaults to first field: a, b

const normalized3 = useFieldFromList(() => lookupTabs, () => 'value')
// => uses value: Apples, Bananas

const objectTabs = [{ title: 'Alpha' }, { title: 'Beta' }]
const normalized4 = useFieldFromList(() => objectTabs)
// => uses first field: Alpha, Beta

*/
