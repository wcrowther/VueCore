
// Uses Composition Api-style syntax

import { sampleCalendarEvents }  from '@/datalists/sampleCalendarEvents.js'

export const useCalendarStore = defineStore('CalendarStore', () => 
{
    // State ------------------------------------------------------------------

    const events = ref(getNormalizedData)

    // Getters ------------------------------------------------------------------

    const eventsByDate = (date) => events.value.filter (e => e.date === dateISO(date))

    // Actions ------------------------------------------------------------------


    // Return ------------------------------------------------------------------

    return {
        events,
        eventsByDate
    }
})

const normalizeDataToCurrentMonth = (events) => 
{
    if (!events.length) return events;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return events.map(event => 
    {
        const day           = parseInt(event.date.split('-')[2], 10);
        const clampedDay    = Math.min(day, daysInMonth);
        const year          = now.getFullYear();
        const month         = String(now.getMonth() + 1).padStart(2, '0');
        const normalizedDay = String(clampedDay).padStart(2, '0');
    
        return new EventModel(event.id, `${year}-${month}-${normalizedDay}`, event.time, event.title);
    });
}

const getNormalizedData = normalizeDataToCurrentMonth(sampleCalendarEvents)

