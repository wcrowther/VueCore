<script setup>

    const { createConfirm } = useConfirmControl()

    const selectedDate      = ref(null)
    const editingEventId    = ref(null)
    const nextEventId       = ref(1)

    onMounted(() => console.log('Calendar Example Mounted'))

    const events = ref(
        [
            new EventModel(1, '2026-03-01', '08:00', 'Standup'),
            new EventModel(2, '2026-03-28', '11:30', 'Standup 2'),
            new EventModel(3, '2026-03-05', '10:00', 'Design Review'),
            new EventModel(4, '2026-03-05', '16:45', 'Followup Meeting'),
            new EventModel(5, '2026-03-13', '20:00', 'Release')
        ])

    const eventsByDate = (date) => 
    {
        let days =  events.value.filter (e => e.date === dateISO(date))
        // console.log(`eventsByDate ${dateISO(date)}`, days)
        return days
    }

    const onDragStart = (e, event) => 
    {
        e.dataTransfer.setData('event-id', event.id)
        e.dataTransfer.effectAllowed = 'move'
    }

    const onDropEvent = ({ eventId, date }) => 
    {
        const event = events.value.find(e => e.id == eventId)
        if (!event) return

        event.date = date.toISOString().slice(0, 10)
    }

    const dateInMonth = computed(() => new Date() )

    watch(events, (arr) => 
    {
        const max = arr.length ? Math.max(...arr.map(e => e.id)) : 0
        nextEventId.value = max + 1
    }, 
    { immediate: true, deep: true })

    const addEvent = (date) => 
    {
        events.value.push(new EventModel(nextEventId.value, date.toISOString().slice(0, 10), '00:00', ''))
        editingEventId.value = nextEventId.value
    }

    const deleteEvent = async (eventId) => 
    {
        console.log('Delete:', eventId)
        
        const confirmed = await createConfirm('Delete this event?')
        if(!confirmed) return
         
        const index = events.value.findIndex(e => e.id === eventId)
        if (index !== -1) 
        {
            events.value.splice(index, 1)
        }
    }

    const selectDay = (date, eventId) => 
    { 
        if (eventId) 
        {   // From event click: date is event.date (string), eventId is number
            selectedDate.value = new Date(date)
            editingEventId.value = eventId
        } 
        else 
        {   // From day click: date is Date object, eventId is null
            selectedDate.value = date
            editingEventId.value = null
        }
    }

    const dayEvents = computed(() => selectedDate.value ? eventsByDate(selectedDate.value) : null)

</script>

<template>

    <div class="font-bold mb-3">Calendar Control</div>

    <div class="mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident 
        dolor ullam voluptas error esse necessitatibus quis deleniti nesciunt? 
        Illum officia corporis dignissimos nam consequatur!
    </div>

    <CalendarControl :dateInMonth @drop="onDropEvent" class="border border-gray mb-10">

        <!-- Calendar header -->
        <template #title="{monthYear, timeZone, prevMonth, nextMonth, toToday}">

        	<div class="flex justify-between items-center bg-color-light-blue p-5">
                <button @click="prevMonth" class="text-blue">◀</button>
                <button @click="toToday" class="border border-blue-400 px-3 py-[2px] rounded-full">Today</button>
                <div class="text-lg text-center font-bold w-1/5">
                    {{ monthYear }} 
                </div>
                <div class="text-center text-xs text-gray-500">
                    <div>Timezone:</div>
                    <div>{{ timeZone }}</div>
                </div>
                <button @click="nextMonth" class="text-blue">▶</button>           
			</div>

        </template>
        
        <!-- Template for single day -->
        <template #default="{ date }">

            <!-- Day number -->
            <div class="text-sm font-bold mb-1 select-none hover:opacity-50 z-50"
                @click="selectDay(date, null)">
                {{ date.getDate() }}
            </div>

            <!-- Events -->
            <div class="space-y-1">
                <template v-for="event in eventsByDate(date)" :key="event.id" >
                    <CalendarEvent :event 
                        @select="(d) => selectDay(d.date, d.eventId)" 
                        @dragstart="onDragStart" @delete="deleteEvent" />          
                </template>
            </div>

        </template>

    </CalendarControl>

    <CalendarDayModal v-if="selectedDate"
        v-model:calendarDate="selectedDate"
        v-model:dayEvents="dayEvents"
        v-model:editingEventId="editingEventId"
        @add="addEvent" />

</template>