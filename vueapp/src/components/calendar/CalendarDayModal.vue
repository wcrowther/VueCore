<script setup>

    const calendarDate      = defineModel('calendarDate', { type: Date, default: null })
    const selectedEventId   = defineModel('selectedEventId', { type: Number, default: null })
    const editingEventId    = defineModel('editingEventId', { type: Number, default: null })
    const dayEvents         = defineModel('dayEvents', 
                              {   
                                  type: Array, 
                                  default: [],
                                  validator: (value) => value.every(item => item instanceof EventModel )
                              })

    const emit = defineEmits(['add'])

	// when the Add button is clicked we propagate the selected date to the parent
	const addEvent  = () => {
        if (calendarDate.value) {
            emit('add', calendarDate.value)
        }
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

	<ModalControl id="EventModal" :showModal title="Events"
        class="overflow-auto"
        height="500px" width="500px" @closeModal="calendarDate=null" >

        <div v-if="dayEvents && dayEvents.length > 0" class="p-5">
            {{`You have the following events for ${dateFormat(calendarDate)}:`}}
        </div>
        <div v-else>
            {{`You have no events for ${dateFormat(calendarDate)}.`}}
        </div>
        <div class="p-5 h-fit">
            <div v-if="dayEvents && dayEvents.length > 0"
                class="border-b border-blue-200">
        
                <template v-for="event in dayEvents" :key="event.id">
                    <CalendarDayEvent :event="event"
                        :selectedEventId="selectedEventId"
                        :editingEventId="editingEventId"
                        @select="selectedEventId = $event"
                        @edit="editingEventId = $event" />
                </template>

            </div>
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
