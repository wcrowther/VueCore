<script setup>
    defineProps({ event: { type: Object, required: true } })

    defineEmits(['dragstart', 'delete', 'select'])
</script>

<template>
    <div draggable="true"
        @dragstart="$emit('dragstart', $event, event)"
        @click="$emit('select', event.date)"
        class="bg-blue-500 text-white text-xs whitespace-nowrap pl-3 py-[2px] h-5 overflow-hidden
            rounded-full cursor-move flex items-center justify-between relative">
        {{ event.title }}
        <span @click.stop="$emit('delete', event.id)" 
            class="text-xs leading-5 cursor-pointer bg-blue-500 size-5 absolute right-0 z-50
            rounded-full text-center text-white/80 hover:text-white/100">×</span>
    </div>
</template>