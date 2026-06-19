export function useNormalizedTabList(tabList, tabFieldName)
{
    return computed(() =>
    {
        const list 		= toValue(tabList)
        const fieldName = toValue(tabFieldName)

        if (Array.isArray(list))
        {
            const isLookupList = list.length > 0 && list.every
			(
                tab => tab && typeof tab === 'object' && 'key' in tab && 'value' in tab
            )

            if (isLookupList)
            {
                const lookupFieldName = fieldName === 'key' || fieldName === 'value' ? fieldName : 'value'

                return list
                    .map(tab =>
                    {
                        const key = tab?.key
                        const labelValue = tab?.[lookupFieldName]

                        if (key === undefined || key === null || labelValue === undefined || labelValue === null)
                            return null

                        return { id: key, label: String(labelValue), slotName: String(key) }
                    })
                    .filter(Boolean)
            }

            const isPrimitiveList = list.every
			(
                tab => typeof tab === 'string' || typeof tab === 'number'
            )

            if (isPrimitiveList)
            {
                return list
                    .map(tab => ({ id: tab, label: String(tab), slotName: String(tab) }))
            }

            if (!fieldName)
            {
                console.warn('[TabsControl] tabFieldName is required when tabList contains objects.')
                return []
            }

            return list
                .map(tab => tab?.[fieldName])
                .filter(value => value !== undefined && value !== null)
                .map(value => ({ id: value, label: String(value), slotName: String(value) }))
        }

        if (list && typeof list === 'object')
        {
            const lookupFieldName = fieldName === 'key' || fieldName === 'value' ? fieldName : 'value'

            return Object.entries(list)
                		 .map(([key, value]) =>
                		 {
                		     const labelValue = lookupFieldName === 'key' ? key : value
                		     return { id: key, label: String(labelValue), slotName: key }
                		 })
        }

        return []
    })
}

/* Usage:

const normalized1 = useNormalizedTabList(() => ['First', 'Second'], () => '')
// => First, Second

const lookupTabs = [{ key: 'a', value: 'Apples' }, { key: 'b', value: 'Bananas' }]
const normalized2 = useNormalizedTabList(() => lookupTabs, () => '')
// => defaults to value: Apples, Bananas

const normalized3 = useNormalizedTabList(() => lookupTabs, () => 'key')
// => uses key: a, b

const objectTabs = [{ title: 'Alpha' }, { title: 'Beta' }]
const normalized4 = useNormalizedTabList(() => objectTabs, () => 'title')
// => uses title: Alpha, Beta

*/
