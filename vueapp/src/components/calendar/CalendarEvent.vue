<script setup>

    defineProps({ event: { type: Object, required: true } })
    defineEmits(['dragstart', 'select'])

</script>

<template>
    <div draggable="true"
        :title="`Time: ${event.time} EventId: ${event.id}`" 
        @dragstart="$emit('dragstart', $event, event)"
        @click="$emit('select', { date: event.date, eventId: event.id })"
        class="bg-blue-500 text-white text-xs whitespace-nowrap px-2 py-[2px] h-5 
            rounded-full cursor-move flex items-center justify-between relative">
        <div class="overflow-hidden">
            <span class="mr-1">{{ event.time }}</span> {{ event.title }}
        </div>
    </div>
</template>

<!-- Removed delete. Now is done in CalenderDayModal       
    <span @click.stop="$emit('delete', event.id)" 
        class="text-xs leading-5 cursor-pointer bg-blue-500 size-5 absolute right-0 z-50
        rounded-full text-center text-white/80 hover:text-white/100">×</span>
-->