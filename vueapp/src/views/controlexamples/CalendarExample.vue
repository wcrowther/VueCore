<script setup>

    const appStore              = useAppStore()   
    const { createConfirm }     = useConfirmControl()
    const { showJsonEntities }  = storeToRefs(appStore)

    const selectedDate      = ref(null)
    const editingEventId    = ref(null)
    const nextEventId       = ref(1)

    // onMounted(() => console.log('Calendar Example Mounted'))

    const dateInMonth = computed(() => new Date() )
    const dayEvents = computed(() => selectedDate.value ? eventsByDate(selectedDate.value) : null)

    const sampleData =   
    [
        new EventModel(1,  '2026-01-01', '08:00', 'Standup'),
        new EventModel(2,  '2026-01-31', '11:30', 'Vacation'),
        new EventModel(3,  '2026-01-05', '10:00', 'Design Review'),
        new EventModel(4,  '2026-01-05', '16:45', 'Followup Meeting'),
        new EventModel(5,  '2026-01-12', '20:00', 'Release'),
        new EventModel(6,  '2026-01-05', '10:00', 'Design Review'),
        new EventModel(7,  '2026-01-13', '16:45', 'Followup Meeting'),
        new EventModel(8,  '2026-01-05', '20:00', 'Release'),
        new EventModel(9,  '2026-01-12', '20:00', 'Standup'),
        new EventModel(10, '2026-01-05', '10:00', 'Design Review'),
        new EventModel(11, '2026-01-13', '16:45', 'Followup Meeting'),
        new EventModel(12, '2026-01-05', '20:00', 'Appointment')
    ]

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

    const normalizedData = normalizeDataToCurrentMonth(sampleData)
    const events = ref(normalizedData)

    const eventsByDate = (date) => events.value.filter (e => e.date === dateISO(date))

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

    const addEvent = (date) => 
    {
        events.value.push(new EventModel(nextEventId.value, date.toISOString().slice(0, 10), '00:00', ''))
        editingEventId.value = nextEventId.value
    }

    const deleteEvent = async (eventId) => 
    {
        console.log(`Delete Event: ${eventId}`)
        
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
        {   
            selectedDate.value = new Date(date)
            editingEventId.value = eventId
        } 
        else 
        {   
            selectedDate.value = date
            editingEventId.value = null
        }
    }

    watch(events, (arr) => 
    {
        const max = arr.length ? Math.max(...arr.map(e => e.id)) : 0
        nextEventId.value = max + 1
    }, 
    { immediate: true, deep: true })

</script>

<template>

    <div class="font-bold mb-5">CalendarGrid Example</div>

    <div class="mb-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident 
        dolor ullam voluptas error esse necessitatibus quis deleniti nesciunt? 
        Illum officia corporis dignissimos nam consequatur!
    </div>

    <JsonTreeControl v-if="showJsonEntities" label="Normalized Data" :json="normalizedData" class="mb-7" />

    <CalendarGrid :dateInMonth @drop="onDropEvent" 
        class="border border-gray mb-10">

        <!-- Calendar header -->
        <template #title="{monthYear, timeZone, prevMonth, nextMonth, toToday}">

        	<div class="flex justify-between items-center bg-blue-200 p-5">
                <button @click="prevMonth" class="text-blue select-none">◀</button>
                <button @click="toToday" class="border border-blue-400 px-3 py-[2px] rounded-full">Today</button>
                <div class="text-lg text-center font-bold w-1/5">
                    {{ monthYear }} 
                </div>
                <div class="text-center text-xs text-gray-500">
                    <div>Timezone:</div>
                    <div>{{ timeZone }}</div>
                </div>
                <button @click="nextMonth" class="text-blue select-none">▶</button>           
			</div>
        </template>
        
        <!-- Template for single day -->
        <template #default="{ date }">

            <div @click.stop="selectDay(date, null)" class="w-full h-full p-2">
                <!-- Day number -->
                <div class="text-sm font-bold mb-1 select-none hover:opacity-50 z-50">
                    {{ date.getDate() }}
                </div>
                <!-- Events -->
                <div class="space-y-1">
                    <template v-for="event in eventsByDate(date)" :key="event.id" >
                        <CalendarEvent :event
                            @select="(d) => selectDay(d.date, d.eventId)"
                            @dragstart="onDragStart" @deleteEvent="deleteEvent" />
                    </template>
                </div>
            </div>

        </template>

    </CalendarGrid>

    <CalendarDayModal v-if="selectedDate"
        v-model:calendarDate="selectedDate"
        v-model:dayEvents="dayEvents"
        v-model:editingEventId="editingEventId"
        @addEvent="addEvent"
        @deleteEvent="deleteEvent" />

</template>