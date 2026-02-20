<script setup>

    // const showEventEditModal    = defineModel('showEventEditModal', { type: Boolean, required: true })
    const eventModel            = defineModel('eventModel', { type: EventModel, required: true })

	const addEvent = () => console.log('Add an Event')
    const showModal = computed(() => eventModel ? true : false)
    
    // Keyboard Listeners  ================================================

	DisableLayoutEscapeKey(eventModel.value) // disable Esc key if modal is showing

	const keys = function (e)   
    {
		if (e.code === 'Escape'){ eventModel.value=null; e.preventDefault(); } 
    }

	KeyboardListeners(keys)

</script> 

<template>   

	<ModalControl id="EventModal" :showModal
        title="Add an Event" height="500px" width="500px" 
        @closeModal="eventModel=null" >

        <div class="p-5 pb-0">
            <TextInput labelName="Title" placeholder="Event Name" 
                v-model="eventModel.title" 
                title="Update the event name." />
        </div>

        <template #footer>
            <button class="btn-primary" @click="addEvent">Add</button>
            <button class="btn-delete"  @click="eventModel=null">Close</button>
        </template>

	</ModalControl>

</template>


<!-- Usage:

    <EventModal v-model:showEventEditModal="showEventEditModel" />
-->
