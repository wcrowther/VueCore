<script setup>

    const calendarDate      = defineModel('calendarDate', { type: Date, default: null })
    const dayEvents         = defineModel('dayEvents', 
                                {   
                                    type: Array, 
                                    default: [],
                                    validator: (value) => value.every(item => item.value instanceof EventModel)
                                })
    const selectedEventId    = defineModel('selectedEventId', { type: Number, default: null })

	const addEvent  = () => console.log('Add an Event')
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
        :title="`Date: ${dateFormat(calendarDate)}`" height="500px" width="500px" 
        @closeModal="calendarDate=null" >

        
        <div class="p-5 pb-0">
            <div v-if="dayEvents && dayEvents.length > 0" v-for="event in dayEvents" 
                :class="event.id === selectedEventId ? 'bg-yellow-200' : ''">
                {{ event.id }} {{ event.date }} {{ event.title }}
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
