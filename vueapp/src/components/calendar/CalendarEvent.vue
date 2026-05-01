<script setup>

    defineProps({ event: { type: Object, required: true } })
    defineEmits(['dragstart', 'select'])

</script>

<template>
    <div draggable="true"
        :title="`Time: ${event.time} EventId: ${event.id}`" 
        @dragstart="$emit('dragstart', $event, event)"
        @click="$emit('select', { date: event.date, eventId: event.id })"
        class="bg-blue-500 text-white text-xs whitespace-nowrap pl-2 pr-[10px] py-[2px] h-5 
            rounded-full cursor-move flex items-center justify-between relative">
        <div class="overflow-hidden">
            <span class="mr-1">{{ event.time }}</span> {{ event.title }}
        </div>
    </div>
</template>
