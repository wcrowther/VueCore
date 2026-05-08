<script setup>

    const {width: windowWidth}  = useWindowSize()

    const calendarDate          = defineModel('calendarDate', { type: Date, default: null })
    const editingEventId        = defineModel('editingEventId', { type: Number, default: null })
    const dayEvents             = defineModel('dayEvents', 
                                {   
                                    type: Array, 
                                    default: [],
                                    validator: (value) => value.every(item => item instanceof EventModel )
                                })
                          
    const keysOn = ref(true)

    const emit = defineEmits(['addEvent','deleteEvent'])

	const addEvent  = () => 
    {
        if (calendarDate.value) 
            emit('addEvent', calendarDate.value)
    }

    const goToEvent = (delta) => 
    {
        if (!dayEvents.value || dayEvents.value.length === 0) return

        const len = dayEvents.value.length
        let currentIndex = dayEvents.value.findIndex(e => e.id === editingEventId.value)
        if (currentIndex === -1) 
        {
            editingEventId.value = dayEvents.value[delta > 0 ? 0 : len - 1].id
            return
        }
        let newIndex = (currentIndex + delta) % len
        if (newIndex < 0) newIndex += len
        editingEventId.value = dayEvents.value[newIndex].id
    }

    const prevDay   = () => calendarDate.value = addDays(calendarDate.value, -1)
    const nextDay   = () => calendarDate.value = addDays(calendarDate.value, 1)
    const prevEvent = () => goToEvent(-1)
    const nextEvent = () => goToEvent(1)

    const showModal = computed(() => calendarDate ? true : false)

    // Keyboard Listeners  ================================================

	DisableGlobalKeys(calendarDate) // disable Esc key if modal is showing

	const keys = function (e)   
    {
		if (e.code === 'Escape'){ calendarDate.value=null; e.preventDefault();}
        else if (e.code === 'ArrowLeft')  { prevDay();     e.preventDefault();} 
        else if (e.code === 'ArrowRight') { nextDay();     e.preventDefault();} 
        else if (e.code === 'PageUp')     { prevEvent();   e.preventDefault();} 
        else if (e.code === 'PageDown')   { nextEvent();   e.preventDefault();} 
    }

	KeyboardListeners(keys, keysOn)

    const modalWidth = computed(() => windowWidth.value > 500 ? '500px' : `${windowWidth.value}px`)


</script> 

<template>   

	<ModalControl id="EventModal" v-model=showModal 
        height="500px" :width="modalWidth" @closeModal="calendarDate=null" >

        <template #header>
            <div class="w-full grid items-center grid-cols-8">
                <div class="col-span-5 text-sm xxs:text-base">{{ weekdayFull(calendarDate) }}</div>
                <div class="flex justify-center items-center col-span-2">
                    <div class="size-7 mr-2 bg-white/50 hover:bg-color-light-blue rounded-full flex-center"
                        @click="prevDay">
                        <IconSymbol width="22px" class="text-blue" icon="material-symbols-light:arrow-back-2" />
                    </div>
                    <div class="size-7 bg-white/50 hover:bg-color-light-blue rounded-full flex-center"
                        @click="nextDay">
                        <IconSymbol width="22px" class="text-blue" icon="material-symbols-light:play-arrow" />
                    </div>
                </div>
                <div class="colspan-1 justify-self-end">
                    <div class="size-7 bg-white/50 hover:bg-color-light-blue rounded-full flex-center"
                        @click="calendarDate=null">
                        <IconSymbol width="18px" class="text-color-dark-gray" icon="heroicons-solid:x" />
                    </div>
                </div>
            </div>

        </template>

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
            <button class="ml-4 text-xs mr-auto outline-none" @click="keysOn=!keysOn">
                {{ (keysOn ?'Keys On':'Keys OFF') }}
            </button>

            <button class="btn-primary" @click="addEvent">Add</button>
            <button class="btn-delete"  @click="calendarDate=null">Close</button>
        </template>

	</ModalControl>

</template>


<!-- Usage:

    <EventModal v-model:showEventEditModal="showEventEditModel" />
-->
