<script setup>

    const showCalendarDay   = defineModel('showCalendarDay', { type: Boolean, required: true })
    const dayEvents         = defineModel('dayEvents', 
                                {   
                                    type: Array, 
                                    required: true,
                                    validator: (value) => value.every(item => item instanceof EventModel)
                                })

	const addEvent  = () => console.log('Add an Event')
    const showModal = computed(() => calendarDay ? true : false)
    
    // Keyboard Listeners  ================================================

	DisableLayoutEscapeKey(calendarDay.value) // disable Esc key if modal is showing

	const keys = function (e)   
    {
		if (e.code === 'Escape'){ calendarDay.value=null; e.preventDefault(); } 
    }

	KeyboardListeners(keys)

</script> 

<template>   

	<ModalControl id="EventModal" :showModal
        title="Add an Event" height="500px" width="500px" 
        @closeModal="showCalendarDay=false" >

        <!-- 
        <div class="p-5 pb-0">
            <TextInput labelName="Title" placeholder="Event Name" 
                v-model="eventModel.title" 
                title="Update the event name." />
        </div> 
        -->

        <template #footer>
            <button class="btn-primary" @click="addEvent">Add</button>
            <button class="btn-delete"  @click="showCalendarDay=false">Close</button>
        </template>

	</ModalControl>

</template>


<!-- Usage:

    <EventModal v-model:showEventEditModal="showEventEditModel" />
-->
