<script setup>

    const event = defineModel('event', { type: Object, required: true })
	const props = defineProps(
	{ 
		selectedEventId: { type: Number, default: null},	
	})

	const isEdit = ref(false)

	defineEmits(['select'])

	const editEvent = () => { isEdit.value = !isEdit.value; console.log('Edit DayEvent') }

</script>

<template>
	<div @click="$emit('select', event.id)" :title="`EventId: ${event.id}`" 
		:class="['group border border-b-0 border-blue-200 p-2 flex justify-between items-center',
		event.id === selectedEventId ? 'bg-blue-100' : '']">
		<div class="flex justify-center items-center">
			<span class="size-5 mr-1">
				<IconSymbol v-if="event.id === selectedEventId" width="20px" 
					class="text-blue-400" icon="material-symbols-light:play-arrow" />
			</span>
			<span class="mr-2">{{ event.time }}</span>
			{{ event.title }}
		</div>
		<IconSymbol @click="editEvent" class="hidden group-hover:block text-color-dark-gray mr-1" icon="heroicons:pencil-square-solid" />
	</div>
	<div v-if="isEdit" class="border-blue-200 border-x p-3 text-center">
		Edit controls here.
	</div>
</template>
