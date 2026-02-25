<script setup>

    const selectedDate      = ref(null)

    onMounted(() => console.log('Calendar Example Mounted'))

    const events = ref(
        [
            new EventModel(1, '2026-02-01', 'Standup'),
            new EventModel(2, '2026-02-28', 'Standup 2'),
            new EventModel(3, '2026-02-05', 'Design Review'),
            new EventModel(4, '2026-02-05', 'Followup Meeting'),
            new EventModel(5, '2026-02-13', 'Release')
        ])

    const eventsByDate = (date) => 
    {
        let days =  events.value.filter (e => e.date === dateISO(date))
        console.log(`eventsByDate ${dateISO(date)}`, days)
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

    const addEvent = (date) => {
        const newId = Math.max(...events.value.map(e => e.id), 0) + 1
        events.value.push({
            id: newId,
            date: date.toISOString().slice(0, 10),
            title: 'New Event'
        })
    }

    const deleteEvent = (eventId) => {
        const index = events.value.findIndex(e => e.id === eventId)
        if (index !== -1) 
        {
            events.value.splice(index, 1)
        }
    }

    const selectDay = (date) => 
    { 
        selectedDate.value = date

        console.log('handleEventModalClick', dateFormat(selectedDate.value)) 
    }

    const dayEvents = computed(() => 
    {
        let days = selectedDate.value ? eventsByDate(selectedDate.value) : null
        // console.log('dayEvents', days)
        return days
    })

</script>

<template>

    <div class="font-bold mb-3">Calendar Control</div>

    <div class="mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident 
        dolor ullam voluptas error esse necessitatibus quis deleniti nesciunt? 
        Illum officia corporis dignissimos nam consequatur!
    </div>

    <CalendarControl @drop="onDropEvent" class="border border-gray mb-10"
        :dateInMonth>

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
                {{ selectedDate ? dateISO(selectedDate) :'' }}
			</div>
        </template>
        
        <!-- Template for single day -->
        <template #default="{ date }">

            <!-- Day number -->
            <div class="text-sm font-bold mb-1 select-none hover:opacity-50 z-50"
                @click="selectDay(date)">
                {{ date.getDate() }}
            </div>

            <!-- Events -->
            <div class="space-y-1">

                <template v-for="event in eventsByDate(date)" :key="event.id" >
                    <CalendarEvent :event="event" 
                        @dragstart="onDragStart" @delete="deleteEvent" />
                </template>

            </div>

        </template>

    </CalendarControl>

    <CalendarDayModal v-if="selectedDate"
        v-model:calendarDate="selectedDate" v-model:dayEvents="dayEvents" />

</template>