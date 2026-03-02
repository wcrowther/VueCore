<script setup>

    const calendarDate      = defineModel('calendarDate', { type: Date, default: null })
    const editingEventId    = defineModel('editingEventId', { type: Number, default: null })
    const dayEvents         = defineModel('dayEvents', 
                              {   
                                  type: Array, 
                                  default: [],
                                  validator: (value) => value.every(item => item instanceof EventModel )
                              })

    const emit = defineEmits(['addEvent','deleteEvent'])

	const addEvent  = () => 
    {
        if (calendarDate.value) 
            emit('addEvent', calendarDate.value)
    }

    const showModal = computed(() => calendarDate ? true : false)

    // Keyboard Listeners  ================================================

	DisableLayoutEscapeKey(calendarDate) // disable Esc key if modal is showing

	const keys = function (e)   
    {
		if (e.code === 'Escape'){ calendarDate.value=null; e.preventDefault(); } 
    }

	KeyboardListeners(keys)

</script> 

<template>   

	<ModalControl id="EventModal" :showModal 
        :title="weekdayFull(calendarDate)"
        class="overflow-auto"
        height="500px" width="500px" @closeModal="calendarDate=null" >

        <div v-if="!dayEvents || dayEvents.length === 0" class="p-5 text-center">
            {{`You have no events for ${dateFormat(calendarDate)}.`}}
        </div>
        <div v-else class="p-5">
            <InfoBox class="text-center">
                Click on the Event to edit and save by pressing the Enter key.
            </InfoBox>
        </div>

        <div v-if="dayEvents && dayEvents.length > 0"
            class="pb-5 px-5 h-fit">
            <template v-for="event in dayEvents" :key="event.id">
                <CalendarDayEvent :event="event" class="mb-3"
                    v-model:editingEventId="editingEventId" 
                    @deleteEvent="$emit('deleteEvent', $event)"/>
            </template>
        </div>
        
        <template #footer>
            <button class="btn-primary" @click="addEvent">Add</button>
            <button class="btn-delete"  @click="calendarDate=null">Close</button>
        </template>

	</ModalControl>

</template>


<!-- Usage:

    <EventModal v-model:showEventEditModal="showEventEditModel" />
-->
