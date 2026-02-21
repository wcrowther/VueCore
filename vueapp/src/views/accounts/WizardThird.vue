<script setup>

    const showCalendarDay = ref(false)  
    const selectedDay = ref(null) 

    onMounted(() => console.log('Accounts Wizard Third Mounted'))

    const events = ref(
        [
            { id: 1, date: '2026-02-01', title: 'Standup' },
            { id: 2, date: '2026-02-28', title: 'Standup 2' },
            { id: 3, date: '2026-02-05', title: 'Design Review' },
            { id: 4, date: '2026-02-05', title: 'Followup Meeting' },
            { id: 5, date: '2026-02-13', title: 'Release' }
        ])

    const eventsByDate = (date) =>
        events.value.filter 
        (
            e => e.date === date.toISOString().slice(0, 10)
        )

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

    const handleEventModalClick = () => 
    { 
        showCalendarDay.value = true
        console.log('handleEventModalClick', showCalendarDay.value) 
    }

</script>

<template>

    <div class="font-bold mb-3">Calendar Control</div>

    <CalendarControl @drop="onDropEvent" class="border border-gray mb-10 m-5"
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

			</div>
        </template>
        
        <!-- Template for single day -->
        <template #default="{ date }">

            <!-- Day number -->
            <div class="text-sm font-bold mb-1 select-none hover:opacity-50 z-50"
                @click="handleEventModalClick">
                {{ date.getDate() }}
            </div>

            <!-- Events -->
            <div class="space-y-1">
                <template v-for="event in eventsByDate(date)" :key="event.id" >
                    <div draggable="true"
                        @dragstart="onDragStart($event, event)"
                        class="bg-blue-500 text-white text-xs px-3 py-[2px] rounded-full cursor-move flex items-center justify-between">
                        <span>{{ event.title }}</span>
                        <span @click.stop="deleteEvent(event.id)" 
                            class="ml-1 cursor-pointer text-white/80 hover:text-white/100">×</span>
                    </div>
                </template>

            </div>

        </template>

    </CalendarControl>

    <CalendarDayModal 
        v-model:showCalendarDay="showCalendarDay" 
        v-model:calendarDay="selectedDay" />

</template>