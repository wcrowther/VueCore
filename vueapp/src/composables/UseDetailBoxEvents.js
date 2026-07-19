import { useEventBus } from '@vueuse/core'

const detailBoxEventBus = useEventBus('detail-box-events')
const normalizeGroup = (group) => typeof group === 'string' ? group : ''

export const emitDetailBoxEvent 		= (item) => detailBoxEventBus.emit(item)
export const openAllDetailBoxes 		= (group = '') => emitDetailBoxEvent({ group: normalizeGroup(group), action: 'open-all' })
export const closeAllDetailBoxes 		= (group = '') => emitDetailBoxEvent({ group: normalizeGroup(group), action: 'close-all' })
export const toggleAllDetailBoxes 		= (group = '') => emitDetailBoxEvent({ group: normalizeGroup(group), action: 'toggle-all' })
export const useDetailBoxEventListener  = (listener) => detailBoxEventBus.on(listener)