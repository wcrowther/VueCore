<script setup>

    const appStore              = useAppStore()   
    const calendarStore         = useCalendarStore()
  
    const { showJsonEntities }  = storeToRefs(appStore)
    const { events }            = storeToRefs(calendarStore)
    const { eventsByDate }      = calendarStore

    const { createConfirm }     = useConfirmControl()

    const selectedDate      = ref(null)
    const editingEventId    = ref(null)
    const nextEventId       = ref(1)

    // onMounted(() => console.log('Calendar Example Mounted'))

    const dateInMonth = computed(() => new Date() )
    const dayEvents   = computed(() => selectedDate.value ? eventsByDate(selectedDate.value) : null)

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

    <div class="text-lg font-bold mb-7">
        CalendarGrid Example
    </div>

    <div class="mb-5">
        A fully interactive monthly calendar built with slot-based customization. Events can be 
        <b>dragged and dropped</b> between days, and clicking a day opens a <b>day detail modal</b> 
        where events can be added, edited, or deleted (with a confirm prompt before deletion). 
        The calendar header exposes navigation slots for previous/next month and a Today button. 
        Both the header and each day cell are fully templatable via named slots.
    </div>

    <JsonTreeControl v-if="showJsonEntities" label="Normalized Data" :json="normalizedData" class="mb-7" />

    <CalendarGrid :dateInMonth @drop="onDropEvent" 
        class="border border-gray mb-10">

        <!-- Calendar header -->
        <template #title="{monthYear, timeZone, prevMonth, nextMonth, toToday}">
            <!-- Custom Implementation -->
            <div class="flex justify-between items-center bg-blue-200 p-5">
                <button @click="prevMonth" class="text-blue select-none">◀</button>
                <div class="hidden w-14 bg-amber-100"></div>
                <div class="text-lg text-center font-bold w-3/5">
                    {{ monthYear }} 
                </div>
                <button @click="toToday" class="hidden border border-blue-400 px-3 py-[2px] rounded-full bg-amber-100">Today</button>
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